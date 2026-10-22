"""PostgreSQL connection pool (psycopg 3).

`with get_conn() as conn:` commits on success and rolls back if an exception
escapes the block. That is exactly the all-or-nothing behaviour needed for the
checkout transaction (IK301 evidence).
"""
from contextlib import contextmanager

from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from app.core.config import settings

_pool: ConnectionPool | None = None


def init_pool() -> None:
    global _pool
    _pool = ConnectionPool(
        settings.database_url,
        min_size=1,
        max_size=10,
        kwargs={"row_factory": dict_row},
        open=True,
    )


def close_pool() -> None:
    if _pool is not None:
        _pool.close()


@contextmanager
def get_conn():
    if _pool is None:
        raise RuntimeError("Database pool is not initialised")
    with _pool.connection() as conn:
        yield conn
