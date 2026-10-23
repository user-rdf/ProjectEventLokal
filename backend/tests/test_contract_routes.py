"""Tes kontrak: semua endpoint di docs/api-contract.md v1.2 harus terdaftar di aplikasi.

Letakkan di backend/tests/test_contract_routes.py. Tes ini tidak memakai database.
Nama parameter path (misalnya {id} atau {event_id}) diabaikan, yang dibandingkan
hanya bentuk path dan method HTTP.

Bila sebuah tes gagal, jangan langsung mengubah tes. Putuskan dulu mana yang benar,
kode atau kontrak, lalu ubah salah satunya lewat PR.
"""
import re

from app.main import app

API_PREFIX = "/api/v1"

CONTRACT = {
    # Auth
    ("POST", "/auth/register"),
    ("POST", "/auth/login"),
    # Peserta (publik)
    ("GET", "/events"),
    ("GET", "/events/{slug}"),
    ("POST", "/bookings"),
    ("POST", "/waitlist"),
    # Panitia
    ("GET", "/manage/home"),
    ("POST", "/manage/events"),
    ("GET", "/manage/events/{id}"),
    ("PATCH", "/manage/events/{id}/publish"),
    ("GET", "/manage/events/{id}/attendees"),
    ("GET", "/manage/events/{id}/waitlist"),
    ("POST", "/manage/bookings/{id}/cancel"),
    # Penulisan path kirim ulang tiket harus dicek: resend-ticket atau resend_ticket.
    ("POST", "/manage/bookings/{id}/resend-ticket"),
    ("GET", "/manage/events/{id}/reports/summary"),
    # Panitia atau staf
    ("POST", "/manage/check-ins"),
    ("GET", "/manage/events/{id}/tickets/search"),
}

# Endpoint infrastruktur yang sengaja di luar kontrak.
INFRA = {("GET", "/health"), ("GET", "/api/v1/health")}


def _normalize(path: str) -> str:
    """Hapus prefix API dan samakan nama parameter path menjadi {}."""
    if path.startswith(API_PREFIX) and path != API_PREFIX:
        path = path[len(API_PREFIX):]
    return re.sub(r"\{[^}]+\}", "{}", path)


def _registered() -> set[tuple[str, str]]:
    found = set()
    for path, operations in app.openapi()["paths"].items():
        for method in operations:
            if method.upper() in {"GET", "POST", "PATCH", "PUT", "DELETE"}:
                found.add((method.upper(), _normalize(path)))
    return found


def _expected() -> set[tuple[str, str]]:
    return {(m, _normalize(p)) for m, p in CONTRACT}


def test_semua_endpoint_kontrak_terdaftar():
    missing = sorted(_expected() - _registered())
    assert not missing, f"Endpoint kontrak yang belum ada di aplikasi: {missing}"


def test_tidak_ada_endpoint_di_luar_kontrak():
    infra = {(m, _normalize(p)) for m, p in INFRA}
    extra = sorted(_registered() - _expected() - infra)
    assert not extra, f"Endpoint di kode yang tidak ada di kontrak: {extra}"
