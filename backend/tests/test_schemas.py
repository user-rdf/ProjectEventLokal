from datetime import datetime, timedelta

import pytest
from pydantic import ValidationError

from app.schemas.booking import BookingCreate
from app.schemas.event import EventCreate, TicketTypeCreate


def booking(**over):
    data = dict(ticket_type_id=1, attendee_name="Budi Santoso",
                attendee_email="budi@example.com", attendee_phone="0812-3456-7890")
    data.update(over)
    return BookingCreate(**data)


def test_phone_is_normalised():
    assert booking().attendee_phone == "081234567890"


def test_invalid_phone_rejected():
    with pytest.raises(ValidationError):
        booking(attendee_phone="12345")


def test_invalid_email_rejected():
    with pytest.raises(ValidationError):
        booking(attendee_email="bukan-email")


def test_negative_price_rejected():
    with pytest.raises(ValidationError):
        TicketTypeCreate(name="Reguler", price_idr=-1, quota=10)


def test_event_end_must_be_after_start():
    now = datetime(2026, 11, 1, 9, 0)
    with pytest.raises(ValidationError):
        EventCreate(title="Workshop AI", category="workshop", venue="Aula",
                    starts_at=now, ends_at=now - timedelta(hours=1))
