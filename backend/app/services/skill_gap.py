import re

SKILL_KEYWORDS = {
    "python": ["python"],
    "java": ["java"],
    "javascript": ["javascript", "js"],
    "react": ["react", "react.js"],
    "fastapi": ["fastapi"],
    "django": ["django"],
    "mongodb": ["mongodb", "mongo"],
    "sql": ["sql", "mysql", "postgres"],
    "docker": ["docker"],
    "aws": ["aws", "amazon web services"],
    "git": ["git", "github"],
    "nlp": ["nlp", "natural language processing"],
    "api": ["api", "rest", "rest api"]
}

def extract_skills(text: str):
    text = text.lower()
    found = set()

    for skill, variants in SKILL_KEYWORDS.items():
        for v in variants:
            if re.search(rf"\b{v}\b", text):
                found.add(skill)
                break

    return found


def calculate_skill_gap(resume_text: str, job_text: str):
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)

    matched = list(resume_skills & job_skills)
    missing = list(job_skills - resume_skills)

    return {
        "matched_skills": matched,
        "missing_skills": missing
    }
