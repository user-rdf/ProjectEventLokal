"""SQL queries for bookings, waitlist and attendees. Keep raw SQL here; routers/services must not contain SQL.

Use:  from app.db.pool import get_conn
      with get_conn() as conn:
          rows = conn.execute("SELECT ...", (param,)).fetchall()
"""
from uuid import UUID

from psycopg import Connection


def set_acting_user(conn: Connection, user_id: str | None) -> None:
    """Dipakai trigger audit_bookings_changes untuk mengisi audit_log.changed_by (berlaku 1 transaksi)."""
    if user_id:
        conn.execute("SELECT set_config('app.user_id', %s, true)", (str(user_id),))


def checkout(conn: Connection, ticket_type_id: UUID, name: str, email: str, phone: str) -> dict:
    row = conn.execute(
        "SELECT checkout(%s, %s, %s, %s) AS result",
        (ticket_type_id, name, email, phone),
    ).fetchone()
    return row["result"]


def join_waitlist(conn: Connection, ticket_type_id: UUID, name: str, email: str, phone: str) -> dict:
    conn.execute(
        "SELECT join_waitlist(%s, %s, %s, %s)",
        (ticket_type_id, name, email, phone),
    )
    row = conn.execute(
        """
        SELECT w.id,
               (SELECT COUNT(*) FROM waitlist_entries w2
                 WHERE w2.ticket_type_id = w.ticket_type_id AND w2.status = 'waiting'
                   AND w2.joined_at <= w.joined_at) AS position
          FROM waitlist_entries w
         WHERE w.ticket_type_id = %s AND w.attendee_email = %s AND w.status = 'waiting'
        """,
        (ticket_type_id, email),
    ).fetchone()
    return {"waitlist_id": row["id"], "position": row["position"]}


def cancel_booking(conn: Connection, booking_id: UUID) -> dict:
    row = conn.execute("SELECT cancel_booking(%s) AS result", (booking_id,)).fetchone()
    return row["result"]


def get_booking_owner(conn: Connection, booking_id: UUID) -> dict | None:
    """Booking + organizer pemilik event (untuk cek kepemilikan sebelum cancel/resend)."""
    return conn.execute(
        """
        SELECT b.id, b.status, e.organizer_id
          FROM bookings b JOIN events e ON e.id = b.event_id
         WHERE b.id = %s
        """,
        (booking_id,),
    ).fetchone()


def get_ticket_email_data(conn: Connection, booking_id: UUID) -> dict | None:
    return conn.execute(
        """
        SELECT b.id AS booking_id, b.status, b.attendee_name, b.attendee_email,
               e.title AS event_title, e.venue, e.starts_at,
               tt.name AS ticket_type, COALESCE(t.code, '') AS ticket_code,
               u.name AS organizer_name
          FROM bookings b
          JOIN events e ON e.id = b.event_id
          JOIN users u ON u.id = e.organizer_id
          JOIN ticket_types tt ON tt.id = b.ticket_type_id
          LEFT JOIN tickets t ON t.booking_id = b.id
         WHERE b.id = %s
        """,
        (booking_id,),
    ).fetchone()


def list_attendees(conn: Connection, event_id: UUID, limit: int, offset: int) -> list[dict]:
    rows = conn.execute(
        """
        SELECT b.id, b.id AS booking_id, b.attendee_name, b.attendee_email, b.attendee_phone,
               b.status, b.created_at, t.code AS ticket_code, t.status AS ticket_status,
               tt.name AS ticket_type
          FROM bookings b
          LEFT JOIN tickets t ON t.booking_id = b.id
          JOIN ticket_types tt ON tt.id = b.ticket_type_id
         WHERE b.event_id = %s
         ORDER BY b.created_at DESC
         LIMIT %s OFFSET %s
        """,
        (event_id, limit, offset),
    ).fetchall()
    return [dict(r) for r in rows]


def list_waitlist(conn: Connection, event_id: UUID, limit: int, offset: int) -> list[dict]:
    rows = conn.execute(
        """
        SELECT w.id, w.attendee_name AS name, w.attendee_email AS email, w.attendee_phone AS phone,
               w.status, w.joined_at, w.joined_at AS created_at, w.promoted_at,
               tt.name AS ticket_type,
               CASE WHEN w.status = 'waiting' THEN
                    ROW_NUMBER() OVER (PARTITION BY w.ticket_type_id, (w.status = 'waiting') ORDER BY w.joined_at)
               END AS position
          FROM waitlist_entries w
          JOIN ticket_types tt ON tt.id = w.ticket_type_id
         WHERE tt.event_id = %s
         ORDER BY (w.status = 'waiting') DESC, w.joined_at ASC
         LIMIT %s OFFSET %s
        """,
        (event_id, limit, offset),
    ).fetchall()
    return [dict(r) for r in rows]
