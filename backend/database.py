import firebase_admin
from firebase_admin import credentials, firestore, storage
import os

# Get the absolute path to the credentials file
current_dir = os.path.dirname(os.path.abspath(__file__))
credentials_path = os.path.join(current_dir, "firebase-admin-sdk.json")

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate(credentials_path)
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'solutionchallenge-e876c.appspot.com'
    })

# Initialize Firestore and Storage
db = firestore.client()
bucket = storage.bucket()

# Function to check if collections exist and create them if needed
def initialize_collections():
    """Ensure all required collections exist in Firestore"""
    required_collections = [
        "users", "classrooms", "question_papers", 
        "solutions", "answer_sheets", "books", 
        "uploads", "chat_history", "transcriptions"
    ]
    
    # Check each collection for at least one document
    for collection in required_collections:
        docs = db.collection(collection).limit(1).stream()
        if not any(docs):
            print(f"Creating empty initial document in {collection}")
            db.collection(collection).document("_config").set({
                "initialized": True,
                "created_at": firestore.SERVER_TIMESTAMP
            })
    
    print("Database collections initialized.")
