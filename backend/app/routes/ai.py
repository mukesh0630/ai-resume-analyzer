from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import os

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

class AIRequest(BaseModel):
    resume_text: str
    job_description: str
    ats_score: Optional[float] = 0
    missing_skills: List[str] = []

@router.post("/assistant")
def ai_assistant(data: AIRequest):
    # ⚠️ TEMP: rule-based short insights (NO external AI dependency)
    insights = []

    if data.ats_score < 50:
        insights.append("Your resume lacks several key job-related skills.")
    else:
        insights.append("Your resume aligns reasonably well with the job role.")

    if data.missing_skills:
        insights.append(
            "Focus on learning: " + ", ".join(data.missing_skills[:5])
        )

    insights.append("Add measurable achievements to improve ATS ranking.")
    insights.append("Use exact keywords from the job description.")
    insights.append("Keep resume length within 1–2 pages.")

    return {
        "ai_response": "\n".join(f"- {i}" for i in insights)
    }
