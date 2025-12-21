def calculate_ats_score(resume_text: str, job_text: str) -> float:
    resume_words = set(resume_text.lower().split())
    job_words = set(job_text.lower().split())

    matched = resume_words.intersection(job_words)
    if not job_words:
        return 0.0

    score = (len(matched) / len(job_words)) * 100
    return round(score, 2)
