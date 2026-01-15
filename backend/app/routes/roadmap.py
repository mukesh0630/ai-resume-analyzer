from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/ats", tags=["ATS"])


class RoadmapRequest(BaseModel):
    missing_skills: List[str]


@router.post("/roadmap")
def generate_roadmap(req: RoadmapRequest):
    # Return empty roadmap if no missing skills (don't error)
    if not req.missing_skills:
        return {"learning_roadmap": []}

    # Rule-based roadmap per skill
    roadmap = []
    for skill in req.missing_skills[:10]:
        roadmap.append({
            "skill": skill,
            "recommendation": f"Master {skill} fundamentals: study core concepts, follow tutorials, build projects, and practice with real-world exercises."
        })

    return {"learning_roadmap": roadmap}
