from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
from surprise import Dataset, Reader, SVD
import pandas as pd
import fetch  # your serpapi script

app = FastAPI()

# Dummy training data
interactions = [
    ("user1", "https://www.reddit.com/r/learnpython/comments/11kcko1/best_way_to_learn_python/", 5),
    ("user1", "https://www.learnpython.org/", 4),
    ("user2", "https://forum.freecodecamp.org/t/how-to-learn-python-as-a-beginner/669006", 3),
    ("user2", "https://w3schools.com/python", 1),
]

# Train model once at startup
df = pd.DataFrame(interactions, columns=["user", "item", "rating"])
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(df, reader)
trainset = data.build_full_trainset()
model = SVD()
model.fit(trainset)

class RecommendRequest(BaseModel):
    query: str
    user_id: str

@app.post("/recommend")
def recommend(data: RecommendRequest):
    fetched_results = fetch.fetch_results(data.query)
    scored_results = []

    for result in fetched_results:
        item_id = result["link"]
        pred = model.predict(data.user_id, item_id)
        scored_results.append({
            "title": result["title"],
            "link": item_id,
            "predicted_rating": round(pred.est, 2)
        })

    recommended = sorted(scored_results, key=lambda x: x["predicted_rating"], reverse=True)
    return recommended