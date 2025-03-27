import os
import google.generativeai as genai
from dotenv import load_dotenv
from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Firestore client
db = firestore.Client()

# Initialize Gemini model
try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    print("✅ Gemini API configured")
except Exception as e:
    print(f"❌ Error configuring Gemini API: {str(e)}")
    model = None

# Initialize Firebase
def init_firebase():
    if not firebase_admin._apps:
        try:
            # Use os.path.join for cross-platform compatibility
            cred_path = os.path.join(os.path.dirname(__file__), "firebase-admin-sdk.json")
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"✅ Firebase initialized successfully with credentials at: {cred_path}")
        except Exception as e:
            print(f"❌ Error initializing Firebase: {str(e)}")
            raise
    return firebase_admin
