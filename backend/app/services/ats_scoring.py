import re
from sklearn.feature_extraction.text import CountVectorizer


def clean_text(text: str):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9 ]", " ", text)
    return text


def calculate_ats_score(resume_text: str, job_description: str):
    resume_text = clean_text(resume_text)
    job_description = clean_text(job_description)

    vectorizer = CountVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform([resume_text, job_description])

    resume_vec = vectors.toarray()[0]
    job_vec = vectors.toarray()[1]

    matched_keywords = []
    missing_keywords = []

    for word, idx in vectorizer.vocabulary_.items():
        if job_vec[idx] > 0:
            if resume_vec[idx] > 0:
                matched_keywords.append(word)
            else:
                missing_keywords.append(word)

    if len(matched_keywords) == 0:
        score = 0
    else:
        score = int((len(matched_keywords) / len(matched_keywords + missing_keywords)) * 100)

    return {
        "ats_score": score,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords
    }
