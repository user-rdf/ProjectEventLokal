from fastapi import APIRouter, Depends

from app.core.errors import not_implemented
from app.core.security import require_organizer
from app.schemas.event import EventCreate, TicketTypeCreate

router = APIRouter(prefix="/manage/events", tags=["manage: events"],
                   dependencies=[Depends(require_organizer)])


@router.post("", status_code=201)
def create_event(body: EventCreate):
    raise not_implemented()


@router.get("/{event_id}")
def get_event(event_id: int):
    """Event info + quota progress per ticket type (owned by the logged-in organizer)."""
    raise not_implemented()


@router.post("/{event_id}/ticket-types", status_code=201)
def add_ticket_type(event_id: int, body: TicketTypeCreate):
    raise not_implemented()


@router.patch("/{event_id}/publish")
def publish_event(event_id: int):
    """Set status = published; returns the public link /events/<slug>."""
    raise not_implemented()
