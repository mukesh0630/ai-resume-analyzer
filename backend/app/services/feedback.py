def feedback(missing_skills):
    tips = []
    if "docker" in missing_skills:
        tips.append("Add Docker projects")
    if "aws" in missing_skills:
        tips.append("Mention AWS deployment experience")
    if "react" in missing_skills:
        tips.append("Improve React component descriptions")

    return tips[:3]
