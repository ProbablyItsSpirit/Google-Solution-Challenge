import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate():
    # Configure Gemini API
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    # Load the model
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Generate a response
    response = model.generate_content("")
    
    print("Generating response...\n")
    print(response.text)

if __name__ == "__main__":
    generate()
