import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_predict_happy_path(client):
    payload = {
        "location": "some_known_or_unknown_location",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Furnished",
        "transaction": "New Property",
        "ownership": "Freehold",
        "facing": "East",
    }
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 200
    assert "predicted_price" in resp.json()


def test_predict_invalid_input(client):
    payload = {
        "location": "x",
        "carpet_area_sqft": -5,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Furnished",
        "transaction": "New Property",
        "ownership": "Freehold",
        "facing": "East",
    }
    resp = client.post("/predict", json=payload)
    assert resp.status_code == 422