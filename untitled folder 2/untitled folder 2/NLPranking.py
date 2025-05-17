'''from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fetch

# === User query ===
query = input("Enter what you want to search for: ")

# === Sample fetched results from SerpAPI or elsewhere ===
    fetched_results = fetch.fetch_results(query)
[
    {"title": "Learn Python - Full Course for Beginners", "link": "https://youtube.com/course1"},
    {"title": "Python Programming - FreeCodeCamp", "link": "https://freecodecamp.org/python"},
    {"title": "Python Tutorial - W3Schools", "link": "https://w3schools.com/python"},
    {"title": "Advanced Python Course - Coursera", "link": "https://coursera.org/course/advanced-python"},
    {"title": "Python Basics - edX", "link": "https://edx.org/course/python-basics"},
]

# === Combine query with course titles for NLP ranking ===
titles = [course["title"] for course in fetched_results]
vectorizer = TfidfVectorizer()
vectors = vectorizer.fit_transform([query] + titles)
similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

# === Rank the results based on similarity ===
ranked_results = sorted(zip(fetched_results, similarities), key=lambda x: x[1], reverse=True)

# === Display ranked links ===
print("Ranked Course Links:")
for result, score in ranked_results:
    print(f"{result['title']} - {result['link']} (Score: {score:.2f})")

# === Placeholder: Data for Collaborative Filtering ===
# Future structure (for when you collect user interactions)
user_course_interactions = [
    # ("user_id", "https://link", rating)
    ("user1", "https://www.reddit.com/r/learnpython/comments/11kcko1/best_way_to_learn_python/", 5),
    ("user1", "https://www.learnpython.org/", 4),
    ("user2", "https://forum.freecodecamp.org/t/how-to-learn-python-as-a-beginner/669006", 3),
    ("user2", "https://w3schools.com/python", 1),
]


from surprise import Dataset, Reader, SVD
from surprise.surprise.model_selection import train_test_split
from surprise import accuracy
import pandas as pd

# Step 1: Prepare the data
interactions = [
    ("user1", "https://www.reddit.com/r/learnpython/comments/11kcko1/best_way_to_learn_python/", 5),
    ("user1", "https://www.learnpython.org/", 4),
    ("user2", "https://forum.freecodecamp.org/t/how-to-learn-python-as-a-beginner/669006", 3),
    ("user2", "https://w3schools.com/python", 1),
]

reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(
    pd.DataFrame(interactions, columns=["user", "link", "rating"]),
    reader
)

# Step 2: Train a model
trainset, testset = train_test_split(data, test_size=0.25)
model = SVD()
model.fit(trainset)

# Step 3: Predict for a user
target_user = "user1"
all_links = set([i[1] for i in interactions])
rated_links = set([i[1] for i in interactions if i[0] == target_user])
unrated_links = all_links - rated_links

recommendations = []
for link in unrated_links:
    pred = model.predict(target_user, link)
    recommendations.append((link, pred.est))

recommendations.sort(key=lambda x: x[1], reverse=True)
print("Recommended links for", target_user)
for link, score in recommendations:
    print(f"{link} (Predicted rating: {score:.2f})")
'''

from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
import pandas as pd
import fetch

query = input("Enter what you want to search for: ")
interactions = [
    ("user1", "https://www.reddit.com/r/learnpython/comments/11kcko1/best_way_to_learn_python/", 5),
    ("user1", "https://www.learnpython.org/", 4),
    ("user2", "https://forum.freecodecamp.org/t/how-to-learn-python-as-a-beginner/669006", 3),
    ("user2", "https://w3schools.com/python", 1),
]
df = pd.DataFrame(interactions, columns=["user", "item", "rating"])
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(df, reader)
trainset, testset = train_test_split(data, test_size=0.2, random_state=42)
model = SVD()
model.fit(trainset)
fetched_results = fetch.fetch_results(query)
'''[
    {"title": "Learn Python - Full Course for Beginners", "link": "https://youtube.com/course1"},
    {"title": "Python Programming - FreeCodeCamp", "link": "https://freecodecamp.org/python"},
    {"title": "Python Tutorial - W3Schools", "link": "https://w3schools.com/python"},
    {"title": "Advanced Python Course - Coursera", "link": "https://coursera.org/course/advanced-python"},
    {"title": "Python Basics - edX", "link": "https://edx.org/course/python-basics"},
]'''
user_id = "user1"
scored_results = []

for result in fetched_results:
    item_id = result["link"]
    pred = model.predict(user_id, item_id)
    scored_results.append({
        "title": result["title"],
        "link": item_id,
        "predicted_rating": pred.est
    })
recommended = sorted(scored_results, key=lambda x: x["predicted_rating"], reverse=True)
for r in recommended:
    print(f"{r['predicted_rating']:.2f} ⭐ - {r['title']} ({r['link']})")
