SKILLS = [
    "python", "java", "javascript", "react", "node", "fastapi",
    "django", "flask", "mongodb", "mysql", "postgresql",
    "api", "rest", "rest api", "docker", "kubernetes",
    "aws", "azure", "git", "github", "linux",
    "machine learning", "nlp", "data analysis",
    "html", "css", "tailwind", "sql"
]
def extract_skills(text: str):
    text = text.lower()
    return [s for s in SKILLS if s in text]

def skill_gap(resume: str, job: str):
    resume_skills = set(extract_skills(resume))
    job_skills = set(extract_skills(job))

    return {
        "matched": list(resume_skills & job_skills),
        "missing": list(job_skills - resume_skills)
    }
