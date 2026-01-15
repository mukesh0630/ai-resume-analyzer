"""
Centralized Firestore database initialization and client.
Use this module to get a db instance for Firestore operations.
"""
import json
import os

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    FIREBASE_AVAILABLE = True
except Exception as e:
    firebase_admin = None
    credentials = None
    firestore = None
    FIREBASE_AVAILABLE = False


def _get_firebase_credentials():
    """
    Retrieve Firebase credentials from environment or local file.
    """
    if not FIREBASE_AVAILABLE:
        raise RuntimeError("firebase_admin is not installed")
    
    # Try environment variable first (production)
    env_cred = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
    if env_cred:
        try:
            return credentials.Certificate(json.loads(env_cred))
        except Exception as e:
            raise RuntimeError(f"Failed to parse FIREBASE_SERVICE_ACCOUNT env var: {e}")

    # Fallback to local file (development)
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    file_path = os.path.join(base_dir, "backend", "firebase", "serviceAccountKey.json")

    if not os.path.exists(file_path):
        raise RuntimeError(f"Firebase credentials not found at {file_path}")

    return credentials.Certificate(file_path)


def _initialize_firebase():
    """
    Initialize Firebase app and return Firestore client.
    Returns None if Firebase is not available.
    """
    if not FIREBASE_AVAILABLE:
        return None
    
    try:
        if not firebase_admin._apps:
            cred = _get_firebase_credentials()
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        # Log but don't crash — Firestore is optional
        print(f"Warning: Firebase initialization failed: {e}")
        return None


# Initialize the global db instance
db = _initialize_firebase()
