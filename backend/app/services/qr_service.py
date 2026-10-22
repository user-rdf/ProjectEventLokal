import io

import qrcode


def make_qr_png(data: str) -> bytes:
    """Render `data` (the ticket code) as a PNG QR image."""
    img = qrcode.make(data, box_size=8, border=2)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
