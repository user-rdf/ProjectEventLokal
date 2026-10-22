from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_api_contract_is_registered():
    paths = client.get("/openapi.json").json()["paths"]
    for p in ("/api/v1/events", "/api/v1/bookings", "/api/v1/waitlist",
              "/api/v1/manage/check-ins", "/api/v1/manage/home"):
        assert p in paths


def test_manage_routes_require_login():
    r = client.get("/api/v1/manage/home")
    assert r.status_code in (401, 403)


def test_public_endpoint_validates_input():
    r = client.post("/api/v1/bookings", json={"ticket_type_id": 1, "attendee_name": "A",
                    "attendee_email": "x", "attendee_phone": "1"})
    assert r.status_code == 422
