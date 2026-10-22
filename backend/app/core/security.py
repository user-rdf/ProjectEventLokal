"""Password hashing and JWT login tokens for organizers/staff."""
import time

import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

ALGORITHM = "HS256"
bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_access_token(user_id: int, role: str) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": int(time.time()) + settings.jwt_expire_minutes * 60,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid atau kedaluwarsa")


def current_user(creds: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    """Dependency for every /manage endpoint: returns {sub, role, exp}."""
    if creds is None:
        raise HTTPException(status_code=401, detail="Harus login terlebih dahulu")
    return decode_token(creds.credentials)


def require_organizer(user: dict = Depends(current_user)) -> dict:
    if user.get("role") != "organizer":
        raise HTTPException(status_code=403, detail="Hanya panitia yang boleh mengakses")
    return user
