from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from backend.app.services.feedback import generate_feedback

router = APIRouter(prefix="/feedback", tags=["Feedback"])

class FeedbackRequest(BaseModel):
    ats_score: float
    missing_skills: List[str]

@router.post("")
def feedback(data: FeedbackRequest):
    return {
        "feedback": generate_feedback(
            data.ats_score, data.missing_skills
        )
    }
