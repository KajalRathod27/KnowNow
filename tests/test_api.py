import sys, os
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    assert "message" in res.json()

def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_predict_returns_valid_label():
    res = client.post("/predict", json={
        "text": "Shocking truth revealed! Government hiding alien invasion secrets."
    })
    assert res.status_code == 200
    data = res.json()
    assert data["prediction"] in ["FAKE", "REAL"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert data["label"] in [0, 1]

def test_predict_real_news():
    res = client.post("/predict", json={
        "text": "The Federal Reserve raised interest rates by 0.25 percentage points on Wednesday."
    })
    assert res.status_code == 200
    assert res.json()["prediction"] in ["FAKE", "REAL"]

def test_predict_empty_text():
    res = client.post("/predict", json={"text": ""})
    assert res.status_code == 400

def test_batch_predict():
    res = client.post("/predict/batch", json={
        "texts": [
            "Aliens have landed in New York city tonight breaking news",
            "The president signed the bill into law on Friday afternoon."
        ]
    })
    assert res.status_code == 200
    assert res.json()["count"] == 2
    for item in res.json()["results"]:
        assert item["prediction"] in ["FAKE", "REAL"]

def test_batch_empty():
    res = client.post("/predict/batch", json={"texts": []})
    assert res.status_code == 400