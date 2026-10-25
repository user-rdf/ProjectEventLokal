-- 04_seed.sql
-- Akun demo (password keduanya: password123)
--   organizer@eventlokal.test  (role organizer)
--   staff@eventlokal.test      (role staff)
-- Hash di bawah adalah bcrypt asli dari 'password123' (cost 10), bisa diverifikasi oleh bcrypt.checkpw.

INSERT INTO users (name, email, password_hash, role) VALUES
('Panitia EventLokal', 'organizer@eventlokal.test', '$2b$10$VhlO1.b1QUgHn0sr7fbrwebMUwZSWzLHzPFSpePXFrysor4I0oMa6', 'organizer'),
('Staf Scanner', 'staff@eventlokal.test', '$2b$10$VhlO1.b1QUgHn0sr7fbrwebMUwZSWzLHzPFSpePXFrysor4I0oMa6', 'staff');

-- Event Demo 1: kuota kecil, sudah penuh, ada antrean (untuk demo cancel -> promosi waitlist)
INSERT INTO events (organizer_id, title, slug, category, description, venue, starts_at, ends_at, status) 
SELECT id, 'Workshop Python Dasar', 'workshop-python-dasar', 'workshop',
       'Belajar dasar pemrograman Python untuk pemula: variabel, tipe data, perulangan, dan fungsi praktis.',
       'Lab Komputer A, Gedung Fasilkom', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '4 hours', 'published'
FROM users WHERE email = 'organizer@eventlokal.test';

-- Ticket Types (Kuota 3, gratis). sold diisi oleh checkout() di bawah, jadi mulai dari 0.
INSERT INTO ticket_types (event_id, name, price_idr, quota)
SELECT id, 'Reguler', 0, 3 FROM events WHERE slug = 'workshop-python-dasar';

-- Event Demo 2: Seminar berbayar, kuota melimpah
INSERT INTO events (organizer_id, title, slug, category, description, venue, starts_at, ends_at, status)
SELECT id, 'Seminar Karier Teknologi & Startup', 'seminar-karier-teknologi', 'seminar',
       'Diskusi panel bersama praktisi industri software engineering & product management tentang roadmap karier teknologi masa kini.',
       'Aula Utama Gedung Rektorat Lt. 3', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '3 hours', 'published'
FROM users WHERE email = 'organizer@eventlokal.test';

INSERT INTO ticket_types (event_id, name, price_idr, quota)
SELECT id, n.name, n.price, n.quota
FROM events e CROSS JOIN (VALUES ('Mahasiswa', 25000, 50), ('Umum', 50000, 80)) AS n(name, price, quota)
WHERE e.slug = 'seminar-karier-teknologi';

-- Event Demo 3: Festival Musik Akustik Kampus
INSERT INTO events (organizer_id, title, slug, category, description, venue, starts_at, ends_at, status)
SELECT id, 'Festival Musik Akustik Kampus', 'festival-musik-akustik-kampus', 'konser',
       'Malam apresiasi seni musik akustik mahasiswa menghadirkan band indie kampus dan penampilan musisi bintang tamu lokal.',
       'Amfiteater Terbuka Kampus Barat', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '5 hours', 'published'
FROM users WHERE email = 'organizer@eventlokal.test';

INSERT INTO ticket_types (event_id, name, price_idr, quota)
SELECT id, n.name, n.price, n.quota
FROM events e CROSS JOIN (VALUES ('Presale Mahasiswa', 35000, 100), ('Reguler', 60000, 150), ('VIP Depan Panggung', 120000, 30)) AS n(name, price, quota)
WHERE e.slug = 'festival-musik-akustik-kampus';

-- Event Demo 4: Turnamen E-Sport Championship
INSERT INTO events (organizer_id, title, slug, category, description, venue, starts_at, ends_at, status)
SELECT id, 'Turnamen E-Sport Championship', 'turnamen-esport-championship', 'kompetisi',
       'Kompetisi game Mobile Legends & Valorant antar perguruan tinggi dan komunitas gamer lokal berhadiah total jutaan rupiah.',
       'Auditorium Kampus Lt. 2', NOW() + INTERVAL '14 days', NOW() + INTERVAL '15 days', 'published'
FROM users WHERE email = 'organizer@eventlokal.test';

INSERT INTO ticket_types (event_id, name, price_idr, quota)
SELECT id, n.name, n.price, n.quota
FROM events e CROSS JOIN (VALUES ('Slot Tim Mahasiswa', 75000, 32), ('Tiket Penonton', 15000, 200)) AS n(name, price, quota)
WHERE e.slug = 'turnamen-esport-championship';

-- Event Demo 5: Pameran Seni Visual & Desain Grafis
INSERT INTO events (organizer_id, title, slug, category, description, venue, starts_at, ends_at, status)
SELECT id, 'Pameran Seni Visual & Desain', 'pameran-seni-visual-desain', 'seni',
       'Pameran galeri interaktif menampilkan karya instalasi seni visual, ilustrasi digital, dan fotografi human interest mahasiswa.',
       'Galeri Seni & Kebudayaan Kampus', NOW() + INTERVAL '18 days', NOW() + INTERVAL '20 days', 'published'
FROM users WHERE email = 'organizer@eventlokal.test';

INSERT INTO ticket_types (event_id, name, price_idr, quota)
SELECT id, 'Tiket Masuk Reguler', 10000, 300 FROM events WHERE slug = 'pameran-seni-visual-desain';

-- Event Demo 6: Malam Keakraban Himpunan (draft - tidak tampil publik)
INSERT INTO events (organizer_id, title, slug, category, description, venue, starts_at, ends_at, status)
SELECT id, 'Malam Keakraban Himpunan', 'malam-keakraban-himpunan', 'himpunan',
       'Acara internal temu alumni dan keakraban mahasiswa baru.',
       'Gedung Serbaguna Kampus', NOW() + INTERVAL '25 days', NOW() + INTERVAL '25 days' + INTERVAL '5 hours', 'draft'
FROM users WHERE email = 'organizer@eventlokal.test';

INSERT INTO ticket_types (event_id, name, price_idr, quota)
SELECT id, 'Anggota Himpunan', 0, 100 FROM events WHERE slug = 'malam-keakraban-himpunan';

-- Bookings lewat checkout() supaya sold, payment, dan tiket konsisten
SELECT checkout(t.id, 'Budi Santoso', 'budi@test.com', '081234567890')
FROM ticket_types t JOIN events e ON e.id = t.event_id WHERE e.slug = 'workshop-python-dasar';

SELECT checkout(t.id, 'Siti Aminah', 'siti@test.com', '081234567891')
FROM ticket_types t JOIN events e ON e.id = t.event_id WHERE e.slug = 'workshop-python-dasar';

SELECT checkout(t.id, 'Rina Wijaya', 'rina@test.com', '081234567894')
FROM ticket_types t JOIN events e ON e.id = t.event_id WHERE e.slug = 'workshop-python-dasar';

SELECT checkout(t.id, 'Andi Pratama', 'andi@test.com', '081234567895')
FROM ticket_types t JOIN events e ON e.id = t.event_id
WHERE e.slug = 'seminar-karier-teknologi' AND t.name = 'Mahasiswa';

SELECT checkout(t.id, 'Dewi Lestari', 'dewi@test.com', '081234567896')
FROM ticket_types t JOIN events e ON e.id = t.event_id
WHERE e.slug = 'festival-musik-akustik-kampus' AND t.name = 'Presale Mahasiswa';

-- Waitlist (2 orang antre di event workshop yang sudah penuh)
SELECT join_waitlist(t.id, 'Antre Satu', 'antre1@test.com', '081234567892')
FROM ticket_types t JOIN events e ON t.event_id = e.id WHERE e.slug = 'workshop-python-dasar';

SELECT join_waitlist(t.id, 'Antre Dua', 'antre2@test.com', '081234567893')
FROM ticket_types t JOIN events e ON t.event_id = e.id WHERE e.slug = 'workshop-python-dasar';
