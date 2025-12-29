from backend.app.services.skill_gap import extract_skills

def calculate_ats_score(resume_text: str, job_text: str) -> float:
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)

    if not job_skills:
        return 50.0  # neutral score

    match_count = len(resume_skills & job_skills)
    total_required = len(job_skills)

    skill_match_ratio = match_count / total_required

    # weighted ATS score
    ats_score = (
        skill_match_ratio * 70 +  # skills matter most
        min(len(resume_text) / 2000, 1) * 30
    )

    return round(min(ats_score, 95), 2)
