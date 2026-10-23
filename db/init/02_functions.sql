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
    v_booking_id UUID;
    v_ticket_code VARCHAR;
BEGIN
    -- Kunci baris ticket_types untuk mencegah race condition
    SELECT event_id, quota, sold INTO v_event_id, v_quota, v_sold
    FROM ticket_types WHERE id = p_ticket_type_id FOR UPDATE;

    IF NOT FOUND THEN
        PERFORM raise_error('EL002', 'Kategori tiket tidak ditemukan');
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
    SELECT v_booking_id, price_idr, 'paid', NOW() FROM ticket_types WHERE id = p_ticket_type_id;

    -- Buat ticket
    v_ticket_code := 'TKT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    INSERT INTO tickets (booking_id, code, status)
    VALUES (v_booking_id, v_ticket_code, 'valid');

    RETURN json_build_object(
        'booking_id', v_booking_id,
        'ticket_code', v_ticket_code,
        'attendee_name', p_name,
        'attendeeEmail', p_email
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
CREATE OR REPLACE FUNCTION cancel_booking(p_booking_id UUID)
RETURNS VOID AS $$
DECLARE
    v_ticket_type_id UUID;
    v_event_id UUID;
    v_waitlist_id UUID;
    v_waitlist_email CITEXT;
    v_waitlist_name VARCHAR;
    v_waitlist_phone VARCHAR;
BEGIN
    -- Ambil data booking
    SELECT ticket_type_id, event_id INTO v_ticket_type_id, v_event_id 
    FROM bookings WHERE id = p_booking_id FOR UPDATE;

    IF NOT FOUND THEN
        PERFORM raise_error('EL006', 'Pendaftaran tidak ditemukan');
    END IF;

    -- Cek EL007: Sudah check-in tidak bisa dibatal
    IF EXISTS (SELECT 1 FROM check_ins WHERE ticket_id IN (SELECT id FROM tickets WHERE booking_id = p_booking_id)) THEN
        PERFORM raise_error('EL007', 'Peserta sudah check-in, tidak dapat dibatalkan');
    END IF;

    -- Update booking & ticket
    UPDATE bookings SET status = 'cancelled' WHERE id = p_booking_id;
    UPDATE tickets SET status = 'void' WHERE booking_id = p_booking_id;
    
    -- Kurangi sold
    UPDATE ticket_types SET sold = sold - 1 WHERE id = v_ticket_type_id;

    -- Promosi waitlist tertua
    SELECT id, attendee_email, attendee_name, attendee_phone 
    INTO v_waitlist_id, v_waitlist_email, v_waitlist_name, v_waitlist_phone
    FROM waitlist_entries 
    WHERE ticket_type_id = v_ticket_type_id AND status = 'waiting' 
    ORDER BY joined_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED;

    IF FOUND THEN
        UPDATE waitlist_entries SET status = 'promoted', promoted_at = NOW() WHERE id = v_waitlist_id;
        -- Di sini backend akan membaca return value atau query ulang untuk kirim email
        -- Untuk simplicity, kita raise notice atau return JSON (opsional, tergantung kebutuhan backend)
    END IF;
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
    v_first_check_in TIMESTAMPTZ;
BEGIN
    SELECT t.id, b.event_id, t.status INTO v_ticket_id, v_ticket_event_id, v_ticket_status
    FROM tickets t
    JOIN bookings b ON t.booking_id = b.id
    WHERE t.code = p_code
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN json_build_object('status', 'invalid', 'message', 'Kode tiket tidak valid');
    END IF;

    IF v_ticket_status = 'void' OR (SELECT status FROM bookings WHERE id = (SELECT booking_id FROM tickets WHERE id = v_ticket_id)) = 'cancelled' THEN
        RETURN json_build_object('status', 'cancelled', 'message', 'Tiket ini telah dibatalkan');
    END IF;

    IF v_ticket_event_id != p_event_id THEN
        RETURN json_build_object('status', 'wrong_event', 'message', 'Tiket ini bukan untuk event yang sedang discan');
    END IF;

    IF v_ticket_status = 'used' THEN
        SELECT checked_in_at INTO v_first_check_in FROM check_ins WHERE ticket_id = v_ticket_id LIMIT 1;
        RETURN json_build_object('status', 'already_used', 'message', 'Tiket sudah dipakai', 'first_checked_in_at', v_first_check_in);
    END IF;

    -- Valid: Insert check_in
    INSERT INTO check_ins (ticket_id, event_id, staff_id, checked_in_at)
    VALUES (v_ticket_id, p_event_id, p_staff_id, NOW());

    -- Trigger akan otomatis mengubah status tiket jadi 'used'
    RETURN json_build_object('status', 'valid', 'message', 'Check-in berhasil');
END;
$$ LANGUAGE plpgsql;

-- TRIGGER 1: Bookings Audit
CREATE OR REPLACE FUNCTION audit_bookings_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES ('bookings', COALESCE(NEW.id, OLD.id), TG_OP, to_jsonb(OLD), to_jsonb(NEW), NULL);
    RETURN COALESCE(NEW, OLD);
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