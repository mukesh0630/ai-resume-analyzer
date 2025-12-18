from datetime import datetime
from backend.app.firebase_config import db


def save_analysis_history(user_id: str, data: dict):
    doc = {
        "user_id": user_id,
        "analysis": data,
        "created_at": datetime.utcnow()
    }
    db.collection("resume_history").add(doc)


def get_user_history(user_id: str):
    docs = (
        db.collection("resume_history")
        .where("user_id", "==", user_id)
        .order_by("created_at", direction="DESCENDING")
        .stream()
    )

    return [
        {**doc.to_dict(), "id": doc.id}
        for doc in docs
    ]
