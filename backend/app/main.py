from contextlib import asynccontextmanager

import psycopg
from fastapi import APIRouter, FastAPI
from fastapi.exceptions import RequestValidationError

from app.core.errors import database_exception_handler, validation_exception_handler
from app.db.pool import close_pool, get_conn, init_pool
from app.routers import (attendees, auth, bookings, checkins, manage_events,
                         public_events, reports)

from app.routers import (attendees, auth, bookings, checkins, manage_events,
                            public_events, reports, waitlist) # <-- Tambahkan waitlist di sini

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


@api.get("/health/db", tags=["health"])
def health_db():
    with get_conn() as conn:
        row = conn.execute("SELECT version() AS v").fetchone()
    return {"status": "ok", "postgres": row["v"]}


for r in (auth.router, public_events.router, bookings.router, manage_events.router,
          attendees.router, checkins.router, reports.router, waitlist.router):
    api.include_router(r)

app.include_router(api)