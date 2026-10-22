"""Business logic for checkout, waitlist and cancellation.

The heavy lifting (locking, quota check, inserts) lives in PostgreSQL functions
(db/init/02_functions.sql) so that it is one atomic transaction (IK301 evidence).
"""


class QuotaExceeded(Exception):
    """Raised when a ticket type is sold out (the API then offers the waitlist)."""


def checkout(ticket_type_id: int, name: str, email: str, phone: str) -> dict:
    """TODO. Expected flow:
    1. call the SQL function checkout(...) inside `with get_conn()`:
       SELECT ... FROM ticket_types WHERE id = %s FOR UPDATE; check sold < quota;
       UPDATE sold = sold + 1; INSERT booking, payment (simulated), ticket (random code).
    2. if sold out -> raise QuotaExceeded
    3. AFTER commit: build_ticket_message(...) + send_message(...). An email failure
       must not roll back the booking: log it and allow 'kirim ulang tiket'.
    """
    raise NotImplementedError


def cancel_booking(booking_id: int) -> dict:
    """TODO. Call SQL function cancel_booking(): booking -> cancelled, ticket -> void,
    sold - 1, then promote the oldest waitlist entry; email the promoted person."""
    raise NotImplementedError
