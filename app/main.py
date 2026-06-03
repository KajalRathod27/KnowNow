from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import io
import os
import sys

sys.path.insert(0, os.path.abspath("."))
from app.schema import NewsInput, BatchNewsInput
from monitoring.logger import log_prediction

app = FastAPI(
    title="Fake News Detection API",
    description="End-to-end MLOps pipeline — TF-IDF + Logistic Regression",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model      = joblib.load("models/model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")
LABELS     = {0: "FAKE", 1: "REAL"}

# ── Health ──────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Fake News Detection API running", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": True}

# ── Single prediction ────────────────────────────────────
# @app.post("/predict")
# def predict(data: NewsInput):
#     if not data.text.strip():
#         raise HTTPException(status_code=400, detail="Text cannot be empty")

#     vec        = vectorizer.transform([data.text])
#     pred       = int(model.predict(vec)[0])
#     confidence = round(float(max(model.predict_proba(vec)[0])), 4)

#     log_prediction(data.text, LABELS[pred], confidence)

#     return {
#         "prediction": LABELS[pred],
#         "confidence": confidence,
#         "label":      pred
#     }

@app.post("/predict")
def predict(data: NewsInput):
    vec        = vectorizer.transform([data.text])
    proba      = model.predict_proba(vec)[0]
    confidence = float(max(proba))

    # Only label FAKE if confidence is HIGH — else call it REAL
    if proba[0] > 0.75:          # 75% sure it's fake
        pred = 0
    elif proba[1] > 0.75:        # 75% sure it's real
        pred = 1
    else:
        pred = 1                  # low confidence → default to REAL

    return {
        "prediction": LABELS[pred],
        "confidence": round(confidence, 4),
        "label": pred
    }
# ── Batch prediction (JSON list) ─────────────────────────
# @app.post("/predict/batch")
# def predict_batch(data: BatchNewsInput):
#     if not data.texts:
#         raise HTTPException(status_code=400, detail="texts list is empty")

#     results = []
#     for text in data.texts:
#         vec        = vectorizer.transform([text])
#         pred       = int(model.predict(vec)[0])
#         confidence = round(float(max(model.predict_proba(vec)[0])), 4)
#         results.append({
#             "text":       text[:80] + "..." if len(text) > 80 else text,
#             "prediction": LABELS[pred],
#             "confidence": confidence
#         })

#     return {"results": results, "count": len(results)}

@app.post("/predict/batch")
def predict_batch(data: BatchNewsInput):
    if not data.texts:
        raise HTTPException(status_code=400, detail="texts list is empty")

    results = []
    for text in data.texts:
        vec   = vectorizer.transform([text])
        proba = model.predict_proba(vec)[0]
        confidence = float(max(proba))

        # SAME logic as single predict
        if proba[0] > 0.75:
            pred = 0
        elif proba[1] > 0.75:
            pred = 1
        else:
            pred = 1   # default REAL

        results.append({
            "text": text[:80] + "..." if len(text) > 80 else text,
            "prediction": LABELS[pred],
            "confidence": round(confidence, 4)
        })

    return {"results": results, "count": len(results)}

# ── Batch prediction (CSV upload) ────────────────────────
# @app.post("/predict/csv")
# async def predict_csv(file: UploadFile = File(...)):
#     if not file.filename.endswith(".csv"):
#         raise HTTPException(status_code=400, detail="Only .csv files accepted")

#     contents = await file.read()
#     df       = pd.read_csv(io.StringIO(contents.decode("utf-8")))

#     if "text" not in df.columns:
#         raise HTTPException(
#             status_code=400,
#             detail="CSV must have a column named 'text'"
#         )

#     vec    = vectorizer.transform(df["text"].fillna(""))
#     preds  = model.predict(vec)
#     probas = model.predict_proba(vec)

#     df["prediction"] = [LABELS[p] for p in preds]
#     df["confidence"] = [round(float(max(p)), 4) for p in probas]

#     return JSONResponse(
#         content=df[["text", "prediction", "confidence"]].to_dict(orient="records")
#     )

@app.post("/predict/csv")
async def predict_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files accepted")

    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    if "text" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="CSV must have a column named 'text'"
        )

    texts = df["text"].fillna("")
    vec   = vectorizer.transform(texts)
    probas = model.predict_proba(vec)

    predictions = []
    confidences = []

    for proba in probas:
        confidence = float(max(proba))

        # SAME logic as single predict
        if proba[0] > 0.75:
            pred = 0
        elif proba[1] > 0.75:
            pred = 1
        else:
            pred = 1   # default REAL

        predictions.append(LABELS[pred])
        confidences.append(round(confidence, 4))

    df["prediction"] = predictions
    df["confidence"] = confidences

    return JSONResponse(
        content=df[["text", "prediction", "confidence"]].to_dict(orient="records")
    )