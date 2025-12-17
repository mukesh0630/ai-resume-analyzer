from fastapi import APIRouter, Depends
from app.utils.auth import verify_firebase_token

router = APIRouter(prefix="/protected", tags=["Protected"])


@router.get("/profile")
def protected_route(user=Depends(verify_firebase_token)):
    return {
        "message": "You are authenticated",
        "user_id": user["uid"],
        "email": user.get("email")
    }
