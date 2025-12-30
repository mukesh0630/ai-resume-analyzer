import re

SKILL_KEYWORDS = {
    "python": ["python"],
    "java": ["java"],
    "javascript": ["javascript", "js", "nodejs", "node.js"],
    "react": ["react", "reactjs", "react.js"],
    "fastapi": ["fastapi"],
    "django": ["django"],
    "mongodb": ["mongodb", "mongo", "mongoose"],
    "sql": ["sql", "mysql", "postgres", "postgresql"],
    "docker": ["docker", "dockerfile"],
    "aws": ["aws", "amazon web services", "ec2", "s3"],
    "git": ["git", "github", "gitlab"],
    "nlp": ["nlp", "natural language processing"],
    "api": ["api", "rest", "rest api"]
}
import re

def normalize(text: str):
    return re.sub(r"[^a-z0-9\s]", " ", text.lower())

def extract_skills(text: str):
    text = normalize(text)
    found = set()

    for skill, variants in SKILL_KEYWORDS.items():
        for v in variants:
            v = normalize(v)
            if v in text:
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
