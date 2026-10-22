import os

# Lets the tests run inside or outside Docker (no real database needed here).
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost:5432/test")
os.environ.setdefault("JWT_SECRET", "test-secret-do-not-use")
