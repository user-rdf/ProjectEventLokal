"""Business logic for checkout, waitlist and cancellation.

The heavy lifting (locking, quota check, inserts) lives in PostgreSQL functions
(db/init/02_functions.sql) so that it is one atomic transaction (IK301 evidence).
This module only adds what the database cannot do: sending e-mail.
"""
import logging
from uuid import UUID

from fastapi import HTTPException

from app.db.pool import get_conn
from app.repositories import booking_repo
from app.services.email_service import build_ticket_message, send_message

logger = logging.getLogger(__name__)


class QuotaExceeded(Exception):
    """Raised when a ticket type is sold out (the API then offers the waitlist)."""


def send_ticket_email(data: dict, subject: str | None = None) -> None:
    """Kirim email tiket. Dipanggil SETELAH commit; kegagalan hanya di-log
    (peserta tetap terdaftar dan panitia bisa 'kirim ulang tiket')."""
    try:
        msg = build_ticket_message(
            to_email=data["attendee_email"],
            attendee_name=data["attendee_name"],
            event_title=data["event_title"],
            when=data["starts_at"].strftime("%d %b %Y %H:%M UTC"),
            venue=data["venue"],
            ticket_type=data["ticket_type"],
            ticket_code=data["ticket_code"],
            subject=subject,
        )
        send_message(msg)
    except Exception:  # noqa: BLE001 - email must never break the request
        logger.exception("Gagal mengirim email tiket ke %s", data.get("attendee_email"))


def checkout(ticket_type_id: UUID, name: str, email: str, phone: str) -> tuple[dict, dict]:
    """Return (hasil checkout, data email). Error DB (EL001/EL002/EL003) dipetakan di core/errors.py."""
    with get_conn() as conn:
        result = booking_repo.checkout(conn, ticket_type_id, name, email, phone)
        email_data = booking_repo.get_ticket_email_data(conn, result["booking_id"])
    return result, email_data


def join_waitlist(ticket_type_id: UUID, name: str, email: str, phone: str) -> dict:
    with get_conn() as conn:
        return booking_repo.join_waitlist(conn, ticket_type_id, name, email, phone)


def _owned_booking(conn, booking_id: UUID, organizer_id: str) -> dict:
    row = booking_repo.get_booking_owner(conn, booking_id)
    # booking milik panitia lain diperlakukan sama seperti tidak ada (404)
    if not row or str(row["organizer_id"]) != str(organizer_id):
        raise HTTPException(status_code=404, detail="Pendaftaran tidak ditemukan")
    return row


def cancel_booking(booking_id: UUID, organizer_id: str) -> tuple[dict, dict | None]:
    """Return (hasil cancel, data email untuk orang yang naik dari antrean atau None)."""
    with get_conn() as conn:
        _owned_booking(conn, booking_id, organizer_id)
        booking_repo.set_acting_user(conn, organizer_id)
        result = booking_repo.cancel_booking(conn, booking_id)
        promoted = result.get("promoted")
        promoted_email = (
            booking_repo.get_ticket_email_data(conn, promoted["booking_id"]) if promoted else None
        )
    return result, promoted_email


def resend_ticket(booking_id: UUID, organizer_id: str) -> dict:
    with get_conn() as conn:
        row = _owned_booking(conn, booking_id, organizer_id)
        if row["status"] != "confirmed":
            raise HTTPException(status_code=409, detail="Hanya pendaftaran yang aktif yang bisa dikirim ulang")
        return booking_repo.get_ticket_email_data(conn, booking_id)
