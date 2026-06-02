import mlflow
import mlflow.sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, classification_report
import joblib
import os
import sys

sys.path.insert(0, os.path.abspath("."))
from src.preprocess import load_data, preprocess

os.makedirs("models", exist_ok=True)
os.makedirs("logs", exist_ok=True)

mlflow.set_tracking_uri("./mlruns")
mlflow.set_experiment("fake-news-detection")

def train():
    print("Loading data...")
    df = load_data()
    X_train, X_test, y_train, y_test, vectorizer = preprocess(df)

    print("Training model...")
    with mlflow.start_run():
        model = LogisticRegression(max_iter=1000, C=1.0, solver="lbfgs")
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        f1  = f1_score(y_test, y_pred, average="weighted")

        mlflow.log_param("max_features", 5000)
        mlflow.log_param("C", 1.0)
        mlflow.log_param("solver", "lbfgs")
        mlflow.log_metric("accuracy", acc)
        mlflow.log_metric("f1_score", f1)
        mlflow.sklearn.log_model(model, "model")

        print(f"\n✅ Accuracy : {acc:.4f}")
        print(f"✅ F1 Score : {f1:.4f}")
        print("\n" + classification_report(y_test, y_pred, target_names=["FAKE", "REAL"]))

        joblib.dump(model, "models/model.pkl")
        print("Model saved to models/model.pkl")

    return model

if __name__ == "__main__":
    train()