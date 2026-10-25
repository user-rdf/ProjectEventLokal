import logging

from fastapi import APIRouter, status

from app.schemas.booking import WaitlistCreate
from app.services import booking_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["public: waitlist"])


@router.post("/waitlist", status_code=status.HTTP_201_CREATED)
def create_waitlist(payload: WaitlistCreate):
    """Endpoint publik: masuk daftar tunggu jika kuota habis (fungsi DB `join_waitlist`,
    error EL002/EL003/EL005 dipetakan di core/errors.py)."""
    result = booking_service.join_waitlist(
        payload.ticket_type_id, payload.attendee_name,
        str(payload.attendee_email), payload.attendee_phone,
    )
    return {
        **result,
        "message": "Anda berhasil masuk ke daftar tunggu. Kami akan mengirim email jika ada tiket yang tersedia.",
    }