import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
import joblib
import os

def load_data(path="data/raw/news.csv"):
    df = pd.read_csv(path)
    df.dropna(subset=["title", "text", "label"], inplace=True)
    df["content"] = df["title"].str.strip() + " " + df["text"].str.strip()
    print(f"Loaded {len(df)} rows")
    return df

def preprocess(df, max_features=5000, save=True):
    X = df["content"]
    y = df["label"].map({"FAKE": 0, "REAL": 1})

    vectorizer = TfidfVectorizer(max_features=max_features, stop_words="english")
    X_vec = vectorizer.fit_transform(X)

    if save:
        os.makedirs("models", exist_ok=True)
        joblib.dump(vectorizer, "models/vectorizer.pkl")
        print("Vectorizer saved.")

    X_train, X_test, y_train, y_test = train_test_split(
        X_vec, y, test_size=0.2, random_state=42
    )
    return X_train, X_test, y_train, y_test, vectorizer

if __name__ == "__main__":
    df = load_data()
    X_train, X_test, y_train, y_test, _ = preprocess(df)
    print(f"Train shape: {X_train.shape} | Test shape: {X_test.shape}")