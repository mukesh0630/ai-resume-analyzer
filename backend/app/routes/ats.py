from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.ats_scoring import calculate_ats_score

router = APIRouter(prefix="/ats", tags=["ATS"])


class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/score")
def ats_score(data: ATSRequest):
    return calculate_ats_score(
        data.resume_text,
        data.job_description
    )
