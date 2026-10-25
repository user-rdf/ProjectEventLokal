from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator


def _normalise_phone(v):
    """Hapus spasi dan tanda hubung: '0812-3456-7890' -> '081234567890'."""
    return v.replace(" ", "").replace("-", "") if isinstance(v, str) else v


class BookingCreate(BaseModel):
    ticket_type_id: UUID
    attendee_name: str = Field(..., min_length=2, max_length=100, description="Nama lengkap peserta")
    attendee_email: EmailStr
    attendee_phone: str = Field(..., pattern=r"^\+?[0-9]{8,15}$", description="Nomor telepon valid")

    _phone = field_validator("attendee_phone", mode="before")(_normalise_phone)


class WaitlistCreate(BaseModel):
    ticket_type_id: UUID
    attendee_name: str = Field(..., min_length=2, max_length=100)
    attendee_email: EmailStr
    attendee_phone: str = Field(..., pattern=r"^\+?[0-9]{8,15}$")

    _phone = field_validator("attendee_phone", mode="before")(_normalise_phone)