from fastapi import APIRouter

from app.core.errors import not_implemented
from app.schemas.booking import BookingCreate, WaitlistCreate

router = APIRouter(tags=["public: registration"])


@router.post("/bookings", status_code=201)
def create_booking(body: BookingCreate):
    """Atomic checkout. 409 + detail 'Kuota habis' when sold out. Sends ticket email."""
    raise not_implemented()


@router.post("/waitlist", status_code=201)
def join_waitlist(body: WaitlistCreate):
    """Join the waitlist of a sold-out ticket type (one email per ticket type)."""
    raise not_implemented()
