from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/ats", tags=["ATS"])


class RoadmapRequest(BaseModel):
    missing_skills: List[str]


@router.post("/roadmap")
def generate_roadmap(req: RoadmapRequest):
    if not req.missing_skills:
        raise HTTPException(status_code=400, detail="Missing skills list is empty")

    # Rule-based short roadmap per skill (no external LLM call)
    roadmap = []
    for skill in req.missing_skills[:10]:
        s = skill.capitalize()
        roadmap.append({
            "skill": skill,
            "recommendation": f"Learn the fundamentals of {s}; follow tutorials, build a small project, and practice with online exercises." 
        })

    return {"learning_roadmap": roadmap}
