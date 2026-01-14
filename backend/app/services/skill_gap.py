import re
from typing import Dict, List, Set
from difflib import get_close_matches

# Expanded and normalized skill keywords with aliases
SKILL_KEYWORDS = {

    # =========================
    # PROGRAMMING LANGUAGES
    # =========================
    "python": ["python"],
    "java": ["java"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],
    "c": ["c language"],
    "cpp": ["c++"],
    "csharp": ["c#", "c sharp"],
    "go": ["go", "golang"],
    "rust": ["rust"],
    "php": ["php"],
    "ruby": ["ruby"],
    "kotlin": ["kotlin"],
    "swift": ["swift"],
    "r": ["r language"],

    # =========================
    # FRONTEND
    # =========================
    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "react": ["react", "react.js", "reactjs"],
    "angular": ["angular"],
    "vue": ["vue", "vue.js"],
    "nextjs": ["next.js", "nextjs"],
    "tailwind": ["tailwind", "tailwind css"],
    "bootstrap": ["bootstrap"],
    "redux": ["redux"],
    "webpack": ["webpack"],
    "vite": ["vite"],

    # =========================
    # BACKEND
    # =========================
    "fastapi": ["fastapi"],
    "django": ["django", "django rest framework", "drf"],
    "flask": ["flask"],
    "spring": ["spring", "spring boot"],
    "node": ["node", "node.js"],
    "express": ["express", "express.js"],
    "nestjs": ["nestjs"],
    "graphql": ["graphql"],

    # =========================
    # DATABASES
    # =========================
    "mongodb": ["mongodb", "mongo", "mongo db"],
    "mysql": ["mysql"],
    "postgresql": ["postgres", "postgresql"],
    "sqlite": ["sqlite"],
    "oracle": ["oracle db"],
    "redis": ["redis"],
    "firebase": ["firebase", "firestore", "realtime database"],
    "elasticsearch": ["elasticsearch"],

    # =========================
    # CLOUD & DEVOPS
    # =========================
    "aws": ["aws", "amazon web services", "ec2", "s3", "iam", "lambda"],
    "azure": ["azure", "microsoft azure"],
    "gcp": ["gcp", "google cloud"],
    "docker": ["docker", "dockerfile", "docker-compose"],
    "kubernetes": ["kubernetes", "k8s"],
    "ci_cd": ["ci/cd", "github actions", "gitlab ci", "jenkins"],
    "terraform": ["terraform"],
    "ansible": ["ansible"],

    # =========================
    # VERSION CONTROL
    # =========================
    "git": ["git", "github", "gitlab", "bitbucket"],

    # =========================
    # DATA, AI, ML
    # =========================
    "data_analysis": ["data analysis", "data analytics"],
    "machine_learning": ["machine learning", "ml"],
    "deep_learning": ["deep learning", "dl"],
    "nlp": ["nlp", "natural language processing"],
    "computer_vision": ["computer vision"],
    "tensorflow": ["tensorflow"],
    "pytorch": ["pytorch"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "scikit_learn": ["scikit-learn", "sklearn"],

    # =========================
    # TESTING & QA
    # =========================
    "unit_testing": ["unit testing", "pytest", "junit"],
    "automation_testing": ["automation testing", "selenium", "cypress"],
    "manual_testing": ["manual testing"],
    "api_testing": ["postman", "rest assured"],

    # =========================
    # SECURITY
    # =========================
    "cybersecurity": ["cybersecurity", "information security"],
    "penetration_testing": ["penetration testing", "pentesting"],
    "owasp": ["owasp"],
    "network_security": ["network security"],

    # =========================
    # ATS & RESUME
    # =========================
    "ats": ["ats", "applicant tracking system"],
    "resume_parsing": ["resume parsing"],
    "keyword_optimization": ["keyword optimization"],

    # =========================
    # BUSINESS / PRODUCT
    # =========================
    "business_analysis": ["business analysis"],
    "product_management": ["product management"],
    "project_management": ["project management"],
    "agile": ["agile", "scrum"],
    "jira": ["jira"],
    "confluence": ["confluence"],

    # =========================
    # SOFT SKILLS (VERY IMPORTANT)
    # =========================
    "communication": [
        "communication", "verbal communication", "written communication"
    ],
    "teamwork": ["teamwork", "team player", "collaboration"],
    "leadership": ["leadership", "team leadership"],
    "problem_solving": ["problem solving", "analytical thinking"],
    "critical_thinking": ["critical thinking"],
    "time_management": ["time management"],
    "adaptability": ["adaptability", "flexibility"],
    "creativity": ["creativity", "innovative thinking"],
    "decision_making": ["decision making"],
    "work_ethic": ["work ethic"],
    "attention_to_detail": ["attention to detail"],

}

def tokenize(text: str) -> List[str]:
    t = text.lower()
    t = re.sub(r"[^a-z0-9+#\s]", " ", t)
    toks = [tok.strip() for tok in t.split() if len(tok) > 1]
    return list(dict.fromkeys(toks))  # preserve order, dedupe


def extract_skills(text: str) -> Set[str]:
    text = text.lower()
    found = set()

    tokens = tokenize(text)

    # direct match on variants
    for skill, variants in SKILL_KEYWORDS.items():
        for v in variants:
            pattern = rf"\b{re.escape(v)}\b"
            if re.search(pattern, text):
                found.add(skill)
                break

    # fuzzy match tokens to variant forms (catch plurals / small typos)
    all_variants = {v for variants in SKILL_KEYWORDS.values() for v in variants}
    for tok in tokens:
        if tok in all_variants:
            continue
        close = get_close_matches(tok, list(all_variants), n=1, cutoff=0.85)
        if close:
            # map back to canonical skill
            for skill, variants in SKILL_KEYWORDS.items():
                if close[0] in variants:
                    found.add(skill)
                    break

    return found


def calculate_skill_gap(resume_text: str, job_text: str):
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_text)

    matched = sorted(resume_skills & job_skills)
    missing = sorted(job_skills - resume_skills)

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "resume_skills": sorted(resume_skills),
        "job_skills": sorted(job_skills),
    }