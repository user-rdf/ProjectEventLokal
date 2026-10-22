from fastapi import APIRouter, Depends

from app.core.errors import not_implemented
from app.core.security import require_organizer

router = APIRouter(prefix="/manage", tags=["manage: reports"],
                   dependencies=[Depends(require_organizer)])


@router.get("/home")
def organizer_home():
    """Beranda panitia: {ongoing:[{id,title,starts_at,ends_at,registered,checked_in}],
    upcoming:[...], finished:[...]}. 'ongoing' = now() BETWEEN starts_at AND ends_at."""
    raise not_implemented()


@router.get("/events/{event_id}/reports/summary")
def report_summary(event_id: int):
    """{registered, attended, attendance_rate, revenue_by_ticket_type:[{name,sold,revenue}]}
    (JOIN + GROUP BY: this is the IK301 analytics query)."""
    raise not_implemented()
