import re

from pydantic import BaseModel, EmailStr, Field, field_validator

# Indonesian mobile numbers: 08xx..., 628xx..., +628xx...
PHONE_RE = re.compile(r"^(\+62|62|0)8[1-9][0-9]{7,11}$")


def normalise_phone(value: str) -> str:
    cleaned = re.sub(r"[\s\-]", "", value)
    if not PHONE_RE.match(cleaned):
        raise ValueError("Nomor telepon tidak valid")
    return cleaned


class BookingCreate(BaseModel):
    """Public checkout request. No login: name + email + phone are required."""

    ticket_type_id: int
    attendee_name: str = Field(min_length=2, max_length=100)
    attendee_email: EmailStr
    attendee_phone: str

    @field_validator("attendee_phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return normalise_phone(v)


class WaitlistCreate(BookingCreate):
    """Same fields as a booking; used when the ticket type is sold out."""
