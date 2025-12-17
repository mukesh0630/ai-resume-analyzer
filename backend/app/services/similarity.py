from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def calculate_similarity(resume_text: str, job_description: str):
    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, job_description])

    similarity_score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    return {
        "similarity_percentage": round(similarity_score * 100, 2)
    }
