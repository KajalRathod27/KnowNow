# 🧠 Fake News Detection — MLOps Pipeline

> End-to-end ML Engineer project with FastAPI, MLflow, Docker, Evidently AI drift detection, and CI/CD.

## Tech Stack
- **Model**: TF-IDF + Logistic Regression (scikit-learn)
- **Tracking**: MLflow (experiment + model versioning)
- **API**: FastAPI (single, batch, CSV endpoints)
- **Monitoring**: Evidently AI (data drift reports) + JSON prediction logs
- **Infra**: Docker + GitHub Actions CI/CD

## Quick Start (Windows)
```powershell
# 1. Activate virtual environment
venv\Scripts\activate

# 2. Train the model
python src/train.py

# 3. Start the API
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/predict` | Single text prediction |
| POST | `/predict/batch` | JSON list of texts |
| POST | `/predict/csv` | Upload CSV file |

## Swagger Docs
Open → http://localhost:8000/docs

## MLflow Dashboard
```powershell
mlflow ui
```
Open → http://localhost:5000

## Docker
```powershell
docker build -t fake-news-api .
docker run -p 8000:8000 fake-news-api
```

## Drift Report
```powershell
python monitoring/drift.py
# Open monitoring/reports/drift_report.html
```

## Run Tests
```powershell
pytest tests/ -v
```