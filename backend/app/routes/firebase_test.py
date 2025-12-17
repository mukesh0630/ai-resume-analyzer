from fastapi import APIRouter
from app.firebase_config import db

router = APIRouter(prefix="/firebase", tags=["Firebase Test"])


@router.get("/test")
def firebase_test():
    doc_ref = db.collection("test").document("ping")
    doc_ref.set({"status": "connected"})
    return {"message": "Firebase connected successfully"}
