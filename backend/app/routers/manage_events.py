from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_organizer
from app.schemas.event import EventCreate, TicketTypeCreate
from app.db.pool import get_conn

router = APIRouter(prefix="/manage/events", tags=["manage: events"],
                   dependencies=[Depends(require_organizer)])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_event(body: EventCreate):
    """Panitia membuat event baru."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT create_event(%s, %s, %s, %s, %s, %s) AS result",
            (
                body.title,
                body.slug,
                body.description,
                body.location,
                body.starts_at,
                body.ends_at
            )
        ).fetchone()
        
        if not row or not row["result"]:
            raise HTTPException(status_code=500, detail="Gagal membuat event")
        
        return row["result"]


@router.get("/{event_id}")
def get_event(event_id: UUID):
    """Info event + progress kuota per tiket (hanya untuk organizer yang punya)."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT get_event(%s) AS result",
            (event_id,)
        ).fetchone()
        
        if not row or not row["result"]:
            raise HTTPException(status_code=404, detail="Event tidak ditemukan")
        
        return row["result"]


@router.post("/{event_id}/ticket-types", status_code=status.HTTP_201_CREATED)
def add_ticket_type(event_id: UUID, body: TicketTypeCreate):
    """Panitia menambah kategori tiket untuk event."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT add_ticket_type(%s, %s, %s, %s) AS result",
            (
                event_id,
                body.name,
                body.price_idr,
                body.quota
            )
        ).fetchone()
        
        if not row or not row["result"]:
            raise HTTPException(status_code=500, detail="Gagal menambah tiket")
        
        return row["result"]


@router.patch("/{event_id}/publish")
def publish_event(event_id: UUID):
    """Set status = published; mengembalikan link publik /events/<slug>."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT publish_event(%s) AS result",
            (event_id,)
        ).fetchone()
        
        if not row or not row["result"]:
            raise HTTPException(status_code=404, detail="Event tidak ditemukan")
        
        return row["result"]