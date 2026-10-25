-- Analytics queries (JOIN + aggregation). The views live in db/init/03_views.sql.

-- Organizer home: ongoing events with registered / checked-in counts
SELECT id, title, registered, checked_in
  FROM v_event_stats
 WHERE organizer_id = 1 AND phase = 'ongoing';

-- Report: revenue per ticket type for one event
SELECT name, sold, quota, revenue
  FROM v_ticket_type_revenue
 WHERE event_id = (SELECT id FROM events WHERE slug = 'expo-kampus-2026');

-- Report: attendance rate per event
SELECT title, registered, checked_in,
       ROUND(100.0 * checked_in / NULLIF(registered, 0), 1) AS attendance_rate_pct
  FROM v_event_stats
 ORDER BY starts_at;
