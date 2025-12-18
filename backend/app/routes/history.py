from fastapi import APIRouter, Depends
from backend.app.utils.auth import verify_firebase_token
from backend.app.services.history_service import get_user_history

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/")
def fetch_history(user=Depends(verify_firebase_token)):
    return get_user_history(user["uid"])
