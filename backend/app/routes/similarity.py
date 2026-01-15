from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/similarity", tags=["Similarity"])


@router.post("")
def similarity_disabled():
    # Legacy endpoint removed — return 410 Gone to indicate deprecation
    raise HTTPException(status_code=410, detail="Similarity endpoint removed")
