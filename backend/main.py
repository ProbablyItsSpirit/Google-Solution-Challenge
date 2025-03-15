import os
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from routes import router  # FIXED: Import the router
import firebase_admin
from firebase_admin import credentials
from auth import router as auth_router  # ✅ Import auth router


app = FastAPI()

# ✅ Add Authentication Routes
app.include_router(auth_router, prefix="/auth")

@app.get("/")
async def root():
    return {"message": "API is running"}
# Load environment variables
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
    firebase_admin.initialize_app(cred)

from routes import router
from fastapi import FastAPI
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY is missing. Please check your .env file.")

# Initialize Gemini model
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-exp")

# FastAPI app
app = FastAPI(title="AI Teacher Assistant API")

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

# Request model
class UserInput(BaseModel):
    prompt: str

# Response model
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
            )
        )
        return AIResponse(response=response.text)

    except Exception as e:
        print(f"❌ Error generating response: {str(e)}")  # Log error
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
