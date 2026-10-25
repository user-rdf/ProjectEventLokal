"""SQL queries for check-ins. Keep raw SQL here; routers/services must not contain SQL.

Use:  from app.db.pool import get_conn
      with get_conn() as conn:
          rows = conn.execute("SELECT ...", (param,)).fetchall()
"""
from uuid import UUID

from psycopg import Connection


def check_in(conn: Connection, event_id: UUID, code: str, staff_id: str) -> dict:
    row = conn.execute(
        "SELECT check_in(%s, %s, %s) AS result", (event_id, code, staff_id)
    ).fetchone()
    return row["result"]


def search_tickets(conn: Connection, event_id: UUID, q: str, limit: int = 20) -> list[dict]:
    like = f"%{q}%"
    rows = conn.execute(
        """
        SELECT t.code, t.status, b.attendee_name, b.attendee_email, b.attendee_phone,
               tt.name AS ticket_type, b.status AS booking_status
          FROM bookings b
          JOIN tickets t ON t.booking_id = b.id
          JOIN ticket_types tt ON tt.id = b.ticket_type_id
         WHERE b.event_id = %s
           AND (b.attendee_name ILIKE %s OR b.attendee_email::text ILIKE %s
                OR b.attendee_phone ILIKE %s OR t.code ILIKE %s)
         ORDER BY b.attendee_name
         LIMIT %s
        """,
        (event_id, like, like, like, like, limit),
    ).fetchall()
    return [dict(r) for r in rows]
