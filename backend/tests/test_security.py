from app.core.security import (create_access_token, decode_token, hash_password,
                               verify_password)


def test_password_roundtrip():
    h = hash_password("rahasia123")
    assert h != "rahasia123"
    assert verify_password("rahasia123", h)
    assert not verify_password("salah", h)


def test_token_roundtrip():
    payload = decode_token(create_access_token(7, "organizer"))
    assert payload["sub"] == "7" and payload["role"] == "organizer"
