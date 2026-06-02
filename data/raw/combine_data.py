import pandas as pd

fake = pd.read_csv("data/raw/Fake.csv")
real = pd.read_csv("data/raw/True.csv")

fake["label"] = "FAKE"
real["label"] = "REAL"

df = pd.concat([fake, real], ignore_index=True)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)
df.to_csv("data/raw/news.csv", index=False)

print(f"Done! Total rows: {len(df)}")
print(df["label"].value_counts())