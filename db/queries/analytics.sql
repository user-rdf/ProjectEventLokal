-- =====================================================================
-- Analytics queries (JOIN + aggregation).
-- Referensi view: db/init/03_views.sql
-- =====================================================================

-- 1. Beranda panitia: event yang sedang berlangsung beserta jumlah pendaftar & kehadiran
SELECT id, title, total_registered AS registered, total_checked_in AS checked_in
  FROM v_event_stats
 WHERE organizer_id = (SELECT id FROM users WHERE email = 'organizer@eventlokal.test' LIMIT 1)
   AND phase = 'ongoing';

-- 2. Laporan finansial: rincian omzet per kategori tiket untuk suatu event
SELECT ticket_type_name AS name, quantity_sold AS sold, quota, total_revenue AS revenue
  FROM v_ticket_type_revenue
 WHERE event_id = (SELECT id FROM events WHERE slug = 'workshop-python-dasar' LIMIT 1);

-- 3. Analitik tingkat kehadiran (attendance rate %) seluruh event
SELECT title, total_registered AS registered, total_checked_in AS checked_in,
       ROUND(100.0 * total_checked_in / NULLIF(total_registered, 0), 1) AS attendance_rate_pct
  FROM v_event_stats
 ORDER BY starts_at;
