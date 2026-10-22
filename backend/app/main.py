from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI

from app.db.pool import close_pool, get_conn, init_pool
from app.routers import (attendees, auth, bookings, checkins, manage_events,
                         public_events, reports)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_pool()
    yield
    close_pool()


app = FastAPI(title="EventLokal API", version="0.2.0", lifespan=lifespan)

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
          attendees.router, checkins.router, reports.router):
    api.include_router(r)

app.include_router(api)
