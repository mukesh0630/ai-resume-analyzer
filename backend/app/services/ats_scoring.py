from backend.app.services.skill_gap import extract_skills


def calculate_ats_score(resume_text: str, job_text: str):
    """
    ATS scoring based purely on skill matching per requirements:
    - normalize and extract skills
    - score = matched / total_job_skills * 100
    - clamp between 30 and 95
    - if no job skills -> 50
    """
    resume_skills = extract_skills(resume_text or "")
    job_skills = extract_skills(job_text or "")

    if not job_skills:
        return {"ats_score": 50, "matched_skills": [], "missing_skills": []}

    matched = resume_skills & job_skills
    matched_count = len(matched)
    total = len(job_skills)

    raw_score = (matched_count / total) * 100 if total else 50
    # clamp
    score = max(30, min(95, round(raw_score)))

    return {
        "ats_score": score,
        "matched_skills": sorted(matched),
        "missing_skills": sorted(job_skills - resume_skills)
    }