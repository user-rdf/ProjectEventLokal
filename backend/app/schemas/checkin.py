from typing import Literal, Optional

from pydantic import BaseModel, Field

ScanStatus = Literal["valid", "already_used", "invalid", "cancelled", "wrong_event"]


class CheckInRequest(BaseModel):
    event_id: int
    code: str = Field(min_length=8, max_length=128, description="Isi QR (kode tiket)")


class CheckInResult(BaseModel):
    status: ScanStatus
    message: str
    attendee_name: Optional[str] = None
    ticket_type: Optional[str] = None
    first_checked_in_at: Optional[str] = None
