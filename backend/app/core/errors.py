import logging
import uuid
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from psycopg import errors as psycopg_errors

logger = logging.getLogger(__name__)

# Pemetaan SQLSTATE ke HTTP Status Code sesuai Kontrak API v1.2
SQLSTATE_MAP = {
    "EL001": (409, "Kuota habis"),
    "EL002": (404, "Event atau tiket tidak tersedia"),
    "EL003": (409, "Email sudah terdaftar atau sudah di daftar tunggu"),
    "EL005": (409, "Tiket masih tersedia, daftar tunggu ditolak"),
    "EL006": (404, "Pendaftaran tidak ditemukan atau sudah dibatalkan"),
    "EL007": (409, "Peserta sudah check-in, tidak bisa dibatalkan"),
    "23514": (422, "Data melanggar constraint (format salah)"),
    "23505": (409, "Data duplikat (unique violation)"),
}

async def database_exception_handler(request: Request, exc: Exception):
    """Menangkap error dari PostgreSQL dan mengubahnya jadi JSON standar."""
    sqlstate = getattr(exc, "sqlstate", None)
    
    if sqlstate:
        # Ambil status code dan pesan default dari peta
        status_code, default_msg = SQLSTATE_MAP.get(sqlstate, (500, "Terjadi kesalahan pada database"))
        
        # Ambil pesan error asli dari database jika ada
        db_message = ""
        if hasattr(exc, "diag") and exc.diag.message_primary:
            db_message = exc.diag.message_primary
            
        if sqlstate not in SQLSTATE_MAP:
            logger.error("Database error %s: %s", sqlstate, exc)
            db_message = ""
        elif sqlstate == "EL006" and "sudah dibatalkan" in db_message:
            status_code = 409

        return JSONResponse(
            status_code=status_code,
            content={
                "error": {
                    "code": sqlstate if sqlstate in SQLSTATE_MAP else "UNKNOWN",
                    "message": db_message if db_message else default_msg,
                    "details": None,
                    "request_id": str(uuid.uuid4())
                }
            }
        )
    
    # Jika bukan error database yang dikenal, kembalikan 500
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "UNKNOWN",
                "message": "Internal Server Error",
                "details": "Terjadi kesalahan yang tidak terduga.",
                "request_id": str(uuid.uuid4())
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Menangkap error validasi Pydantic (422 Unprocessable Entity)."""
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "23514",
                "message": "Validasi input gagal",
                "details": exc.errors(),
                "request_id": str(uuid.uuid4())
            }
        }
    )

def not_implemented():
    """
    Placeholder untuk endpoint yang belum diisi logika bisnisnya.
    Mengembalikan HTTP 501 sesuai standar.
    """
    import uuid
    return JSONResponse(
        status_code=501,
        content={
            "error": {
                "code": "NOT_IMPLEMENTED",
                "message": "Endpoint ini sedang dalam pengembangan dan belum tersedia.",
                "details": None,
                "request_id": str(uuid.uuid4())
            }
        }
    )