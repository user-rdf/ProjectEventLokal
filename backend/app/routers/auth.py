from fastapi import APIRouter

from app.core.errors import not_implemented
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=201)
def register(body: RegisterRequest):
    """Organizer sign-up (hash with security.hash_password, role='organizer')."""
    raise not_implemented()


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    """Verify password, return create_access_token(user_id, role)."""
    raise not_implemented()
