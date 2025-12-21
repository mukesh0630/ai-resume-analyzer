import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

def get_firebase_cred():
    # 1️⃣ Try ENV (production)
    env_cred = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    if env_cred:
        return credentials.Certificate(json.loads(env_cred))

    # 2️⃣ Fallback to local file (development)
    base_dir = os.path.dirname(os.path.dirname(__file__))
    file_path = os.path.join(base_dir, "firebase", "serviceAccountKey.json")

    if not os.path.exists(file_path):
        raise RuntimeError("Firebase credentials not found")

    return credentials.Certificate(file_path)

cred = get_firebase_cred()

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()
