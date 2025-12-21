from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.skill_gap import find_skill_gap

router = APIRouter(prefix="/skills", tags=["Skills"])

class SkillRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/gap")
def skill_gap(data: SkillRequest):
    matched, missing = find_skill_gap(
        data.resume_text, data.job_description
    )
    return {
        "matched_skills": matched,
        "missing_skills": missing
    }
