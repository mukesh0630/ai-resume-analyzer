from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.similarity import calculate_similarity

router = APIRouter(prefix="/similarity", tags=["Similarity"])

class SimilarityRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("")
def similarity(data: SimilarityRequest):
    return {
        "similarity_score": calculate_similarity(
            data.resume_text, data.job_description
        )
    }
