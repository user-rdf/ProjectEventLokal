from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator

CATEGORIES = (
    "workshop",
    "seminar",
    "konser",
    "kompetisi",
    "seni",
    "kampus",
    "komunitas",
    "himpunan",
)
Category = Literal[
    "workshop",
    "seminar",
    "konser",
    "kompetisi",
    "seni",
    "kampus",
    "komunitas",
    "himpunan",
]


class TicketTypeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=60)
    price_idr: int = Field(ge=0, description="0 = gratis")
    quota: int = Field(gt=0, le=100000)


class EventCreate(BaseModel):
    title: str = Field(min_length=3, max_length=150)
    category: Category
    description: str = ""
    venue: str = Field(min_length=2, max_length=150)
    starts_at: datetime
    ends_at: datetime
    ticket_types: list[TicketTypeCreate] = []

    @model_validator(mode="after")
    def _dates(self):
        if self.ends_at <= self.starts_at:
            raise ValueError("Waktu selesai harus setelah waktu mulai")
        return self
