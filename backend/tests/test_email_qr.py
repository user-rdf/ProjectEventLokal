from app.services.email_service import build_ticket_message
from app.services.qr_service import make_qr_png


def test_qr_is_png():
    assert make_qr_png("ABCDEFGH12345678").startswith(b"\x89PNG")


def test_ticket_email_contains_code_and_qr():
    msg = build_ticket_message(
        to_email="budi@example.com", attendee_name="Budi", event_title="Workshop AI",
        when="1 Nov 2026 09:00", venue="Aula", ticket_type="Reguler",
        ticket_code="ABCDEFGH12345678", organizer_name="HIMAKOM UGM")
    assert msg["To"] == "budi@example.com"
    content = msg.get_body(("plain",)).get_content()
    assert "ABCDEFGH12345678" in content
    assert "Halo Budi, tiketmu sudah siap!" in content
    assert "EVENT 2 GO" in content
    assert "HIMAKOM UGM" in content
    assert any(p.get_content_type() == "image/png" for p in msg.walk())


def test_promoted_email_from_waitlist():
    msg = build_ticket_message(
        to_email="ayu@example.com", attendee_name="Ayu Lestari", event_title="Workshop UI/UX",
        when="14 Nov 2026 09:00", venue="Lab C", ticket_type="Mahasiswa",
        ticket_code="EL-101-3F7Q", subject="Kamu mendapat tiket! Workshop UI/UX")
    content = msg.get_body(("plain",)).get_content()
    assert "Kabar baik, Ayu! Kamu mendapat tiket." in content
    assert any(p.get_content_type() == "image/png" for p in msg.walk())


def test_cancelled_email_no_qr():
    msg = build_ticket_message(
        to_email="ayu@example.com", attendee_name="Ayu Lestari", event_title="Workshop UI/UX",
        when="14 Nov 2026 09:00", venue="Lab C", ticket_type="Mahasiswa",
        ticket_code="EL-101-3F7Q", is_cancelled=True)
    content = msg.get_body(("plain",)).get_content()
    assert "Pendaftaranmu dibatalkan" in content
    # Ensure QR code is NOT in plain text or attachments (only logo png may exist)
    assert not any(p.get_filename() == "qr" for p in msg.walk())
