from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import JSONResponse

from app.core.security import current_user
from app.db.pool import get_conn
from app.repositories import checkin_repo
from app.schemas.checkin import CheckInRequest

router = APIRouter()

# Pemetaan hasil check_in() DB ke HTTP sesuai kontrak API
_HTTP_STATUS = {
    "valid": status.HTTP_201_CREATED,
    "invalid": status.HTTP_404_NOT_FOUND,
}


@router.post("/manage/check-ins", status_code=status.HTTP_201_CREATED)
def check_in(payload: CheckInRequest, user: dict = Depends(current_user)):
    """Scan QR di pintu masuk (organizer atau staff). Selalu mengembalikan body
    {status, message, attendee_name?, ticket_type?, first_checked_in_at?} agar layar scan
    bisa menampilkan warna yang tepat; kode HTTP: 201 valid, 404 invalid, 409 lainnya."""
    with get_conn() as conn:
        result = checkin_repo.check_in(conn, payload.event_id, payload.code, user["sub"])
    code = _HTTP_STATUS.get(result.get("status"), status.HTTP_409_CONFLICT)
    return JSONResponse(status_code=code, content=result)


@router.get("/manage/events/{event_id}/tickets/search")
def search_tickets(event_id: UUID, q: str = Query(min_length=2, description="nama, email, telepon, atau kode tiket"),
                   user: dict = Depends(current_user)):
    """Pencarian manual untuk check-in manual (organizer atau staff)."""
    with get_conn() as conn:
        return checkin_repo.search_tickets(conn, event_id, q)