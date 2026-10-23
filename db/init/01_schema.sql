-- 01_schema.sql
-- Pastikan extension sudah ada (dari 00_extensions.sql)
-- CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE user_role AS ENUM ('organizer', 'staff');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE ticket_status AS ENUM ('valid', 'used', 'void');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE waitlist_status AS ENUM ('waiting', 'promoted', 'cancelled');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'organizer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    venue TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status event_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_event_time CHECK (ends_at > starts_at)
);

CREATE TABLE ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price_idr INTEGER NOT NULL DEFAULT 0,
    quota INTEGER NOT NULL CHECK (quota > 0),
    sold INTEGER NOT NULL DEFAULT 0 CHECK (sold <= quota),
    CONSTRAINT chk_price CHECK (price_idr >= 0)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE RESTRICT,
    attendee_name VARCHAR(100) NOT NULL,
    attendee_email CITEXT NOT NULL,
    attendee_phone VARCHAR(20) NOT NULL,
    status booking_status DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_phone_format CHECK (attendee_phone ~ '^\+?[0-9\s\-]{8,15}$')
);
-- Unik email per event untuk booking yang aktif
CREATE UNIQUE INDEX idx_unique_active_booking_per_event 
ON bookings(event_id, attendee_email) WHERE status IN ('pending', 'confirmed');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    amount_idr INTEGER NOT NULL,
    status payment_status DEFAULT 'pending',
    paid_at TIMESTAMPTZ
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    status ticket_status DEFAULT 'valid',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE CASCADE,
    attendee_name VARCHAR(100) NOT NULL,
    attendee_email CITEXT NOT NULL,
    attendee_phone VARCHAR(20) NOT NULL,
    status waitlist_status DEFAULT 'waiting',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    promoted_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX idx_unique_waitlist_per_ticket_type 
ON waitlist_entries(ticket_type_id, attendee_email) WHERE status = 'waiting';

CREATE TABLE check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID UNIQUE REFERENCES tickets(id) ON DELETE RESTRICT,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    staff_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL
);