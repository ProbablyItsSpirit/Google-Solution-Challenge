import os
import json
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from routes import router
import firebase_admin
from firebase_admin import credentials
from auth import router as auth_router

# Create FastAPI app
app = FastAPI()

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
    raise ValueError("❌ GEMINI_API_KEY is missing. Please check your .env file.")

# Initialize Firebase Admin only once
if not firebase_admin._apps:
    try:
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic home endpoint
@app.get("/")
async def home():
    return {"status": "API is running"}

# Generate text endpoint
@app.post("/generate", response_model=AIResponse)
async def generate_text(input_data: UserInput):
    """Generate AI response using Gemini API."""
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
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)