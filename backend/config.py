from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "GradeGood AI"
    VERSION: str = "1.0.0"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "https://gradegood.vercel.app"  # Production URL
    ]
    
    # Firebase Configuration
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-admin-sdk.json")
    
    # Security Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # API Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    # File Upload Configuration
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {
        "pdf", "doc", "docx", "txt", 
        "jpg", "jpeg", "png"
    }
    UPLOAD_FOLDER: str = "uploads"
    
    # AI Model Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    MODEL_MAX_TOKENS: int = 2048
    
    class Config:
        case_sensitive = True
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to avoid loading .env file multiple times
    """
    return Settings()

# Common configurations
settings = get_settings()

# API Metadata for Documentation
API_METADATA = {
    "title": settings.PROJECT_NAME,
    "description": """
    GradeGood AI API - Automated grading and assessment system.
    
    Features:
    * Automated paper grading
    * PDF analysis
    * Student performance tracking
    * AI-powered feedback generation
    """,
    "version": settings.VERSION,
    "contact": {
        "name": "Your Name",
        "email": "your.email@example.com",
        "url": "https://github.com/yourusername/Google-Solution-Challenge"
    },
    "license_info": {
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
}