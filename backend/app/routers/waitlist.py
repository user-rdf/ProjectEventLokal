from fastapi import APIRouter, status
from app.schemas.booking import WaitlistCreate
from app.db.pool import get_conn
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/waitlist", status_code=status.HTTP_201_CREATED)
def create_waitlist(payload: WaitlistCreate):
    """
    Endpoint publik untuk peserta masuk daftar tunggu jika kuota habis.
    Memanggil fungsi database 'join_waitlist' yang menangani validasi kuota.
    """
    with get_conn() as conn:
        # Memanggil fungsi PostgreSQL: join_waitlist(p_ticket_type_id, p_name, p_email, p_phone)
        # Fungsi ini mengembalikan VOID, tapi akan RAISE ERROR jika gagal (EL002, EL003, EL005)
        conn.execute(
            "SELECT join_waitlist(%s, %s, %s, %s)",
            (
                payload.ticket_type_id,
                payload.attendee_name,
                payload.attendee_email,
                payload.attendee_phone
            )
        )
        
        # Jika kode sampai di sini, berarti tidak ada error dari database (berhasil masuk waitlist)
        return {
            "message": "Anda berhasil masuk ke daftar tunggu. Kami akan mengirim email jika ada tiket yang tersedia."
        }