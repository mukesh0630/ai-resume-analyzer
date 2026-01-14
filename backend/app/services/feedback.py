def generate_feedback(ats_score: float, missing_skills: list):
    feedback = []

    if ats_score < 40:
        feedback.append("Resume lacks key job-related keywords.")
    elif ats_score < 70:
        feedback.append("Resume partially matches job requirements.")
    else:
        feedback.append("Resume matches most ATS requirements well.")

    if missing_skills:
        feedback.append(f"Add these missing skills: {', '.join(missing_skills[:5])}")

    feedback.append("Use strong action verbs in experience section.")
    feedback.append("Quantify achievements with numbers.")
    feedback.append("Ensure resume format is ATS-friendly.")

    return feedback[:6]
