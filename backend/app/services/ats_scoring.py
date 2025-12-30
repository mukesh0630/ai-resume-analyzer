import re
from backend.app.services.skill_gap import extract_skills

SECTION_KEYWORDS = [
    "experience",
    "skills",
    "projects",
    "education",
    "certifications"
]

def calculate_ats_score(resume_text: str, job_text: str):
    resume = resume_text.lower()
    job = job_text.lower()

    resume_skills = extract_skills(resume)
    job_skills = extract_skills(job)

    if not job_skills:
        return {"ats_score": 0}

    # 1️⃣ Keyword Match Ratio (40%)
    matched = resume_skills & job_skills
    match_ratio = len(matched) / len(job_skills)
    keyword_score = match_ratio * 40

    # 2️⃣ Keyword Frequency (20%)
    freq_score = 0
    for skill in job_skills:
        freq = resume.count(skill)
        if freq >= 3:
            freq_score += 2
        elif freq == 2:
            freq_score += 1.5
        elif freq == 1:
            freq_score += 1
    freq_score = min(freq_score, 20)

    # 3️⃣ Section Presence (15%)
    section_hits = sum(1 for s in SECTION_KEYWORDS if s in resume)
    section_score = min((section_hits / len(SECTION_KEYWORDS)) * 15, 15)

    # 4️⃣ Skill Coverage (15%)
    coverage_score = (len(matched) / max(len(resume_skills), 1)) * 15

    # 5️⃣ Resume Length Quality (10%)
    word_count = len(resume.split())
    if word_count < 150:
        length_score = 2
    elif word_count < 300:
        length_score = 6
    else:
        length_score = 10

    total_score = (
        keyword_score +
        freq_score +
        section_score +
        coverage_score +
        length_score
    )

    return {
        "ats_score": round(min(total_score, 100), 2),
        "matched_skills": list(matched),
        "missing_skills": list(job_skills - resume_skills)
    }
