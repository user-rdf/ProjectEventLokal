from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query

from app.core.security import require_organizer
from app.db.pool import get_conn
from app.repositories import booking_repo, events_repo
from app.services import booking_service

router = APIRouter(prefix="/manage", tags=["manage: attendees"],
                   dependencies=[Depends(require_organizer)])


def _assert_owner(conn, event_id: UUID, user: dict) -> None:
    if not events_repo.is_owned(conn, event_id, user["sub"]):
        raise HTTPException(status_code=404, detail="Event tidak ditemukan")


@router.get("/events/{event_id}/attendees")
def list_attendees(
    event_id: UUID,
    page: int = Query(default=1, ge=1, description="Nomor halaman (mulai dari 1)"),
    per_page: int = Query(default=100, ge=1, le=200, description="Jumlah data per halaman (maks 200)"),
    user: dict = Depends(require_organizer),
):
    """Daftar peserta (paginasi)."""
    with get_conn() as conn:
        _assert_owner(conn, event_id, user)
        return booking_repo.list_attendees(conn, event_id, per_page, (page - 1) * per_page)


@router.get("/events/{event_id}/waitlist")
def list_waitlist(
    event_id: UUID,
    page: int = Query(default=1, ge=1, description="Nomor halaman (mulai dari 1)"),
    per_page: int = Query(default=100, ge=1, le=200, description="Jumlah data per halaman (maks 200)"),
    user: dict = Depends(require_organizer),
):
    """Antrean daftar tunggu (paginasi)."""
    with get_conn() as conn:
        _assert_owner(conn, event_id, user)
        return booking_repo.list_waitlist(conn, event_id, per_page, (page - 1) * per_page)


@router.post("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: UUID, background: BackgroundTasks, user: dict = Depends(require_organizer)):
    """Panitia membatalkan booking. DB otomatis menaikkan antrean tertua menjadi booking baru;
    orang yang naik dikirimi email tiket setelah commit."""
    result, promoted_email = booking_service.cancel_booking(booking_id, user["sub"])
    if promoted_email:
        background.add_task(
            booking_service.send_ticket_email, promoted_email,
            f"Kamu mendapat tiket: {promoted_email['event_title']}",
        )
    return {
        "booking_id": result["booking_id"],
        "status": result["status"],
        "promoted": bool(promoted_email),
        "message": "Pendaftaran dibatalkan."
                   + (" Peserta dari daftar tunggu sudah naik dan dikirimi tiket." if promoted_email else ""),
    }


@router.post("/bookings/{booking_id}/resend-ticket")
def resend_ticket(booking_id: UUID, background: BackgroundTasks, user: dict = Depends(require_organizer)):
    """Mengirim ulang email tiket ke peserta."""
    data = booking_service.resend_ticket(booking_id, user["sub"])
    background.add_task(booking_service.send_ticket_email, data)
    return {"message": f"Email tiket dikirim ulang ke {data['attendee_email']}"}