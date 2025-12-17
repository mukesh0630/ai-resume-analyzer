from fastapi import HTTPException, Header
from firebase_admin import auth as firebase_auth


def verify_firebase_token(authorization: str = Header(...)):
    """
    Expects header:
    Authorization: Bearer <firebase_id_token>
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
