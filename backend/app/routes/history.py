from fastapi import APIRouter
from datetime import datetime
from backend.app.firebase_config import db
from backend.app.services.feedback import generate_feedback

router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.post("/save")
def save_history(data: dict):
    user_id = data["user_id"]

    ats_score = data.get("ats_score", 0)
    missing_skills = data.get("missing_skills", [])

    feedback = generate_feedback(ats_score, missing_skills)

    record = {
        "ats_score": ats_score,
        "missing_skills": missing_skills,
        "feedback": feedback,
        "created_at": datetime.utcnow().isoformat()
    }

    db.collection("users") \
      .document(user_id) \
      .collection("history") \
      .add(record)

    return {"status": "saved"}


@router.get("/{user_id}")
def get_history(user_id: str):
    docs = (
        db.collection("users")
        .document(user_id)
        .collection("history")
        .stream()
    )

    history = [doc.to_dict() for doc in docs]
    return {"history": history}
