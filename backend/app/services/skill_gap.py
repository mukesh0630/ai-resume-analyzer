COMMON_SKILLS = [
    "python", "java", "javascript", "react", "node", "fastapi",
    "django", "flask", "mongodb", "mysql", "postgresql",
    "api", "rest", "rest api", "docker", "kubernetes",
    "aws", "azure", "git", "github", "linux",
    "machine learning", "nlp", "data analysis",
    "html", "css", "tailwind", "sql"
]


def normalize(text: str):
    return text.lower()


def detect_skill_gap(resume_text: str, job_description: str):
    resume_text = normalize(resume_text)
    job_description = normalize(job_description)

    required_skills = []
    for skill in COMMON_SKILLS:
        if skill in job_description:
            required_skills.append(skill)

    matched = [skill for skill in required_skills if skill in resume_text]
    missing = [skill for skill in required_skills if skill not in resume_text]

    return {
        "required_skills": required_skills,
        "matched_skills": matched,
        "missing_skills": missing
    }
