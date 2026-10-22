from fastapi import APIRouter, Depends

from app.core.errors import not_implemented
from app.core.security import require_organizer

router = APIRouter(prefix="/manage", tags=["manage: attendees"],
                   dependencies=[Depends(require_organizer)])


@router.get("/events/{event_id}/attendees")
def list_attendees(event_id: int):
    """name, email, phone, ticket type, status (terdaftar/hadir/belum hadir/dibatalkan)."""
    raise not_implemented()


@router.get("/events/{event_id}/waitlist")
def list_waitlist(event_id: int):
    raise not_implemented()


@router.post("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int):
    """Calls cancel_booking(); the DB promotes the next waitlist entry automatically."""
    raise not_implemented()


@router.post("/bookings/{booking_id}/resend-ticket")
def resend_ticket(booking_id: int):
    raise not_implemented()
