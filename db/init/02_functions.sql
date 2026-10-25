-- 02_functions.sql

-- Helper untuk raise custom error
CREATE OR REPLACE FUNCTION raise_error(p_code TEXT, p_message TEXT)
RETURNS VOID AS $$
BEGIN
    RAISE EXCEPTION '%', p_message USING ERRCODE = p_code;
END;
$$ LANGUAGE plpgsql;

-- 1. CHECKOUT (Atomik)
CREATE OR REPLACE FUNCTION checkout(
    p_ticket_type_id UUID,
    p_name VARCHAR,
    p_email CITEXT,
    p_phone VARCHAR
) RETURNS JSON AS $$
DECLARE
    v_event_id UUID;
    v_quota INTEGER;
    v_sold INTEGER;
    v_price INTEGER;
    v_event_status event_status;
    v_event_ends TIMESTAMPTZ;
    v_booking_id UUID;
    v_ticket_code VARCHAR;
BEGIN
    -- Kunci baris ticket_types untuk mencegah race condition
    SELECT tt.event_id, tt.quota, tt.sold, tt.price_idr, e.status, e.ends_at
      INTO v_event_id, v_quota, v_sold, v_price, v_event_status, v_event_ends
      FROM ticket_types tt
      JOIN events e ON e.id = tt.event_id
     WHERE tt.id = p_ticket_type_id
       FOR UPDATE OF tt;

    IF NOT FOUND THEN
        PERFORM raise_error('EL002', 'Kategori tiket tidak ditemukan');
    END IF;

    -- Event harus sudah dipublikasikan dan belum selesai
    IF v_event_status <> 'published' OR v_event_ends <= NOW() THEN
        PERFORM raise_error('EL002', 'Event tidak tersedia untuk pendaftaran');
    END IF;

    -- Cek kuota
    IF v_sold >= v_quota THEN
        PERFORM raise_error('EL001', 'Kuota tiket untuk kategori ini telah habis');
    END IF;

    -- Cek email sudah booking di event ini
    IF EXISTS (SELECT 1 FROM bookings WHERE event_id = v_event_id AND attendee_email = p_email AND status IN ('pending', 'confirmed')) THEN
        PERFORM raise_error('EL003', 'Email ini sudah terdaftar untuk event tersebut');
    END IF;

    -- Cek email sudah di waitlist
    IF EXISTS (SELECT 1 FROM waitlist_entries WHERE ticket_type_id = p_ticket_type_id AND attendee_email = p_email AND status = 'waiting') THEN
        PERFORM raise_error('EL003', 'Email ini sudah berada di daftar tunggu');
    END IF;

    -- Update sold
    UPDATE ticket_types SET sold = sold + 1 WHERE id = p_ticket_type_id;

    -- Buat booking
    INSERT INTO bookings (event_id, ticket_type_id, attendee_name, attendee_email, attendee_phone, status)
    VALUES (v_event_id, p_ticket_type_id, p_name, p_email, p_phone, 'confirmed')
    RETURNING id INTO v_booking_id;

    -- Buat payment (simulasi)
    INSERT INTO payments (booking_id, amount_idr, status, paid_at)
    VALUES (v_booking_id, v_price, 'paid', NOW());

    -- Buat ticket (12 karakter hex acak dari UUID v4, bukan MD5(RANDOM()))
    v_ticket_code := 'TKT-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', '') FROM 1 FOR 12));
    INSERT INTO tickets (booking_id, code, status)
    VALUES (v_booking_id, v_ticket_code, 'valid');

    RETURN json_build_object(
        'booking_id', v_booking_id,
        'event_id', v_event_id,
        'ticket_type_id', p_ticket_type_id,
        'ticket_code', v_ticket_code,
        'attendee_name', p_name,
        'attendee_email', p_email
    );
END;
$$ LANGUAGE plpgsql;

-- 2. JOIN WAITLIST
CREATE OR REPLACE FUNCTION join_waitlist(
    p_ticket_type_id UUID,
    p_name VARCHAR,
    p_email CITEXT,
    p_phone VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_sold INTEGER;
    v_quota INTEGER;
BEGIN
    SELECT sold, quota INTO v_sold, v_quota FROM ticket_types WHERE id = p_ticket_type_id FOR UPDATE;
    
    IF NOT FOUND THEN
        PERFORM raise_error('EL002', 'Kategori tiket tidak ditemukan');
    END IF;

    IF v_sold < v_quota THEN
        PERFORM raise_error('EL005', 'Tiket masih tersedia, silakan lakukan pendaftaran biasa');
    END IF;

    IF EXISTS (SELECT 1 FROM waitlist_entries WHERE ticket_type_id = p_ticket_type_id AND attendee_email = p_email AND status = 'waiting') THEN
        PERFORM raise_error('EL003', 'Email sudah berada di daftar tunggu');
    END IF;

    INSERT INTO waitlist_entries (ticket_type_id, attendee_name, attendee_email, attendee_phone, status)
    VALUES (p_ticket_type_id, p_name, p_email, p_phone, 'waiting');
END;
$$ LANGUAGE plpgsql;

-- 3. CANCEL BOOKING
-- Membatalkan booking, void tiket, kembalikan kuota, lalu promosikan antrean tertua
-- (yang belum punya booking aktif di event ini) menjadi booking baru lewat checkout().
-- Mengembalikan JSON: {booking_id, status, promoted: null | hasil checkout()}
CREATE OR REPLACE FUNCTION cancel_booking(p_booking_id UUID)
RETURNS JSON AS $$
DECLARE
    v_ticket_type_id UUID;
    v_event_id UUID;
    v_status booking_status;
    v_wait RECORD;
    v_promoted JSON := NULL;
BEGIN
    -- Ambil data booking
    SELECT ticket_type_id, event_id, status INTO v_ticket_type_id, v_event_id, v_status
    FROM bookings WHERE id = p_booking_id FOR UPDATE;

    IF NOT FOUND THEN
        PERFORM raise_error('EL006', 'Pendaftaran tidak ditemukan');
    END IF;

    -- Mencegah kuota dikembalikan dua kali
    IF v_status = 'cancelled' THEN
        PERFORM raise_error('EL006', 'Pendaftaran sudah dibatalkan');
    END IF;

    -- Cek EL007: Sudah check-in tidak bisa dibatal
    IF EXISTS (SELECT 1 FROM check_ins c JOIN tickets t ON t.id = c.ticket_id WHERE t.booking_id = p_booking_id) THEN
        PERFORM raise_error('EL007', 'Peserta sudah check-in, tidak dapat dibatalkan');
    END IF;

    -- Update booking & ticket
    UPDATE bookings SET status = 'cancelled' WHERE id = p_booking_id;
    UPDATE tickets SET status = 'void' WHERE booking_id = p_booking_id;
    
    -- Kurangi sold
    UPDATE ticket_types SET sold = sold - 1 WHERE id = v_ticket_type_id;

    -- Promosi waitlist tertua
    SELECT w.id, w.attendee_email, w.attendee_name, w.attendee_phone INTO v_wait
    FROM waitlist_entries w
    WHERE w.ticket_type_id = v_ticket_type_id AND w.status = 'waiting'
      AND NOT EXISTS (
          SELECT 1 FROM bookings b
           WHERE b.event_id = v_event_id AND b.attendee_email = w.attendee_email
             AND b.status IN ('pending', 'confirmed'))
    ORDER BY w.joined_at ASC LIMIT 1 FOR UPDATE OF w SKIP LOCKED;

    -- Promosi hanya bila event masih terbuka (checkout akan menolak event yang sudah ditutup)
    IF FOUND AND EXISTS (SELECT 1 FROM events WHERE id = v_event_id AND status = 'published' AND ends_at > NOW()) THEN
        UPDATE waitlist_entries SET status = 'promoted', promoted_at = NOW() WHERE id = v_wait.id;
        -- Buat booking + payment + tiket untuk orang yang naik (transaksi yang sama)
        v_promoted := checkout(v_ticket_type_id, v_wait.attendee_name, v_wait.attendee_email, v_wait.attendee_phone);
    END IF;

    RETURN json_build_object(
        'booking_id', p_booking_id,
        'status', 'cancelled',
        'promoted', v_promoted
    );
END;
$$ LANGUAGE plpgsql;

-- 4. CHECK IN
CREATE OR REPLACE FUNCTION check_in(
    p_event_id UUID,
    p_code VARCHAR,
    p_staff_id UUID
) RETURNS JSON AS $$
DECLARE
    v_ticket_id UUID;
    v_ticket_event_id UUID;
    v_ticket_status ticket_status;
    v_booking_status booking_status;
    v_attendee_name VARCHAR;
    v_ticket_type VARCHAR;
    v_first_check_in TIMESTAMPTZ;
BEGIN
    SELECT t.id, b.event_id, t.status, b.status, b.attendee_name, tt.name
      INTO v_ticket_id, v_ticket_event_id, v_ticket_status, v_booking_status, v_attendee_name, v_ticket_type
      FROM tickets t
      JOIN bookings b ON t.booking_id = b.id
      JOIN ticket_types tt ON tt.id = b.ticket_type_id
     WHERE t.code = p_code
       FOR UPDATE OF t;

    IF NOT FOUND THEN
        RETURN json_build_object('status', 'invalid', 'message', 'Kode tiket tidak valid');
    END IF;

    IF v_ticket_status = 'void' OR v_booking_status = 'cancelled' THEN
        RETURN json_build_object('status', 'cancelled', 'message', 'Tiket ini telah dibatalkan',
                                 'attendee_name', v_attendee_name, 'ticket_type', v_ticket_type);
    END IF;

    IF v_ticket_event_id <> p_event_id THEN
        RETURN json_build_object('status', 'wrong_event', 'message', 'Tiket ini bukan untuk event yang sedang discan',
                                 'attendee_name', v_attendee_name, 'ticket_type', v_ticket_type);
    END IF;

    IF v_ticket_status = 'used' THEN
        SELECT checked_in_at INTO v_first_check_in FROM check_ins WHERE ticket_id = v_ticket_id;
        RETURN json_build_object('status', 'already_used', 'message', 'Tiket sudah dipakai',
                                 'attendee_name', v_attendee_name, 'ticket_type', v_ticket_type,
                                 'first_checked_in_at', v_first_check_in);
    END IF;

    -- Valid: Insert check_in
    INSERT INTO check_ins (ticket_id, event_id, staff_id, checked_in_at)
    VALUES (v_ticket_id, p_event_id, p_staff_id, NOW());

    -- Trigger akan otomatis mengubah status tiket jadi 'used'
    RETURN json_build_object('status', 'valid', 'message', 'Check-in berhasil',
                             'attendee_name', v_attendee_name, 'ticket_type', v_ticket_type);
END;
$$ LANGUAGE plpgsql;

-- TRIGGER 1: Bookings Audit
-- changed_by diisi dari setting transaksi 'app.user_id' (di-set backend lewat set_config(..., true)).
CREATE OR REPLACE FUNCTION audit_bookings_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (
        'bookings',
        CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
        NULLIF(current_setting('app.user_id', true), '')::UUID
    );
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bookings_audit
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW EXECUTE FUNCTION audit_bookings_changes();

-- TRIGGER 2: Check-ins use ticket (Enforce single use via trigger as requested)
CREATE OR REPLACE FUNCTION enforce_single_use_ticket()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tickets SET status = 'used' WHERE id = NEW.ticket_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_ins_use_ticket
AFTER INSERT ON check_ins
FOR EACH ROW EXECUTE FUNCTION enforce_single_use_ticket();