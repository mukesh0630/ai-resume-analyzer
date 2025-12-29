from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/feedback", tags=["Feedback"])

class FeedbackRequest(BaseModel):
    ats_score: float
    missing_skills: List[str]

@router.post("")
def generate_feedback(data: FeedbackRequest):
    tips = []

    if data.ats_score < 50:
        tips.append("ATS score is low, add more job-specific keywords.")
    elif data.ats_score < 75:
        tips.append("ATS score is average, minor keyword improvements needed.")
    else:
        tips.append("Good ATS score, resume is well optimized.")

    if data.missing_skills:
        tips.append(f"Consider adding skills: {', '.join(data.missing_skills[:3])}")

    return {
        "feedback": tips
    }
