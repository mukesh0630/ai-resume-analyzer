def generate_ai_suggestions(missing_skills: list):
    suggestions = []

    for skill in missing_skills:
        suggestions.append(f"Consider learning {skill} to improve job match.")

    if not suggestions:
        suggestions.append("Your resume already matches the job well. Focus on polishing formatting.")

    return suggestions


def generate_learning_roadmap(missing_skills: list):
    roadmap = {}

    for skill in missing_skills:
        roadmap[skill] = [
            f"Learn basics of {skill}",
            f"Practice {skill} with small projects",
            f"Apply {skill} in real-world scenarios"
        ]

    return roadmap
