from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.similarity import similarity_score

router = APIRouter(prefix="/similarity", tags=["Similarity"])

class SimilarityRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("")
def similarity(data: SimilarityRequest):
    return {
        "similarity_score": similarity_score(
            data.resume_text, data.job_description
        )
    }
