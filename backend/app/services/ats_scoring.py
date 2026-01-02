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
        return {"ats_score": 0, "matched_skills": [], "missing_skills": []}

    matched = resume_skills & job_skills

    # 🔥 1️⃣ SKILL MATCH (60%)
    skill_match_ratio = len(matched) / len(job_skills)
    skill_score = skill_match_ratio * 60

    # 🔥 2️⃣ KEYWORD FREQUENCY (20%) — VARIANT-AWARE
    freq_score = 0
    for skill in job_skills:
        freq = sum(resume.count(v) for v in skill.split())
        if freq >= 3:
            freq_score += 2
        elif freq == 2:
            freq_score += 1.5
        elif freq == 1:
            freq_score += 1
    freq_score = min(freq_score, 20)

    # 🔹 3️⃣ SECTION PRESENCE (10%)
    section_hits = sum(1 for s in SECTION_KEYWORDS if s in resume)
    section_score = (section_hits / len(SECTION_KEYWORDS)) * 10

    # 🔹 4️⃣ RESUME LENGTH (10%)
    word_count = len(resume.split())
    if word_count < 150:
        length_score = 4
    elif word_count < 300:
        length_score = 7
    else:
        length_score = 10

    total_score = (
        skill_score +
        freq_score +
        section_score +
        length_score
    )

    return {
        "ats_score": round(min(total_score, 100), 2),
        "matched_skills": sorted(matched),
        "missing_skills": sorted(job_skills - resume_skills)
    }
