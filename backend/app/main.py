from contextlib import asynccontextmanager
from pathlib import Path

import psycopg
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse

from app.core.errors import database_exception_handler, validation_exception_handler
from app.db.pool import close_pool, get_conn, init_pool

from app.routers import (attendees, auth, bookings, checkins, manage_events,
                            public_events, reports, waitlist)

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_pool()
    yield
    close_pool()


app = FastAPI(title="EventLokal API", version="0.2.0", lifespan=lifespan)

# ==========================================================
# TAMBAHAN: DAFTARKAN GLOBAL ERROR HANDLER
# ==========================================================
# Tangkap SEMUA error dari psycopg (termasuk DatabaseError untuk custom SQLSTATE seperti EL001)
app.add_exception_handler(psycopg.Error, database_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
# ==========================================================


api = APIRouter(prefix="/api/v1")


@api.get("/health", tags=["health"])
def health():
    return {"status": "ok"}


@api.get("/health/db", tags=["health"], include_in_schema=False)
def health_db():
    with get_conn() as conn:
        row = conn.execute("SELECT version() AS v").fetchone()
    return {"status": "ok", "postgres": row["v"]}


for r in (auth.router, public_events.router, bookings.router, manage_events.router,
          attendees.router, checkins.router, reports.router, waitlist.router):
    api.include_router(r)

app.include_router(api)


# ==========================================================
# PENYAJI HALAMAN REACT (SPA CATCH-ALL)
# ==========================================================
# Menggabungkan frontend & backend dalam satu URL/service.
# Menangani refresh rute SPA seperti /events/:slug dan /dashboard tanpa 404.
STATIC_DIR = Path("static")

@app.get("/{path:path}", include_in_schema=False)
def spa(path: str):
    if path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not Found")
    f = STATIC_DIR / path
    if path and f.is_file():
        return FileResponse(f)
    index_file = STATIC_DIR / "index.html"
    if index_file.is_file():
        return FileResponse(index_file)
    return FileResponse("static/index.html")