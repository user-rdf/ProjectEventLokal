from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import require_organizer
from app.db.pool import get_conn
from app.repositories import events_repo, reports_repo

router = APIRouter(prefix="/manage", tags=["manage: reports"],
                   dependencies=[Depends(require_organizer)])


@router.get("/home")
def organizer_home(user: dict = Depends(require_organizer)):
    """Beranda panitia: {ongoing:[{id,title,starts_at,ends_at,registered,checked_in}], upcoming:[...], finished:[...], organizer_name: str}.
    'ongoing' = now() BETWEEN starts_at AND ends_at."""
    with get_conn() as conn:
        res = events_repo.organizer_home(conn, user["sub"])
        u = conn.execute("SELECT name FROM users WHERE id = %s", (user["sub"],)).fetchone()
        res["organizer_name"] = u["name"] if u else (user.get("email") or "Panitia")
        return res


@router.get("/events/{event_id}/reports/summary")
def report_summary(event_id: UUID, user: dict = Depends(require_organizer)):
    """{registered, attended, attendance_rate, revenue_by_ticket_type:[{name,sold,revenue}]}
    (JOIN + GROUP BY: this is the IK301 analytics query)."""
    with get_conn() as conn:
        if not events_repo.is_owned(conn, event_id, user["sub"]):
            raise HTTPException(status_code=404, detail="Event tidak ditemukan")
        return reports_repo.summary(conn, event_id)
