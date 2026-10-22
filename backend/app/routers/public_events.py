from typing import Literal, Optional

from fastapi import APIRouter, Query

from app.core.errors import not_implemented

router = APIRouter(prefix="/events", tags=["public: events"])


@router.get("")
def list_events(
    q: Optional[str] = Query(None, description="cari judul"),
    price: Optional[Literal["free", "paid"]] = None,
    category: Optional[str] = None,
):
    """Published, upcoming/ongoing events with min price and remaining quota."""
    raise not_implemented()


@router.get("/{slug}")
def get_event(slug: str):
    """Event detail + ticket types with remaining quota (quota - sold)."""
    raise not_implemented()
