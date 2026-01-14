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
    # Structured, deterministic AI-like response (no external LLM)
    summary_parts = []
    strengths = []
    weaknesses = []
    recommendations = []

    if data.ats_score and data.ats_score >= 70:
        strengths.append("Good keyword alignment with the job description.")
    else:
        weaknesses.append("Insufficient job-specific keyword coverage.")

    if data.missing_skills:
        weaknesses.extend([f"Missing: {s}" for s in data.missing_skills[:6]])
        recommendations.append("Learn and add the missing skills listed above; include related projects and keywords.")

    recommendations.append("Quantify achievements (metrics, results) where possible.")
    recommendations.append("Use consistent formatting and section headers: Experience, Skills, Projects.")

    summary = "Resume review generated. Focus on matching job skills and quantifying impact."

    overall = " & ".join([
        "Good match" if data.ats_score and data.ats_score >= 70 else "Needs improvement"
    ])

    return {
        "summary": summary,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "overall_feedback": overall,
    }