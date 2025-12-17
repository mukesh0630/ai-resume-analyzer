def analyze_resume_sections(resume_text: str):
    feedback = {}

    text = resume_text.lower()

    # Experience
    if "experience" in text:
        feedback["experience"] = "Good: Experience section found. Try adding measurable achievements."
    else:
        feedback["experience"] = "Missing: Add a clear Experience section."

    # Skills
    if "skills" in text:
        feedback["skills"] = "Good: Skills section present. Ensure skills match the job role."
    else:
        feedback["skills"] = "Missing: Add a Skills section with relevant technologies."

    # Education
    if "education" in text:
        feedback["education"] = "Good: Education section present."
    else:
        feedback["education"] = "Missing: Add your education details."

    # Projects
    if "project" in text:
        feedback["projects"] = "Good: Projects mentioned. Highlight tools and impact."
    else:
        feedback["projects"] = "Suggestion: Add projects to strengthen your resume."

    return feedback
