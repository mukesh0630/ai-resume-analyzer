from fastapi import APIRouter
from pydantic import BaseModel
from app.services.skill_gap import detect_skill_gap

router = APIRouter(prefix="/skills", tags=["Skill Gap"])


class SkillGapRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/gap")
def skill_gap(data: SkillGapRequest):
    return detect_skill_gap(
        data.resume_text,
        data.job_description
    )
