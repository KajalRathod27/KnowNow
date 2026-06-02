import pandas as pd
import joblib
import os
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, DataQualityPreset

REPORT_DIR = "monitoring/reports"
os.makedirs(REPORT_DIR, exist_ok=True)

def generate_drift_report(reference_texts: list, current_texts: list):
    """
    Generate an Evidently drift report comparing reference vs current data.
    reference_texts : list of strings from training data sample
    current_texts   : list of strings from recent API calls
    """
    vectorizer = joblib.load("models/vectorizer.pkl")

    # Convert to dense feature DataFrames (use top 50 features for readability)
    ref_vec  = vectorizer.transform(reference_texts)
    curr_vec = vectorizer.transform(current_texts)

    feature_names = vectorizer.get_feature_names_out()[:50]

    ref_df  = pd.DataFrame(ref_vec.toarray()[:, :50],  columns=feature_names)
    curr_df = pd.DataFrame(curr_vec.toarray()[:, :50], columns=feature_names)

    report = Report(metrics=[DataDriftPreset(), DataQualityPreset()])
    report.run(reference_data=ref_df, current_data=curr_df)

    report_path = os.path.join(REPORT_DIR, "drift_report.html")
    report.save_html(report_path)
    print(f"Drift report saved: {report_path}")
    return report_path

def simple_drift_check(reference_texts: list, current_texts: list, threshold=0.05):
    """
    Quick statistical drift check without full Evidently report.
    Returns True if drift is detected.
    """
    import numpy as np
    vectorizer = joblib.load("models/vectorizer.pkl")

    ref_arr  = vectorizer.transform(reference_texts).toarray()
    curr_arr = vectorizer.transform(current_texts).toarray()

    mean_diff = abs(ref_arr.mean() - curr_arr.mean())
    std_diff  = abs(ref_arr.std()  - curr_arr.std())

    drift = mean_diff > threshold or std_diff > threshold
    print(f"Mean diff: {mean_diff:.5f} | Std diff: {std_diff:.5f} | Drift: {drift}")
    return drift


# ── Run standalone to generate a report ─────────────────
if __name__ == "__main__":
    # Sample usage: compare training data slice vs a new slice
    from src.preprocess import load_data
    df = load_data()
    texts = df["content"].tolist()

    reference = texts[:2000]
    current   = texts[2000:4000]   # simulate new incoming data

    generate_drift_report(reference, current)
    print("Open monitoring/reports/drift_report.html in your browser!")