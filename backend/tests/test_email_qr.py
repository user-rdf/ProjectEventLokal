from app.services.email_service import build_ticket_message
from app.services.qr_service import make_qr_png


def test_qr_is_png():
    assert make_qr_png("ABCDEFGH12345678").startswith(b"\x89PNG")


def test_ticket_email_contains_code_and_qr():
    msg = build_ticket_message(
        to_email="budi@example.com", attendee_name="Budi", event_title="Workshop AI",
        when="1 Nov 2026 09:00", venue="Aula", ticket_type="Reguler",
        ticket_code="ABCDEFGH12345678")
    assert msg["To"] == "budi@example.com"
    assert "ABCDEFGH12345678" in msg.get_body(("plain",)).get_content()
    assert any(p.get_content_type() == "image/png" for p in msg.walk())
