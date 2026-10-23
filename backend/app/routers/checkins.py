from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.checkin import CheckInRequest
from app.db.pool import get_conn
from app.core.security import current_user

router = APIRouter()

@router.post("/manage/check-ins", status_code=status.HTTP_201_CREATED)
def check_in(payload: CheckInRequest, user: dict = Depends(current_user)):
    """
    Endpoint untuk scan QR di pintu masuk.
    Memanggil fungsi database 'check_in' yang menangani validasi sekali pakai.
    Bisa diakses oleh organizer maupun staff.
    """
    with get_conn() as conn:
        # Panggil fungsi DB: check_in(p_event_id, p_code, p_staff_id)
        # user["sub"] berisi user_id (string UUID) dari token JWT
        row = conn.execute(
            "SELECT check_in(%s, %s, %s) AS result",
            (payload.event_id, payload.code, user["sub"])
        ).fetchone()
        
        if not row or not row["result"]:
            raise HTTPException(status_code=500, detail="Gagal memproses check-in di database")
        
        result = row["result"]
        res_status = result.get("status")
        message = result.get("message", "Terjadi kesalahan")
        
        # Pemetaan status dari DB ke HTTP Code sesuai Kontrak API
        if res_status == "valid":
            return result # 201 Created
        elif res_status == "invalid":
            raise HTTPException(status_code=404, detail=message)
        else: 
            # already_used, cancelled, wrong_event -> 409 Conflict
            raise HTTPException(status_code=409, detail=message)