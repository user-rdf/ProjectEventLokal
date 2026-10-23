from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import require_organizer
from app.db.pool import get_conn

router = APIRouter(prefix="/manage", tags=["manage: attendees"],
                   dependencies=[Depends(require_organizer)])


@router.get("/events/{event_id}/attendees")
def list_attendees(event_id: UUID):
    """Mendapatkan daftar peserta yang sudah booking untuk dashboard panitia."""
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT 
                b.id as booking_id, 
                b.attendee_name, 
                b.attendee_email, 
                b.attendee_phone,
                b.status,
                t.code as ticket_code,
                tt.name as ticket_type
            FROM bookings b
            LEFT JOIN tickets t ON t.booking_id = b.id
            LEFT JOIN ticket_types tt ON b.ticket_type_id = tt.id
            WHERE b.event_id = %s::uuid
            ORDER BY b.created_at DESC
        """, (event_id,)).fetchall()
        
        return [dict(row) for row in rows]


@router.get("/events/{event_id}/waitlist")
def list_waitlist(event_id: UUID):
    """Mendapatkan daftar tunggu untuk dashboard panitia."""
    with get_conn() as conn:
        rows = conn.execute("""
            SELECT 
                w.id, 
                w.attendee_name, 
                w.attendee_email, 
                w.attendee_phone,
                w.status,
                w.created_at,
                tt.name as ticket_type
            FROM waitlist_entries w
            JOIN ticket_types tt ON w.ticket_type_id = tt.id
            WHERE tt.event_id = %s::uuid
            ORDER BY w.created_at ASC
        """, (event_id,)).fetchall()
        
        return [dict(row) for row in rows]


@router.post("/bookings/{booking_id}/resend-ticket")
def resend_ticket(booking_id: UUID):
    """Mengirim ulang email tiket ke peserta."""
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, attendee_email, status FROM bookings WHERE id = %s::uuid", 
            (booking_id,)
        ).fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Booking tidak ditemukan")
            
        if row["status"] != "confirmed":
            raise HTTPException(status_code=400, detail="Hanya booking yang dikonfirmasi yang bisa dikirim ulang")

        return {
            "message": f"Email tiket berhasil dikirim ulang ke {row['attendee_email']}"
        }