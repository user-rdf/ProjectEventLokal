import logging

from fastapi import APIRouter, BackgroundTasks, status

from app.schemas.booking import BookingCreate
from app.services import booking_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["public: bookings"])


@router.post("/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, background: BackgroundTasks):
    """Endpoint publik: peserta mendaftar. Logika atomik ada di fungsi DB `checkout`;
    email tiket (QR) dikirim setelah commit lewat background task."""
    result, email_data = booking_service.checkout(
        payload.ticket_type_id, payload.attendee_name,
        str(payload.attendee_email), payload.attendee_phone,
    )
    background.add_task(booking_service.send_ticket_email, email_data)
    return {
        "booking_id": result["booking_id"],
        "ticket_code": result["ticket_code"],
        "attendee_name": result["attendee_name"],
        "attendee_email": result["attendee_email"],
        "email_queued": True,
        "message": "Pendaftaran berhasil. Silakan cek email Anda untuk mendapatkan tiket QR.",
    }