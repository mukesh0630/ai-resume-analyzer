from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.skill_gap import calculate_skill_gap

router = APIRouter(
    prefix="/ats",
    tags=["ATS"]
)

# -----------------------------
# Request Schema
# -----------------------------
class SkillGapRequest(BaseModel):
    resume_text: str
    job_description: str


# -----------------------------
# Skill Gap Endpoint
# -----------------------------
@router.post("/skills")
def skill_gap(data: SkillGapRequest):
    """
    Compares resume text with job description
    and returns matched & missing skills
    """

    result = calculate_skill_gap(
        resume_text=data.resume_text,
        job_text=data.job_description
    )

    return {
        "matched_skills": result["matched_skills"],
        "missing_skills": result["missing_skills"]
    }
