import os
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from routes import router
import firebase_admin
from firebase_admin import credentials
from auth import router as auth_router

app = FastAPI()

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY is missing. Please check your .env file.")

# Initialize Firebase Admin only once
if not firebase_admin._apps:
    cred = credentials.Certificate("backend/firebase-admin-sdk.json")
    firebase_admin.initialize_app(cred)

# Initialize Gemini model
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-exp")

# Enable CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routes
app.include_router(router)
app.include_router(auth_router, prefix="/auth")

class UserInput(BaseModel):
    prompt: str

class AIResponse(BaseModel):
    response: str

@app.get("/")
async def home():
    return {"status": "API is running"}

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
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)