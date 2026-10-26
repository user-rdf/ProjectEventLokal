"""SQL queries for events. Keep raw SQL here; routers/services must not contain SQL.

Use:  from app.db.pool import get_conn
      with get_conn() as conn:
          rows = conn.execute("SELECT ...", (param,)).fetchall()
"""
import re
import secrets
from uuid import UUID

from psycopg import Connection


def list_public(conn: Connection, q: str | None, price: str | None, category: str | None) -> list[dict]:
    """Event published & belum selesai, dari view v_public_events."""
    sql = """
        SELECT id, title, slug, category, venue, starts_at, ends_at,
               min_price, total_available_seats AS remaining
          FROM v_public_events
         WHERE TRUE
    """
    params: list = []
    if q:
        sql += " AND title ILIKE %s"
        params.append(f"%{q}%")
    if category:
        sql += " AND category ILIKE %s"
        params.append(category)
    if price == "free":
        sql += " AND min_price = 0"
    elif price == "paid":
        sql += " AND min_price > 0"
    sql += " ORDER BY starts_at ASC"
    return [dict(r) for r in conn.execute(sql, params).fetchall()]


def _ticket_types(conn: Connection, event_id: UUID) -> list[dict]:
    rows = conn.execute(
        """
        SELECT id, name, price_idr, quota, sold, (quota - sold) AS remaining,
               (SELECT COUNT(*) FROM waitlist_entries w WHERE w.ticket_type_id = ticket_types.id AND w.status = 'waiting') AS waitlist_count
          FROM ticket_types WHERE event_id = %s ORDER BY price_idr, name
        """,
        (event_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def get_public_by_slug(conn: Connection, slug: str) -> dict | None:
    ev = conn.execute(
        """
        SELECT e.id, e.title, e.slug, e.category, e.description, e.venue, e.starts_at, e.ends_at,
               u.name AS organizer_name
          FROM events e
          JOIN users u ON u.id = e.organizer_id
         WHERE e.slug = %s AND e.status = 'published'
        """,
        (slug,),
    ).fetchone()
    if not ev:
        return None
    ev = dict(ev)
    ev["ticket_types"] = _ticket_types(conn, ev["id"])
    return ev


def get_owned(conn: Connection, event_id: UUID, organizer_id: str) -> dict | None:
    """Event milik organizer ini (organizer lain -> None -> 404)."""
    ev = conn.execute(
        """
        SELECT id, title, slug, category, description, venue, starts_at, ends_at, status
          FROM events WHERE id = %s AND organizer_id = %s
        """,
        (event_id, organizer_id),
    ).fetchone()
    if not ev:
        return None
    ev = dict(ev)
    ev["ticket_types"] = _ticket_types(conn, ev["id"])
    return ev


def is_owned(conn: Connection, event_id: UUID, organizer_id: str) -> bool:
    return conn.execute(
        "SELECT 1 FROM events WHERE id = %s AND organizer_id = %s", (event_id, organizer_id)
    ).fetchone() is not None


def _unique_slug(conn: Connection, title: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:80] or "event"
    slug = base
    while conn.execute("SELECT 1 FROM events WHERE slug = %s", (slug,)).fetchone():
        slug = f"{base}-{secrets.token_hex(3)}"
    return slug


def create(conn: Connection, organizer_id: str, body) -> dict:
    """Buat event (status awal draft) beserta kategori tiketnya dalam satu transaksi."""
    slug = _unique_slug(conn, body.title)
    ev = conn.execute(
        """
        INSERT INTO events (organizer_id, title, slug, category, description, venue, starts_at, ends_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, slug, status
        """,
        (organizer_id, body.title, slug, body.category, body.description,
         body.venue, body.starts_at, body.ends_at),
    ).fetchone()
    for t in body.ticket_types:
        conn.execute(
            "INSERT INTO ticket_types (event_id, name, price_idr, quota) VALUES (%s, %s, %s, %s)",
            (ev["id"], t.name, t.price_idr, t.quota),
        )
    return dict(ev)


def publish(conn: Connection, event_id: UUID, organizer_id: str) -> dict | str | None:
    """None = bukan milik organizer / tidak ada. 'no_tickets' = belum punya kategori tiket."""
    ev = conn.execute(
        "SELECT id, slug FROM events WHERE id = %s AND organizer_id = %s FOR UPDATE",
        (event_id, organizer_id),
    ).fetchone()
    if not ev:
        return None
    if not conn.execute("SELECT 1 FROM ticket_types WHERE event_id = %s", (event_id,)).fetchone():
        return "no_tickets"
    conn.execute("UPDATE events SET status = 'published' WHERE id = %s", (event_id,))
    return {"id": ev["id"], "slug": ev["slug"], "status": "published", "public_url": f"/events/{ev['slug']}"}


def organizer_home(conn: Connection, organizer_id: str) -> dict:
    """Beranda panitia dari view v_event_stats, dikelompokkan per fase."""
    rows = conn.execute(
        """
        SELECT id, title, slug, status, phase, starts_at, ends_at,
               total_registered AS registered, total_checked_in AS checked_in,
               category, venue
          FROM v_event_stats WHERE organizer_id = %s ORDER BY starts_at
        """,
        (organizer_id,),
    ).fetchall()
    out = {"ongoing": [], "upcoming": [], "finished": []}
    for r in rows:
        out[r["phase"]].append(dict(r))
    return out
