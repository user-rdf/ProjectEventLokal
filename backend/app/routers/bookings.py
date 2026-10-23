from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.booking import BookingCreate
from app.db.pool import get_conn
from app.core.security import current_user
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate):
    """
    Endpoint publik untuk peserta mendaftar event.
    Memanggil fungsi database 'checkout' yang menangani transaksi atomik.
    """
    with get_conn() as conn:
        # Memanggil fungsi PostgreSQL: checkout(p_ticket_type_id, p_name, p_email, p_phone)
        row = conn.execute(
            "SELECT checkout(%s, %s, %s, %s) AS result",
            (
                payload.ticket_type_id,
                payload.attendee_name,
                payload.attendee_email,
                payload.attendee_phone
            )
        ).fetchone()

        if not row or not row["result"]:
            logger.error("Checkout function returned null")
            raise HTTPException(status_code=500, detail="Gagal memproses pendaftaran")

        result = row["result"]
        
        return {
            "booking_id": result.get("booking_id"),
            "ticket_code": result.get("ticket_code"),
            "attendee_name": result.get("attendee_name"),
            "message": "Pendaftaran berhasil. Silakan cek email Anda untuk mendapatkan tiket QR."
        }

@router.post("/manage/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: UUID, user: dict = Depends(current_user)):
    """
    Endpoint untuk panitia membatalkan booking peserta.
    Fungsi DB hanya butuh booking_id, trigger akan otomatis memproses waitlist.
    """
    with get_conn() as conn:
        # HANYA kirim 1 argumen: booking_id
        conn.execute(
            "SELECT cancel_booking(%s::uuid)",
            (booking_id,)
        )
        
        # Jika tidak ada error dari database, berarti sukses!
        return {
            "message": "Booking berhasil dibatalkan. Sistem akan otomatis mempromosikan peserta waitlist jika ada."
        }
    """Panitia membatalkan booking. DB otomatis promosikan waitlist jika ada."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT cancel_booking(%s::uuid, %s::uuid) AS result",
            (booking_id, user["sub"])
        ).fetchone()
        
        if not row or not row["result"]:
            raise HTTPException(status_code=500, detail="Gagal memproses pembatalan")
        
        return row["result"]