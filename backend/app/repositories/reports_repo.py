"""SQL queries for reports. Keep raw SQL here; routers/services must not contain SQL.

Use:  from app.db.pool import get_conn
      with get_conn() as conn:
          rows = conn.execute("SELECT ...", (param,)).fetchall()
"""
from uuid import UUID

from psycopg import Connection


def summary(conn: Connection, event_id: UUID) -> dict:
    rows = conn.execute(
        """
        SELECT ticket_type_name AS name, quantity_sold AS sold,
               total_revenue AS revenue, checked_in_count
          FROM v_ticket_type_revenue WHERE event_id = %s ORDER BY price_idr, ticket_type_name
        """,
        (event_id,),
    ).fetchall()
    registered = sum(r["sold"] for r in rows)
    attended = sum(r["checked_in_count"] for r in rows)
    return {
        "registered": registered,
        "attended": attended,
        "attendance_rate": round(attended * 100 / registered, 1) if registered else 0,
        "revenue_by_ticket_type": [
            {"name": r["name"], "sold": r["sold"], "revenue": r["revenue"]} for r in rows
        ],
    }
