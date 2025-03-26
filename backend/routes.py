from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException, Depends
import base64
import io
import google.generativeai as genai
from PyPDF2 import PdfReader
import docx
from flask import Flask, request, jsonify
from services import db, upload_file, convert_audio_to_text, register_user, verify_google_token, grade_answer_with_context, save_graded_response, process_chat, process_file
from google.cloud import speech, vision, firestore
import firebase_admin.auth as auth
from services import (
    generate_response, save_graded_response,
    register_user, verify_google_token,
    handle_transcribed_text, get_student_chat_history
)
from pydantic import BaseModel
import requests
from typing import Optional

router = APIRouter()
db = firestore.Client()
app = Flask(__name__)

@app.route('/upload_question', methods=['POST'])
def upload_question():
    file = request.files['file']
    if file:
        file_url = upload_file(file.filename, f"question_papers/{file.filename}")
        return jsonify({"message": "Uploaded successfully", "file_url": file_url})
    return jsonify({"error": "No file provided"}), 400

@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    student_id = data.get("student_id")
    text_answer = data.get("text_answer", "")
    audio_file = request.files.get("audio_answer")

    if audio_file:
        audio_text = convert_audio_to_text(audio_file)
    else:
        audio_text = ""

    answer_data = {
        "student_id": student_id,
        "text_answer": text_answer,
        "audio_answer": audio_text,
    }
    db.collection("classrooms").document("example_class").collection("assignments").document("example_assignment").collection("answers").add(answer_data)

    return jsonify({"message": "Answer submitted successfully"})

if __name__ == "__main__":
    app.run(debug=True)

### 📌 User Authentication Routes ###
@router.post("/login")
async def login(id_token: str = Header(...), user_type: str = Header(...)):
    """Login with Google and register user if not exists."""
    user_data = verify_google_token(id_token)
    if "error" in user_data:
        raise HTTPException(status_code=401, detail="Invalid Google Token")
    
    response = register_user(user_data["uid"], user_data["email"], user_data["name"], user_type)
    return response

@router.get("/user/{uid}")
async def get_user_data(uid: str):
    """Retrieve user data from Firestore."""
    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()
    if (user_doc.exists):
        return user_doc.to_dict()
    raise HTTPException(status_code=404, detail="User not found")

### 📌 Upload Question Paper / Assignments ###
@router.post("/upload_question")
async def upload_question(file: UploadFile = File(...)):
    """Upload Question Paper as PDF/Image."""
    file_url = upload_file(file, f"question_papers/{file.filename}")
    return {"message": "Uploaded successfully", "file_url": file_url}

### 📌 Submit Student Answer ###
@router.post("/submit_answer")
async def submit_answer(student_id: str, text_answer: str = None, audio_file: UploadFile = File(None)):
    """Submit student answer via text or speech."""
    audio_text = ""
    if (audio_file):
        audio_text = convert_audio_to_text(audio_file)

    answer_data = {
        "student_id": student_id,
        "text_answer": text_answer,
        "audio_answer": audio_text,
    }
    db.collection("answers").add(answer_data)
    return {"message": "Answer submitted successfully"}

### 📌 AI Grading ###
@router.post("/grade")
async def grade_student_paper(classroom_id: str, student_name: str, roll_no: str, question_paper: str, student_answers: str, solution_set: str = None):
    """Grades a student's paper with RAG."""
    response = grade_answer_with_context(classroom_id, student_name, roll_no, question_paper, student_answers, solution_set)
    return response

### 📌 Retrieve Student Feedback ###
@router.get("/feedback/{classroom_id}/{roll_no}")
async def get_feedback(classroom_id: str, roll_no: str):
    """Retrieve detailed feedback for a student."""
    doc_ref = db.collection("classrooms").document(classroom_id).collection("students").document(roll_no)
    doc = doc_ref.get()
    return doc.to_dict() if doc.exists else {"error": "No feedback available"}

### 📌 File Handling (Question Papers, Student Answer Sheets, Solution Sets) ###
def extract_text_from_pdf(file):
    """Extract text from a PDF file."""
    try:
        reader = PdfReader(io.BytesIO(file))
        text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
        return text if text else "No readable text found in the PDF."
    except Exception as e:
        return f"Error processing PDF: {str(e)}"

def extract_text_from_docx(file):
    """Extract text from a DOCX file."""
    try:
        doc = docx.Document(io.BytesIO(file))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text if text else "No readable text found in the DOCX."
    except Exception as e:
        return f"Error processing DOCX: {str(e)}"

def extract_text_from_image(file):
    """Extract text from an image using Google Vision API."""
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=file)

    response = client.document_text_detection(image=image)
    return response.full_text_annotation.text if response.full_text_annotation else "No text detected."

def transcribe_audio(file):
    """Convert voice input to text using Google Speech-to-Text API."""
    client = speech.SpeechClient()
    audio = speech.RecognitionAudio(content=file)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        language_code="en-US"
    )

    response = client.recognize(config=config, audio=audio)
    return response.results[0].alternatives[0].transcript if response.results else "Could not recognize speech."

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), file_type: str = Form(...)):
    """Handles file uploads for Question Papers, Student Answer Sheets, and Solution Sets."""
    contents = await file.read()

    if (file.filename.endswith(".pdf")):
        extracted_text = extract_text_from_pdf(contents)
    elif (file.filename.endswith(".docx")):
        extracted_text = extract_text_from_docx(contents)
    elif (file.filename.endswith((".png", ".jpg", ".jpeg"))):
        extracted_text = extract_text_from_image(contents)
    else:
        extracted_text = base64.b64encode(contents).decode("utf-8")  # Convert unknown files to Base64

    # Store uploaded file details in Firestore
    db.collection("uploads").document().set({
        "file_name": file.filename,
        "file_type": file_type,
        "extracted_text": extracted_text[:5000]
    })

    return {"filename": file.filename, "file_type": file_type, "extracted_text": extracted_text[:5000]}

@router.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...), student_id: str = Form(...)):
    """
    Handles audio file uploads, transcribes to text, and generates AI response.
    Supports WAV, MP3, and M4A formats.
    """
    # Get file extension and validate
    file_extension = file.filename.split(".")[-1].lower()
    if (file_extension not in ["wav", "mp3", "m4a"]):
        raise HTTPException(
            status_code=400, 
            detail="Unsupported audio format. Supported formats: WAV, MP3, M4A"
        )

    try:
        contents = await file.read()
        transcribed_text = convert_audio_to_text(contents, file_extension)
        
        # Generate response and handle chat history
        response, chat_history = handle_transcribed_text(transcribed_text, student_id)
        
        return {
            "success": True,
            "transcribed_text": transcribed_text,
            "ai_response": response,
            "file_name": file.filename,
            "format": file_extension
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing audio: {str(e)}"
        )

@router.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    """Handles image uploads and extracts handwritten/printed text."""
    contents = await file.read()
    extracted_text = extract_text_from_image(contents)
    return {"extracted_text": extracted_text}

@router.post("/classroom/{classroom_id}/add_student")
async def add_student(classroom_id: str, student_id: str, name: str, roll_no: str):
    """
    Adds a student to a classroom in Firestore.
    """
    student_ref = db.collection("classrooms").document(classroom_id).collection("students").document(student_id)
    student_data = {
        "name": name,
        "roll_no": roll_no,
        "total_score": None,
        "feedback": None
    }
    student_ref.set(student_data)

    return {"message": "Student added successfully!", "student_data": student_data}

@router.post("/classroom/{classroom_id}/upload_answer/{student_id}")
async def upload_answer_sheet(classroom_id: str, student_id: str, file: UploadFile = File(...)):
    """
    Uploads an answer sheet for a student, extracts text, and stores in Firestore.
    """
    contents = await file.read()

    # Process file (Extract text)
    if (file.filename.endswith(".pdf")):
        extracted_text = extract_text_from_pdf(contents)
    elif (file.filename.endswith(".docx")):
        extracted_text = extract_text_from_docx(contents)
    elif (file.filename.endswith((".png", ".jpg", ".jpeg"))):
        extracted_text = extract_text_from_image(contents)
    else:
        extracted_text = "Unsupported file format."

    # Save to Firestore
    db.collection("classrooms").document(classroom_id).collection("exams").document("latest_exam").collection("answer_sheets").document(student_id).set({
        "file_name": file.filename,
        "extracted_text": extracted_text
    })

    # Call grade_answer_with_context function
    grading_result = await grade_answer_with_context(file, assignment_id, student_id)

    # Save grading details in Firestore
    db.collection("classrooms").document(classroom_id).collection("exams").document("latest_exam").collection("answer_sheets").document(student_id).update({
        "grading_result": grading_result
    })

    return {"message": "Answer sheet uploaded and graded!", "file_name": file.filename, "extracted_text": extracted_text[:500], "grading_result": grading_result}

@router.get("/classroom/{classroom_id}/students")
async def get_students(classroom_id: str):
    """
    Retrieves all students in a classroom.
    """
    students_ref = db.collection("classrooms").document(classroom_id).collection("students")
    students = [doc.to_dict() for doc in students_ref.stream()]

    return {"students": students}

class ChatMessage(BaseModel):
    message: str
    student_id: str

@router.post("/chat")
async def chat(chat_message: ChatMessage):
    """Handle chat messages with context and history."""
    try:
        # Get chat history
        chat_history = get_student_chat_history(chat_message.student_id)
        
        # Generate response
        response, updated_history = generate_response(chat_message.message, chat_history, chat_message.student_id)
        
        return {
            "response": response,
            "chat_history": updated_history
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat_history/{student_id}")
async def get_chat_history(student_id: str, limit: int = 10):
    """Retrieve chat history for a student."""
    try:
        history = get_student_chat_history(student_id, limit)
        return {"chat_history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

### 📌 File Upload Routes ###
@router.post("/upload/question_paper")
async def upload_question_paper(
    file: UploadFile = File(...),
    assignment_id: str = Form(...)
):
    """
    Uploads a Question Paper.
    - Requires assignment_id
    - Supports PDF, DOC, DOCX formats
    """
    try:
        contents = await file.read()
        response = upload_file(
            file_bytes=contents,
            file_name=file.filename,
            category="question_papers",
            assignment_id=assignment_id
        )
        if ("error" in response):
            raise HTTPException(status_code=400, detail=response["error"])
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload/solution")
async def upload_solution(
    file: UploadFile = File(...),
    assignment_id: str = Form(...)
):
    """
    Uploads a Solution.
    - Requires assignment_id
    - Supports PDF, DOC, DOCX formats
    """
    try:
        contents = await file.read()
        response = upload_file(
            file_bytes=contents,
            file_name=file.filename,
            category="solutions",
            assignment_id=assignment_id
        )
        if ("error" in response):
            raise HTTPException(status_code=400, detail=response["error"])
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload/answer_sheet")
async def upload_answer_sheet(
    file: UploadFile = File(...),
    assignment_id: str = Form(...),
    student_id: str = Form(...)
):
    """
    Uploads a Student's Answer Sheet.
    - Requires assignment_id and student_id
    - Supports PDF, DOC, DOCX, JPG, PNG formats
    """
    try:
        contents = await file.read()
        response = upload_file(
            file_bytes=contents,
            file_name=file.filename,
            category="answer_sheets",
            assignment_id=assignment_id,
            student_id=student_id
        )
        if ("error" in response):
            raise HTTPException(status_code=400, detail=response["error"])

        # Call grade_answer_with_context function
        grading_result = await grade_answer_with_context(file, assignment_id, student_id)

        # Save grading details in Firestore
        db.collection("answer_sheets").document(file.filename).update({
            "grading_result": grading_result
        })

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload/book")
async def upload_book(
    file: UploadFile = File(...),
    process_for_rag: bool = Form(False)
):
    """
    Uploads a Book for RAG (Retrieval-Augmented Generation).
    - Optional: process_for_rag flag to immediately process for RAG
    - Supports PDF, DOC, DOCX formats
    """
    try:
        contents = await file.read()
        response = upload_file(
            file_bytes=contents,
            file_name=file.filename,
            category="books"
        )
        
        if ("error" in response):
            raise HTTPException(status_code=400, detail=response["error"])
        
        # If requested, process the book for RAG
        if (process_for_rag and response.get("success")):
            # You can add RAG processing here
            pass
            
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat_endpoint(message: str):
    # Call Gemini-based service logic
    return process_chat(message)

@router.post("/files")
async def upload_file(fileType: str = Form(...), file: UploadFile = File(...)):
    # Handle file upload and RAG indexing
    return process_file(file, fileType)

@router.post("/gradeAnswer")
async def grade_answer(file: UploadFile = File(...), assignment_id: str = Form(...), student_id: str = Form(...)):
    """Endpoint to trigger grading of an answer paper."""
    try:
        # Call the grading service function
        grading_result = await grade_answer_with_context(file, assignment_id, student_id)
        return grading_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
