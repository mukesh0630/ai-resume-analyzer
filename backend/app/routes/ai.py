from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.ai_gemini import ai_suggestions

router = APIRouter(prefix="/ai", tags=["AI"])

class AIReq(BaseModel):
    resume_text: str
    job_description: str
    missing_skills: list[str]

@router.post("/assistant")
def assistant(data: AIReq):
    return {
        "response": ai_suggestions(
            data.resume_text,
            data.job_description,
            data.missing_skills
        )
    }
