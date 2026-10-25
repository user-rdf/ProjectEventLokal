-- 04_seed.sql
-- Password untuk keduanya adalah 'password123' (hash bcrypt dari 'password123' adalah $2b$12$...)
-- Hash bcrypt untuk 'password123': $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G4f4h3Z4K5K5K5

INSERT INTO users (name, email, password_hash, role) VALUES
('Panitia Demo', 'organizer@eventlokal.test', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G4f4h3Z4K5K5K5', 'organizer'),
('Staf Scanner', 'staff@eventlokal.test', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G4f4h3Z4K5K5K5', 'staff');

-- Event Demo
INSERT INTO events (organizer_id, title, slug, category, venue, starts_at, ends_at, status) 
SELECT id, 'Workshop Python Dasar', 'workshop-python-dasar', 'Workshop', 'Lab Komputer A', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '4 hours', 'published' FROM users WHERE email = 'organizer@eventlokal.test';

-- Ticket Types (Kuota 3, gratis)
INSERT INTO ticket_types (event_id, name, price_idr, quota, sold)
SELECT id, 'Reguler', 0, 3, 3 FROM events WHERE slug = 'workshop-python-dasar';

-- Bookings (2 orang sudah penuh)
INSERT INTO bookings (event_id, ticket_type_id, attendee_name, attendee_email, attendee_phone, status)
SELECT e.id, t.id, 'Budi Santoso', 'budi@test.com', '081234567890', 'confirmed' FROM events e JOIN ticket_types t ON e.id = t.event_id WHERE e.slug = 'workshop-python-dasar';

INSERT INTO bookings (event_id, ticket_type_id, attendee_name, attendee_email, attendee_phone, status)
SELECT e.id, t.id, 'Siti Aminah', 'siti@test.com', '081234567891', 'confirmed' FROM events e JOIN ticket_types t ON e.id = t.event_id WHERE e.slug = 'workshop-python-dasar';

-- Waitlist (2 orang antre)
INSERT INTO waitlist_entries (ticket_type_id, attendee_name, attendee_email, attendee_phone, status)
SELECT t.id, 'Antre 1', 'antre1@test.com', '081234567892', 'waiting' FROM ticket_types t JOIN events e ON t.event_id = e.id WHERE e.slug = 'workshop-python-dasar';

INSERT INTO waitlist_entries (ticket_type_id, attendee_name, attendee_email, attendee_phone, status)
SELECT t.id, 'Antre 2', 'antre2@test.com', '081234567893', 'waiting' FROM ticket_types t JOIN events e ON t.event_id = e.id WHERE e.slug = 'workshop-python-dasar';
