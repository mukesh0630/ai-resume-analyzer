from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


class AIRequest(BaseModel):
    resume_text: str
    job_description: str
    ats_score: Optional[float] = 0
    missing_skills: List[str] = []


@router.post("/assistant")
def ai_assistant(data: AIRequest):
    """
    Generate structured resume feedback without external LLM.
    Returns: summary, strengths, weaknesses, improvement_tips
    """
    strengths = []
    weaknesses = []
    improvement_tips = []

    # Strengths based on ATS score
    if data.ats_score and data.ats_score >= 80:
        strengths.append("Excellent keyword alignment with job description")
        strengths.append("Strong ATS compatibility")
    elif data.ats_score and data.ats_score >= 60:
        strengths.append("Good skill match with job requirements")
    else:
        weaknesses.append("Low keyword alignment with target role")

    # Weaknesses based on missing skills
    if data.missing_skills:
        for skill in data.missing_skills[:5]:
            weaknesses.append(f"Missing {skill} experience")

    # Improvement tips
    if data.missing_skills:
        improvement_tips.append(f"Add the following skills: {', '.join(data.missing_skills[:3])}")
    
    improvement_tips.append("Include specific projects demonstrating your skills")
    improvement_tips.append("Quantify achievements with metrics (e.g., '30% performance improvement')")
    improvement_tips.append("Use ATS-friendly formatting: clear sections, consistent headers")
    improvement_tips.append("Add relevant certifications and technical keywords")

    summary = f"Resume shows {data.ats_score or 50}% match with job requirements. Focus on adding missing skills and quantifying achievements."

    return {
        "summary": summary,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvement_tips": improvement_tips,
    }