import os
import json
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from routes import router as api_router
import firebase_admin
from firebase_admin import credentials
from auth import router as auth_router
import uvicorn
from config import HOST, PORT

<<<<<<< Updated upstream
app = FastAPI(title="GradeGood AI API", version="1.0.0")
=======
# Create FastAPI app
app = FastAPI()
>>>>>>> Stashed changes

# Model definitions
class ChatMessage(BaseModel):
    content: str
    role: str

class ChatRequest(BaseModel):
    message: str
    userId: Optional[str] = None
    files: Optional[List[str]] = []
    history: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    text: str

class UserInput(BaseModel):
    prompt: str

class AIResponse(BaseModel):
    response: str

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️ GEMINI_API_KEY not found in .env file. Some features may not work.")

# Fix Firebase credential path - ensure it works on both Windows & Unix systems
if not firebase_admin._apps:
    try:
<<<<<<< Updated upstream
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
=======
        # Make sure path is correct relative to where the app is started from
        cred = credentials.Certificate("backend/firebase-admin-sdk.json")
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Firebase initialization error: {str(e)}")

# Initialize Gemini model
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
>>>>>>> Stashed changes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< Updated upstream
# Include API Routes - IMPORTANT FIX: Include all routes from the router directly
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(api_router)  # Register without prefix to allow proper route handling

class UserInput(BaseModel):
    prompt: str

class AIResponse(BaseModel):
    response: str

=======
# Basic home endpoint
>>>>>>> Stashed changes
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

# Generate text endpoint
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

# Chat endpoint for TeacherDashboard
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process chat messages using Gemini API."""
    try:
        # Format history for Gemini
        formatted_history = []
        if request.history:
            for msg in request.history:
                formatted_history.append({
                    "role": "user" if msg.get("role") == "user" else "model",
                    "parts": [{"text": msg.get("content", "")}]
                })
        
        # Start chat session
        chat = model.start_chat(history=formatted_history if formatted_history else None)
        
        # Add files context if files were included
        files_context = ""
        if request.files and len(request.files) > 0:
            files_context = f"The teacher has uploaded these files: {', '.join(request.files)}. "
        
        # Create prompt with teaching assistant context
        prompt = f"You are GradeGood AI, a teaching assistant helping teachers grade papers, create teaching materials, and analyze student performance. {files_context}{request.message}"
        
        print(f"Sending prompt to Gemini: {prompt[:100]}...")
        response = chat.send_message(prompt)
        
        print(f"Received response from Gemini: {response.text[:100]}...")
        return {"text": response.text}
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")

# Include other routers AFTER defining the app endpoints
app.include_router(router)
app.include_router(auth_router, prefix="/auth")

# Server startup code
if __name__ == "__main__":
<<<<<<< Updated upstream
    print(f"Starting server on port {PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
=======
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
>>>>>>> Stashed changes
