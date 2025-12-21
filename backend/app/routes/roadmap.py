from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import google.generativeai as genai
import os

router = APIRouter(prefix="/roadmap", tags=["Learning Roadmap"])

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("models/gemini-2.5-flash")


class RoadmapRequest(BaseModel):
    missing_skills: List[str]


@router.post("")
def generate_roadmap(req: RoadmapRequest):
    if not req.missing_skills:
        raise HTTPException(status_code=400, detail="Missing skills list is empty")

    prompt = f"""
Create a beginner-friendly, step-by-step learning roadmap
for the following missing skills:

{", ".join(req.missing_skills)}

Include:
- What to learn
- Practice ideas
- Mini projects

Rules:
- MAXIMUM 5–7 bullet points
- Each bullet = one learning step
- Beginner friendly
- No paragraphs
"""

    response = model.generate_content(prompt)

    return {
        "roadmap": response.text
    }
