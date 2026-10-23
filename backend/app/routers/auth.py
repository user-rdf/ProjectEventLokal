from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import RegisterRequest, LoginRequest
from app.db.pool import get_conn
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest):
    with get_conn() as conn:
        # Cek apakah email sudah ada
        existing = conn.execute("SELECT id FROM users WHERE email = %s", (payload.email,)).fetchone()
        if existing:
            raise HTTPException(status_code=409, detail="Email sudah terdaftar")
        
        # Hash password dan simpan user baru (default role: organizer)
        pwd_hash = hash_password(payload.password)
        conn.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, 'organizer')",
            (payload.name, payload.email, pwd_hash)
        )
        return {"message": "Akun panitia berhasil dibuat"}

@router.post("/auth/login")
def login(payload: LoginRequest):
    with get_conn() as conn:
        # Cari user berdasarkan email
        user = conn.execute(
            "SELECT id, password_hash, role FROM users WHERE email = %s", (payload.email,)
        ).fetchone()
        
        # Validasi password
        if not user or not verify_password(payload.password, user["password_hash"]):
            # Pesan umum sesuai kontrak (tidak membocorkan apakah email ada)
            raise HTTPException(status_code=401, detail="Email atau password salah")
        
        # Buat JWT Token menggunakan fungsi yang sudah ada di security.py
        # user["id"] adalah UUID, fungsi create_access_token akan otomatis mengonversinya ke string
        token = create_access_token(user_id=user["id"], role=user["role"])
        return {"access_token": token, "token_type": "bearer"}