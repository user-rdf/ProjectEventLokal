-- 03_views.sql

-- View 1: Public Events (untuk GET /events)
CREATE OR REPLACE VIEW v_public_events AS
SELECT 
    e.id, e.title, e.slug, e.category, e.venue, e.starts_at, e.ends_at,
    MIN(tt.price_idr) as min_price,
    SUM(tt.quota - tt.sold) as total_available_seats
FROM events e
JOIN ticket_types tt ON e.id = tt.event_id
WHERE e.status = 'published' AND e.ends_at > NOW()
GROUP BY e.id;

-- View 2: Event Stats (untuk GET /manage/home)
CREATE OR REPLACE VIEW v_event_stats AS
SELECT 
    e.id, e.organizer_id, e.title, e.slug, e.status, e.starts_at, e.ends_at,
    CASE 
        WHEN e.starts_at > NOW() THEN 'upcoming'
        WHEN e.ends_at < NOW() THEN 'finished'
        ELSE 'ongoing'
    END as phase,
    (SELECT COUNT(*) FROM bookings b WHERE b.event_id = e.id AND b.status = 'confirmed') as total_registered,
    (SELECT COUNT(*) FROM check_ins c WHERE c.event_id = e.id) as total_checked_in
FROM events e;

-- View 3: Ticket Revenue (untuk GET /manage/events/{id}/reports/summary)
CREATE OR REPLACE VIEW v_ticket_type_revenue AS
SELECT 
    e.id as event_id, e.title as event_title,
    tt.id as ticket_type_id,
    tt.name as ticket_type_name, tt.price_idr, tt.quota,
    tt.sold as quantity_sold,
    (tt.sold * tt.price_idr) as total_revenue,
    (SELECT COUNT(*) FROM check_ins c JOIN tickets t ON c.ticket_id = t.id
       JOIN bookings b ON b.id = t.booking_id
      WHERE b.ticket_type_id = tt.id) as checked_in_count
FROM events e
JOIN ticket_types tt ON e.id = tt.event_id;