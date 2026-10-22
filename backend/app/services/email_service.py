"""Ticket emails. In development the SMTP server is Mailpit (http://localhost:8025)."""
import html
import smtplib
from email.message import EmailMessage
from email.utils import make_msgid

from app.core.config import settings
from app.services.qr_service import make_qr_png


def build_ticket_message(
    *, to_email: str, attendee_name: str, event_title: str, when: str,
    venue: str, ticket_type: str, ticket_code: str, subject: str | None = None,
) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = subject or f"Tiket kamu: {event_title}"
    msg["From"] = settings.mail_from
    msg["To"] = to_email
    msg.set_content(
        f"Halo {attendee_name},\n\nTiket {ticket_type} untuk {event_title}\n"
        f"{when} di {venue}\nKode tiket: {ticket_code}\n\n"
        "Tunjukkan QR ini di pintu masuk."
    )
    cid = make_msgid(domain="eventlokal.local")
    e = html.escape
    msg.add_alternative(
        f"""<div style="font-family:sans-serif;max-width:560px">
        <h2>{e(event_title)}</h2>
        <p>Halo {e(attendee_name)}, ini tiketmu ({e(ticket_type)}).</p>
        <p>{e(when)}<br>{e(venue)}</p>
        <img src="cid:{cid[1:-1]}" alt="QR tiket" width="220" height="220">
        <p>Kode tiket: <b>{e(ticket_code)}</b></p>
        <p>Tunjukkan QR ini di pintu masuk.</p></div>""",
        subtype="html",
    )
    msg.get_payload()[1].add_related(make_qr_png(ticket_code), "image", "png", cid=cid)
    return msg


def send_message(msg: EmailMessage) -> None:
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
        smtp.send_message(msg)
