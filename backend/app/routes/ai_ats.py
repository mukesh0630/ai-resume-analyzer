from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.services.ai_ats_engine import analyze_resume_with_ai

router = APIRouter(
    prefix="/ats",
    tags=["ATS"]
)

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/analyze")
def analyze_ats(data: ATSRequest):
    try:
        result = analyze_resume_with_ai(
            data.resume_text,
            data.job_description
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
