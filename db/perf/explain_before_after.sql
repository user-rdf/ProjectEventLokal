-- =====================================================================
-- Performance proof (IK301): a lookup by attendee email, BEFORE and AFTER an index.
-- This lookup is used by the checkout duplicate check and the manual search at the door.
-- Run in DBeaver (Alt+X) or psql. Save the two plans as screenshots in docs/performance/.
-- Safe to re-run. Cleanup at the bottom.
-- =====================================================================

-- 0) Start from "no index" so BEFORE is reproducible
DROP INDEX IF EXISTS idx_bookings_attendee_email;

-- 1) Load ~60,000 registrations (skipped if already loaded)
DO $$
DECLARE
    tt_ids UUID[];
    v_org_id UUID;
BEGIN
    IF EXISTS (SELECT 1 FROM events WHERE slug = 'perf-event-1') THEN
        RAISE NOTICE 'Perf data already loaded, skipping';
        RETURN;
    END IF;

    -- Ambil salah satu user organizer yang ada, atau buat jika belum ada
    SELECT id INTO v_org_id FROM users WHERE role = 'organizer' LIMIT 1;
    IF v_org_id IS NULL THEN
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Perf Organizer', 'perf.org@example.com', 'hash', 'organizer')
        RETURNING id INTO v_org_id;
    END IF;

    ALTER TABLE bookings DISABLE TRIGGER trg_bookings_audit;     -- keep the bulk load fast

    INSERT INTO events (organizer_id, title, slug, venue, category, starts_at, ends_at, status)
    SELECT v_org_id, 'Perf Event ' || g, 'perf-event-' || g, 'Aula', 'seminar',
           now() + interval '10 days', now() + interval '10 days 3 hours', 'published'::event_status
      FROM generate_series(1, 50) g;

    INSERT INTO ticket_types (event_id, name, price_idr, quota, sold)
    SELECT e.id, n.name, n.price, 100000, 0
      FROM events e CROSS JOIN (VALUES ('Reguler', 50000), ('VIP', 100000), ('Mahasiswa', 25000)) AS n(name, price)
     WHERE e.slug LIKE 'perf-event-%';

    SELECT array_agg(tt.id ORDER BY tt.id) INTO tt_ids
      FROM ticket_types tt JOIN events e ON e.id = tt.event_id WHERE e.slug LIKE 'perf-event-%';

    -- Insert 60,000 bookings
    INSERT INTO bookings (event_id, ticket_type_id, attendee_name, attendee_email, attendee_phone, status)
    SELECT tt.event_id,
           tt.id,
           'Peserta ' || g,
           'perf' || g || '@example.com',
           '081' || lpad(g::text, 8, '0'),
           CASE WHEN g % 20 = 0 THEN 'cancelled'::booking_status ELSE 'confirmed'::booking_status END
      FROM generate_series(1, 60000) g
      JOIN LATERAL (
          SELECT id, event_id FROM ticket_types WHERE id = tt_ids[1 + (g % array_length(tt_ids, 1))]
      ) tt ON true;

    INSERT INTO payments (booking_id, amount_idr, status, paid_at)
    SELECT b.id, tt.price_idr, CASE WHEN b.status = 'cancelled' THEN 'failed'::payment_status ELSE 'paid'::payment_status END, now()
      FROM bookings b JOIN ticket_types tt ON tt.id = b.ticket_type_id
     WHERE b.attendee_email LIKE 'perf%@example.com';

    INSERT INTO tickets (booking_id, code, status)
    SELECT b.id, 'PERF-' || lpad(row_number() OVER ()::text, 10, '0'), CASE WHEN b.status = 'cancelled' THEN 'void'::ticket_status ELSE 'valid'::ticket_status END
      FROM bookings b WHERE b.attendee_email LIKE 'perf%@example.com';

    -- Check-in valid tickets
    INSERT INTO check_ins (ticket_id, event_id, staff_id, checked_in_at)
    SELECT t.id, b.event_id, v_org_id, now()
      FROM tickets t
      JOIN bookings b ON b.id = t.booking_id
     WHERE b.attendee_email LIKE 'perf%@example.com'
       AND t.status = 'valid'
       AND (b.attendee_phone LIKE '%1' OR b.attendee_phone LIKE '%3');

    UPDATE ticket_types tt SET sold = s.n
      FROM (SELECT ticket_type_id, count(*) AS n FROM bookings
             WHERE status = 'confirmed' AND attendee_email LIKE 'perf%@example.com' GROUP BY 1) s
     WHERE tt.id = s.ticket_type_id;

    ALTER TABLE bookings ENABLE TRIGGER trg_bookings_audit;
END $$;

ANALYZE;

-- 2) BEFORE: expect "Seq Scan on bookings" (reads all ~60,000 rows)
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, attendee_name, status FROM bookings WHERE attendee_email = 'perf42424@example.com';

-- 3) Create the index
CREATE INDEX idx_bookings_attendee_email ON bookings (attendee_email);
ANALYZE bookings;

-- 4) AFTER: expect "Index Scan using idx_bookings_attendee_email"
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, attendee_name, status FROM bookings WHERE attendee_email = 'perf42424@example.com';

-- 5) Analytics on the big data set (JOIN + aggregation): revenue per ticket type for one event
EXPLAIN (ANALYZE)
SELECT * FROM v_ticket_type_revenue
 WHERE event_id = (SELECT id FROM events WHERE slug = 'perf-event-7');

-- 6) Cleanup (uncomment to remove the perf data again)
-- ALTER TABLE bookings DISABLE TRIGGER trg_bookings_audit;
-- DELETE FROM check_ins WHERE ticket_id IN (SELECT t.id FROM tickets t JOIN bookings b ON b.id=t.booking_id WHERE b.attendee_email LIKE 'perf%@example.com');
-- DELETE FROM tickets  WHERE booking_id IN (SELECT id FROM bookings WHERE attendee_email LIKE 'perf%@example.com');
-- DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE attendee_email LIKE 'perf%@example.com');
-- DELETE FROM bookings WHERE attendee_email LIKE 'perf%@example.com';
-- ALTER TABLE bookings ENABLE TRIGGER trg_bookings_audit;
-- DELETE FROM ticket_types WHERE event_id IN (SELECT id FROM events WHERE slug LIKE 'perf-event-%');
-- DELETE FROM events WHERE slug LIKE 'perf-event-%';
-- DROP INDEX IF EXISTS idx_bookings_attendee_email;
