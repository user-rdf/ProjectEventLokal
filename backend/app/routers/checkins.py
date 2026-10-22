from fastapi import APIRouter, Depends

from app.core.errors import not_implemented
from app.core.security import current_user
from app.schemas.checkin import CheckInRequest, CheckInResult

# Staff (scanner role) and organizers may both scan.
router = APIRouter(prefix="/manage", tags=["manage: check-in"],
                   dependencies=[Depends(current_user)])


@router.post("/check-ins", response_model=CheckInResult)
def check_in(body: CheckInRequest):
    """Valid -> insert into check_ins (UNIQUE ticket_id) and mark ticket used.
    Duplicate -> status 'already_used' with the first scan time."""
    raise not_implemented()


@router.get("/events/{event_id}/tickets/search")
def search_tickets(event_id: int, q: str):
    """Manual lookup by name, email, phone or ticket code."""
    raise not_implemented()
