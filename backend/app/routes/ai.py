from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.ai_suggestions import generate_ai_suggestions, generate_learning_roadmap

router = APIRouter(prefix="/ai", tags=["AI Suggestions"])


class AIRequest(BaseModel):
    missing_skills: List[str]


@router.post("/suggestions")
def ai_suggestions(data: AIRequest):
    return {
        "resume_suggestions": generate_ai_suggestions(data.missing_skills),
        "learning_roadmap": generate_learning_roadmap(data.missing_skills)
    }
