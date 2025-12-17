from fastapi import APIRouter
from pydantic import BaseModel
from app.services.section_feedback import analyze_resume_sections

router = APIRouter(prefix="/feedback", tags=["Feedback"])


class FeedbackRequest(BaseModel):
    resume_text: str


@router.post("/sections")
def section_feedback(data: FeedbackRequest):
    return analyze_resume_sections(data.resume_text)
