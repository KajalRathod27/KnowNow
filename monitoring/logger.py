import json
import os
from datetime import datetime

LOG_FILE = "logs/predictions.json"
os.makedirs("logs", exist_ok=True)

def log_prediction(text: str, prediction: str, confidence: float):
    entry = {
        "timestamp":    str(datetime.now()),
        "text_snippet": text[:100],
        "prediction":   prediction,
        "confidence":   confidence
    }
    with open(LOG_FILE, "a") as f:
        json.dump(entry, f)
        f.write("\n")