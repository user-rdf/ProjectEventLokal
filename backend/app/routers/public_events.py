from typing import Literal, Optional

from fastapi import APIRouter, HTTPException, Query

from app.db.pool import get_conn
from app.repositories import events_repo

router = APIRouter(prefix="/events", tags=["public: events"])


@router.get("")
def list_events(
    q: Optional[str] = Query(None, description="cari judul"),
    price: Optional[Literal["free", "paid"]] = None,
    category: Optional[str] = None,
):
    """Published, upcoming/ongoing events with min price and remaining quota."""
    with get_conn() as conn:
        return events_repo.list_public(conn, q, price, category)


@router.get("/{slug}")
def get_event(slug: str):
    """Event detail + ticket types with remaining quota (quota - sold)."""
    with get_conn() as conn:
        ev = events_repo.get_public_by_slug(conn, slug)
    if not ev:
        raise HTTPException(status_code=404, detail="Event tidak ditemukan")
    return ev
