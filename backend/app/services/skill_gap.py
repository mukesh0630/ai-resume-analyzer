import re
from typing import Dict, List

SKILL_KEYWORDS = {
    "python": ["python"],
    "java": ["java"],
    "javascript": ["javascript", "js"],
    "react": ["react", "react.js", "reactjs"],
    "fastapi": ["fastapi"],
    "django": ["django"],
    "mongodb": ["mongodb", "mongo", "mongo db"],
    "sql": ["sql", "mysql", "postgres", "postgresql"],
    "docker": ["docker", "dockerfile", "docker-compose"],
    "aws": ["aws", "amazon web services", "ec2", "s3", "iam"],
    "git": ["git", "github", "gitlab"],
    "nlp": ["nlp", "natural language processing"],
    "api": ["api", "rest api", "restful api"],
    "ats": ["ats", "applicant tracking system"]
}


def normalize_text(text: str) -> str:
    """
    Normalize resume/job text to avoid parsing issues
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s.+]", " ", text)  # remove bullets/symbols
    text = re.sub(r"\s+", " ", text)            # normalize spacing
    return text


def extract_skills(text: str) -> List[str]:
    text = normalize_text(text)
    found = set()

    for skill, variants in SKILL_KEYWORDS.items():
        for v in variants:
            if v in text:
                found.add(skill)
                break

    return sorted(found)


def calculate_skill_gap(resume_text: str, job_text: str) -> Dict:
    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_text))

    matched = sorted(resume_skills & job_skills)
    missing = sorted(job_skills - resume_skills)

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "resume_skills": sorted(resume_skills),
        "job_skills": sorted(job_skills),
    }
