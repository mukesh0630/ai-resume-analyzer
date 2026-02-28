from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Any
from backend.app.firebase_config import db
from datetime import datetime

try:
    from firebase_admin import firestore
except Exception:
    firestore = None


router = APIRouter(
    prefix="/history",
    tags=["History"]
)


class HistorySaveRequest(BaseModel):
    user_id: str
    ats_score: float = Field(...)
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    roadmap: List[Any] = []
    feedback: List[str] = []


@router.post("/save")
def save_history(req: HistorySaveRequest):
    """Save analysis result to Firestore history."""
    try:
        if db is None:
            raise HTTPException(
                status_code=503,
                detail="Firebase is not configured on the server"
            )

        user_id = req.user_id
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")

        record = {
            "user_id": user_id,
            "ats_score": float(req.ats_score),
            "matched_skills": req.matched_skills,
            "missing_skills": req.missing_skills,
            "roadmap": req.roadmap,
            "feedback": req.feedback,
            "created_at": datetime.utcnow().isoformat(),
        }

        # Save to Firestore under users/{user_id}/history
        db.collection("users").document(user_id).collection("history").add(record)
        return {"status": "saved"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save history: {str(e)}")


@router.get("/{user_id}")
def get_history(user_id: str):
    """Fetch analysis history for a user from Firestore."""
    try:
        if db is None:
            raise HTTPException(
                status_code=503,
                detail="Firebase is not configured on the server"
            )

        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")

        # Get all documents in the user's history subcollection
        col = db.collection("users").document(user_id).collection("history")
        if firestore:
            docs = col.order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        else:
            docs = col.stream()

        history = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            history.append(data)

        return {"history": history}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")