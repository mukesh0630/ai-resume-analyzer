from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Any
from backend.app.firebase_config import db
from firebase_admin import firestore
from datetime import datetime


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
    try:
        user_id = req.user_id

        record = {
            "ats_score": float(req.ats_score),
            "matched_skills": req.matched_skills,
            "missing_skills": req.missing_skills,
            "roadmap": req.roadmap,
            "feedback": req.feedback,
            "created_at": firestore.SERVER_TIMESTAMP,
        }

        db.collection("users").document(user_id).collection("history").add(record)
        return {"status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}")
def get_history(user_id: str):
    try:
        col = db.collection("users").document(user_id).collection("history")
        docs = col.order_by("created_at", direction="DESCENDING").stream()

        history = []
        for doc in docs:
            d = doc.to_dict()
            # ensure fields exist and created_at is consistent
            if isinstance(d.get("created_at"), dict) and d["created_at"].get("seconds"):
                # Firestore server timestamp placeholder; leave as-is
                pass
            history.append(d)

        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
