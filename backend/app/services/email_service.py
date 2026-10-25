"""Ticket emails. In development the SMTP server is Mailpit (http://localhost:8025)."""
import html
import os
import smtplib
from email.message import EmailMessage
from email.utils import make_msgid

from app.core.config import settings
from app.services.qr_service import make_qr_png

# Path to official EVENT 2 GO logo
LOGO_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "logo_event2go.png")


def build_ticket_message(
    *, to_email: str, attendee_name: str, event_title: str, when: str,
    venue: str, ticket_type: str, ticket_code: str, subject: str | None = None,
    organizer_name: str = "Panitia Acara", is_cancelled: bool = False,
) -> EmailMessage:
    msg = EmailMessage()
    subj_lower = (subject or "").lower()
    is_cancelled = is_cancelled or ("dibatalkan" in subj_lower)
    is_promoted = not is_cancelled and ("mendapat tiket" in subj_lower or "antrean" in subj_lower or "daftar tunggu" in subj_lower)
    is_reminder = not is_cancelled and ("pengingat" in subj_lower)

    first_name = attendee_name.split()[0] if attendee_name else "Peserta"

    if is_cancelled:
        msg["Subject"] = subject or f"Pendaftaran dibatalkan: {event_title}"
        greeting_title = "Pendaftaranmu dibatalkan"
        greeting_desc = "Panitia membatalkan pendaftaranmu untuk acara ini. QR sebelumnya tidak berlaku lagi. Hubungi panitia jika ini keliru."
    elif is_promoted:
        msg["Subject"] = subject or f"Kamu mendapat tiket! {event_title}"
        greeting_title = f"Kabar baik, {first_name}! Kamu mendapat tiket."
        greeting_desc = "Ada kuota yang terbuka dan kamu adalah antrean pertama. Tiket ini sudah otomatis jadi milikmu."
    elif is_reminder:
        msg["Subject"] = subject or f"Pengingat: {event_title} dimulai besok!"
        greeting_title = f"Besok acara dimulai, {first_name}!"
        greeting_desc = "Jangan lupa siapkan tiket QR kamu sebelum datang ke lokasi acara. Sampai jumpa besok!"
    else:
        msg["Subject"] = subject or f"Tiket kamu: {event_title}"
        greeting_title = f"Halo {first_name}, tiketmu sudah siap!"
        greeting_desc = "Simpan email ini. Tunjukkan QR di bawah kepada panitia saat masuk acara."

    msg["From"] = settings.mail_from
    msg["To"] = to_email

    plain_text = (
        f"EVENT 2 GO\n\n"
        f"{greeting_title}\n\n"
        f"{greeting_desc}\n\n"
        f"Event: {event_title}\n"
        f"Waktu: {when}\n"
        f"Lokasi: {venue}\n"
        f"Kategori: {ticket_type}\n"
    )
    if not is_cancelled:
        plain_text += (
            f"Kode tiket: {ticket_code}\n\n"
            "Tiket ini berlaku untuk satu orang. Jangan bagikan QR ke orang lain — QR hanya bisa dipakai sekali.\n"
        )
    plain_text += f"\nDikirim oleh EVENT 2 GO atas nama {organizer_name}"
    msg.set_content(plain_text)

    cid_qr = make_msgid(domain="event2go.local")
    cid_logo = make_msgid(domain="event2go.local")
    e = html.escape

    # Check if logo exists to attach
    has_logo = os.path.exists(LOGO_PATH)
    if has_logo:
        logo_html = f'<img src="cid:{cid_logo[1:-1]}" alt="EVENT 2 GO" height="32" style="display:block;height:32px;width:auto;border:0;" />'
    else:
        logo_html = '<span style="font-size:16px;font-weight:900;letter-spacing:1px;color:#ffffff;">EVENT 2 GO</span>'

    qr_section_html = ""
    if not is_cancelled:
        qr_section_html = f"""
      <!-- QR Code Container -->
      <div style="background-color:#f0f3fa;border-radius:16px;padding:24px;text-align:center;margin-bottom:20px;">
        <div style="display:inline-block;background:#ffffff;padding:12px;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <img src="cid:{cid_qr[1:-1]}" alt="QR Tiket" width="180" height="180" style="display:block;margin:0 auto;" />
        </div>
        <div style="font-family:monospace;font-weight:800;font-size:15px;color:#0f172a;margin-top:14px;letter-spacing:1px;">
          {e(ticket_code)}
        </div>
        <div style="font-size:12px;color:#64748b;margin-top:4px;">
          {e(ticket_type)} · {e(attendee_name)}
        </div>
      </div>
"""

    msg.add_alternative(
        f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px 12px;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
    <!-- Header Bar with Primary Color #5953C7 & Official Logo -->
    <div style="background-color:#5953C7;padding:16px 24px;">
      {logo_html}
    </div>
    
    <!-- Body Content -->
    <div style="padding:28px 24px;">
      <h1 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 8px 0;line-height:1.3;">
        {e(greeting_title)}
      </h1>
      <p style="font-size:14px;color:#64748b;margin:0 0 20px 0;line-height:1.5;">
        {e(greeting_desc)}
      </p>

      <!-- Event Info Box -->
      <div style="border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:20px;background:#ffffff;">
        <div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:8px;">{e(event_title)}</div>
        <div style="font-size:13px;color:#475569;margin-bottom:6px;">📅 {e(when)}</div>
        <div style="font-size:13px;color:#475569;">📍 {e(venue)}</div>
      </div>
{qr_section_html}
      <!-- Notice -->
      <p style="font-size:12px;color:#94a3b8;line-height:1.5;margin:0 0 20px 0;">
        Tiket ini berlaku untuk satu orang. Jangan bagikan QR ke orang lain — QR hanya bisa dipakai sekali.
      </p>

      <!-- Footer -->
      <div style="border-top:1px solid #f1f5f9;padding-top:16px;text-align:center;font-size:11px;color:#94a3b8;">
        Dikirim oleh EVENT 2 GO atas nama {e(organizer_name)}
      </div>
    </div>
  </div>
</body>
</html>""",
        subtype="html",
    )

    # Attach related inline images
    payload = msg.get_payload()[1]
    if has_logo:
        with open(LOGO_PATH, "rb") as f:
            payload.add_related(f.read(), "image", "png", cid=cid_logo)

    if not is_cancelled:
        payload.add_related(make_qr_png(ticket_code), "image", "png", cid=cid_qr)

    return msg


def send_message(msg: EmailMessage) -> None:
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
        smtp.send_message(msg)
