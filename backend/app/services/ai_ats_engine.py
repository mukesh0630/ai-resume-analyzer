import os
import json
import timeout_decorator
from backend.app.services.skill_gap import extract_skills


def analyze_resume_with_ai(resume_text: str, job_description: str, timeout_secs: int = 10):
    """
    Lightweight deterministic analyzer that reduces LLM calls.
    Returns a structure compatible with previous AI-ATS output but deterministic.
    """
    resume = resume_text or ""
    job = job_description or ""

    # reuse skill extractor
    resume_skills = extract_skills(resume)
    job_skills = extract_skills(job)

    matched = sorted(resume_skills & job_skills)
    missing = sorted(job_skills - resume_skills)

    ats_score = 50
    if job_skills:
        raw = (len(matched) / len(job_skills)) * 100
        ats_score = max(30, min(95, round(raw)))

    # simple deterministic feedback
    feedback = []
    if ats_score < 60:
        feedback.append("Add more job-specific keywords and measurable achievements.")
    else:
        feedback.append("Good keyword match; emphasize achievements with metrics.")

    roadmap = [f"Learn {s}" for s in missing[:5]]

    return {
        "ats_score": ats_score,
        "matched_skills": matched,
        "missing_skills": missing,
        "feedback": feedback,
        "roadmap": roadmap
    }
