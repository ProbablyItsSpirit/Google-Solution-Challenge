import firebase_admin
from firebase_admin import credentials, auth, firestore
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel


# Check if Firebase is already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate("backend\\firebase-admin-sdk.json")
    firebase_admin.initialize_app(cred)

# ✅ Firestore DB
db = firestore.client()

# ✅ FastAPI Router
router = APIRouter()

### 📌 User Data Model ###
class User(BaseModel):
    uid: str
    name: str
    email: str
    role: str  # "teacher" or "student"

### 📌 Google Login / Signup Endpoint ###
@router.post("/login")
async def login_user(user: User):
    """Handles Google login/signup and stores user info in Firestore."""

    try:
        # ✅ Check if user exists in Firestore
        user_ref = db.collection("users").document(user.uid)
        user_doc = user_ref.get()

        if user_doc.exists:
            return {"message": "Login successful!", "user_data": user_doc.to_dict()}

        # ✅ New user → Save to Firestore
        user_data = {
            "uid": user.uid,
            "name": user.name,
            "email": user.email,
            "role": user.role,  # "teacher" or "student"
            "created_at": firestore.SERVER_TIMESTAMP
        }
        user_ref.set(user_data)

        return {"message": "User registered!", "user_data": user_data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
