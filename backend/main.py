import os
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from routes import router as api_router
import firebase_admin
from firebase_admin import credentials
from auth import router as auth_router
import uvicorn
from config import HOST, PORT

app = FastAPI(title="GradeGood AI API", version="1.0.0")

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️ GEMINI_API_KEY not found in .env file. Some features may not work.")

# Fix Firebase credential path - ensure it works on both Windows & Unix systems
if not firebase_admin._apps:
    try:
        # Use os.path.join for cross-platform compatibility
        import os
        cred_path = os.path.join(os.path.dirname(__file__), "firebase-admin-sdk.json")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print(f"✅ Firebase initialized successfully with credentials at: {cred_path}")
    except Exception as e:
        print(f"❌ Error initializing Firebase: {str(e)}")
        raise

# Initialize Gemini model
try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    print("✅ Gemini API configured")
except Exception as e:
    print(f"❌ Error configuring Gemini API: {str(e)}")
    model = None

# Fix CORS - Allow requests from the React app's domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # React app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routes - IMPORTANT FIX: Include all routes from the router directly
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(api_router)  # Register without prefix to allow proper route handling

class UserInput(BaseModel):
    prompt: str

class AIResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"message": "Welcome to GradeGood AI API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "firebase": "initialized" if firebase_admin._apps else "not initialized",
        "gemini": "configured" if model else "not configured"
    }

@app.post("/generate", response_model=AIResponse)
async def generate_text(input_data: UserInput):
    """Generate AI response using Gemini API."""
    if not model:
        raise HTTPException(status_code=503, detail="Gemini API not configured")
        
    try:
        response = model.generate_content(
            input_data.prompt,
            generation_config=GenerationConfig(
                temperature=1,
                top_p=0.95,
                top_k=40,
                max_output_tokens=8192,
            ),
        )
        return AIResponse(response=response.text)
    except Exception as e:
        print(f"❌ Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

if __name__ == "__main__":
    print(f"Starting server on port {PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)