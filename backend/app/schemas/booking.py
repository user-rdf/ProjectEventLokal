from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

class BookingCreate(BaseModel):
    ticket_type_id: UUID
    attendee_name: str = Field(..., min_length=2, max_length=100, description="Nama lengkap peserta")
    attendee_email: EmailStr
    attendee_phone: str = Field(..., pattern=r"^\+?[0-9\s\-]{8,15}$", description="Nomor telepon valid")
    # Jika frontend mengirim field 'approval', kita bisa tambahkan:
    # approval: bool = True 

class WaitlistCreate(BaseModel):
    ticket_type_id: UUID
    attendee_name: str = Field(..., min_length=2, max_length=100)
    attendee_email: EmailStr
    attendee_phone: str = Field(..., pattern=r"^\+?[0-9\s\-]{8,15}$")