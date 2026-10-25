from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import require_organizer
from app.db.pool import get_conn
from app.repositories import events_repo
from app.schemas.event import EventCreate

router = APIRouter(prefix="/manage/events", tags=["manage: events"],
                   dependencies=[Depends(require_organizer)])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_event(body: EventCreate, user: dict = Depends(require_organizer)):
    """Panitia membuat event baru beserta kategori tiket (status awal draft)."""
    with get_conn() as conn:
        return events_repo.create(conn, user["sub"], body)


@router.get("/{event_id}")
def get_event(event_id: UUID, user: dict = Depends(require_organizer)):
    """Info event + kuota per tiket (404 bila bukan milik panitia ini)."""
    with get_conn() as conn:
        ev = events_repo.get_owned(conn, event_id, user["sub"])
    if not ev:
        raise HTTPException(status_code=404, detail="Event tidak ditemukan")
    return ev


@router.patch("/{event_id}/publish")
def publish_event(event_id: UUID, user: dict = Depends(require_organizer)):
    """Set status = published; mengembalikan link publik /events/<slug>."""
    with get_conn() as conn:
        res = events_repo.publish(conn, event_id, user["sub"])
    if res is None:
        raise HTTPException(status_code=404, detail="Event tidak ditemukan")
    if res == "no_tickets":
        raise HTTPException(status_code=422, detail="Event harus punya minimal satu kategori tiket")
    return res