from fastapi import APIRouter
from pydantic import BaseModel
from app.services.similarity import calculate_similarity

router = APIRouter(prefix="/similarity", tags=["Similarity"])


class SimilarityRequest(BaseModel):
    resume_text: str
    job_description: str


@router.post("/score")
def similarity_score(data: SimilarityRequest):
    return calculate_similarity(
        data.resume_text,
        data.job_description
    )
