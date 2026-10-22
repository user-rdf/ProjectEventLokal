from fastapi import HTTPException


def not_implemented() -> HTTPException:
    """Placeholder for endpoints that are not built yet (shown in Swagger already)."""
    return HTTPException(status_code=501, detail="Belum diimplementasikan")
