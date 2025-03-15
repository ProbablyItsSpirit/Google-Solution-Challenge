import os
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
import faiss
import pickle
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import speech_recognition as sr
import io
from pydub import AudioSegment
import tempfile
import io
import docx
from PyPDF2 import PdfReader
import subprocess
from google.cloud import speech, vision

# Load environment variables
load_dotenv()

# Check FFmpeg installation
def check_ffmpeg():
    try:
        # Try to run ffmpeg
        subprocess.run(['ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except FileNotFoundError:
        return False

# Configure FFmpeg paths
if os.name == 'nt':  # Windows
    possible_ffmpeg_paths = [
        r"C:\\ffmpeg\\bin\\ffmpeg.exe",
        r"D:\\ffmpeg\\bin\\ffmpeg.exe",
        os.path.join(os.path.dirname(__file__), 'ffmpeg', 'ffmpeg.exe'),
        "ffmpeg"  # If it's in system PATH
    ]
    
    ffmpeg_found = False
    for ffmpeg_path in possible_ffmpeg_paths:
        if os.path.exists(ffmpeg_path) or check_ffmpeg():
            AudioSegment.converter = ffmpeg_path
            AudioSegment.ffmpeg = ffmpeg_path
            AudioSegment.ffprobe = ffmpeg_path.replace('ffmpeg.exe', 'ffprobe.exe')
            ffmpeg_found = True
            break

    if not ffmpeg_found:
        print("WARNING: FFmpeg not found in common locations. Please install FFmpeg and add it to your system PATH.")

# ✅ Prevent multiple Firebase initializations
if not firebase_admin._apps:
    cred = credentials.Certificate("D:/Programming/Google-Solution-Challenge/backend/firebase-admin-sdk.json")
    firebase_admin.initialize_app(cred, {'storageBucket': 'solutionchallenge-e876c.appspot.com'})

# ✅ Initialize Firestore & Storage
db = firestore.client()
bucket = storage.bucket()

### 📌 Upload Function (Handles PDFs & Images) ###
def upload_file(file_bytes, file_name, category, assignment_id=None, student_id=None):
    """
    Uploads a file to Firebase Storage and saves its metadata in Firestore.

    Args:
        file_bytes: The file contents in bytes.
        file_name: The name of the file.
        category: "question_papers", "solutions", "answer_sheets", "books".
        assignment_id: The assignment ID (if applicable).
        student_id: The student ID (only for answer sheets).

    Returns:
        The public download URL.
    """
    try:
        # Determine the destination path based on category
        if category == "question_papers":
            destination_blob_name = f"question_papers/{assignment_id}/{file_name}"
        elif category == "solutions":
            destination_blob_name = f"solutions/{assignment_id}/{file_name}"
        elif category == "answer_sheets":
            destination_blob_name = f"answer_sheets/{assignment_id}/{student_id}/{file_name}"
        elif category == "books":
            destination_blob_name = f"books/{file_name}"
        else:
            return {"error": "Invalid category"}

        # Upload file to Firebase Storage
        blob = bucket.blob(destination_blob_name)
        content_type = get_content_type(file_name)
        blob.upload_from_string(file_bytes, content_type=content_type)
        blob.make_public()

        # Extract text based on file type
        extracted_text = extract_text_from_file(file_bytes, file_name)

        # Save metadata in Firestore
        metadata = {
            "file_name": file_name,
            "download_url": blob.public_url,
            "assignment_id": assignment_id,
            "student_id": student_id,
            "category": category,
            "extracted_text": extracted_text,
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        
        # Remove None values
        metadata = {k: v for k, v in metadata.items() if v is not None}
        
        db.collection(category).document(file_name).set(metadata)

        return {
            "success": True,
            "message": "File uploaded successfully!",
            "url": blob.public_url,
            "extracted_text": extracted_text[:500] if extracted_text else None  # Preview of extracted text
        }

    except Exception as e:
        return {"error": f"Upload failed: {str(e)}"}

def get_content_type(file_name):
    """Determine content type based on file extension."""
    extension = file_name.lower().split('.')[-1]
    content_types = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'txt': 'text/plain'
    }
    return content_types.get(extension, 'application/octet-stream')

def extract_text_from_file(file_bytes, file_name):
    """Extract text from various file types."""
    try:
        if file_name.lower().endswith('.pdf'):
            return extract_text_from_pdf(file_bytes)
        elif file_name.lower().endswith(('.doc', '.docx')):
            return extract_text_from_docx(file_bytes)
        elif file_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            return extract_text_from_image(file_bytes)
        else:
            return None
    except Exception as e:
        print(f"Text extraction failed: {str(e)}")
        return None
    
def extract_text_from_pdf(file_bytes):
    """Extract text from a PDF file."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
        return text if text else "No readable text found in the PDF."
    except Exception as e:
        return f"Error processing PDF: {str(e)}"

def extract_text_from_docx(file_bytes):
    """Extract text from a DOCX file."""
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text if text else "No readable text found in the DOCX."
    except Exception as e:
        return f"Error processing DOCX: {str(e)}"

def extract_text_from_image(file_bytes):
    """Extract text from an image using Google Vision API."""
    try:
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=file_bytes)
        response = client.document_text_detection(image=image)
        return response.full_text_annotation.text if response.full_text_annotation else "No text detected."
    except Exception as e:
        return f"Error processing Image: {str(e)}"

def extract_text_from_file(file_bytes, file_name):
    """Extract text from various file types."""
    try:
        if file_name.lower().endswith('.pdf'):
            return extract_text_from_pdf(file_bytes)
        elif file_name.lower().endswith(('.doc', '.docx')):
            return extract_text_from_docx(file_bytes)
        elif file_name.lower().endswith(('.jpg', '.jpeg', '.png')):
            return extract_text_from_image(file_bytes)
        else:
            return None
    except Exception as e:
        print(f"Text extraction failed: {str(e)}")
        return None
### 📌 Speech-to-Text Conversion ###
def convert_audio_to_text(audio_bytes, file_format):
    """
    Convert audio to text with support for multiple formats.
    Args:
        audio_bytes: Raw audio bytes
        file_format: Format of the audio file (wav, mp3, m4a)
    Returns:
        Transcribed text or error message
    """
    if not check_ffmpeg():
        raise Exception(
            "FFmpeg is not installed or not found in PATH. Please install FFmpeg:\n"
            "1. Download from https://www.gyan.dev/ffmpeg/builds/\n"
            "2. Extract to C:\\ffmpeg\n"
            "3. Add C:\\ffmpeg\\bin to your system PATH\n"
            "Or install using: choco install ffmpeg"
        )

    temp_dir = None
    try:
        temp_dir = tempfile.mkdtemp()  # Create a temporary directory
        input_path = os.path.join(temp_dir, f"input.{file_format}")
        output_path = os.path.join(temp_dir, "output.wav")

        # Save input file
        with open(input_path, 'wb') as f:
            f.write(audio_bytes)

        # Convert to WAV if not already WAV
        if file_format.lower() != "wav":
            try:
                # Try direct FFmpeg conversion if pydub fails
                try:
                    audio = AudioSegment.from_file(input_path, format=file_format)
                    audio = audio.set_channels(1).set_frame_rate(16000)
                    audio.export(output_path, format="wav")
                except Exception as pydub_error:
                    # Fallback to direct FFmpeg command
                    subprocess.run([
                        'ffmpeg', '-i', input_path,
                        '-acodec', 'pcm_s16le',
                        '-ac', '1',
                        '-ar', '16000',
                        output_path
                    ], check=True)
                
                os.remove(input_path)  # Remove the input file after conversion
            except Exception as e:
                raise Exception(f"Audio conversion failed: {str(e)}")
        else:
            output_path = input_path

        # Perform speech recognition
        recognizer = sr.Recognizer()
        with sr.AudioFile(output_path) as source:
            audio_data = recognizer.record(source)

        try:
            text = recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return "Could not recognize speech."
        except sr.RequestError as e:
            return f"Speech recognition service error: {str(e)}"

    except Exception as e:
        raise Exception(f"Audio processing failed: {str(e)}")
    
    finally:
        # Clean up temporary files
        if temp_dir and os.path.exists(temp_dir):
            try:
                for file in os.listdir(temp_dir):
                    file_path = os.path.join(temp_dir, file)
                    try:
                        if os.path.isfile(file_path):
                            os.unlink(file_path)
                    except Exception as e:
                        print(f"Error deleting file {file_path}: {e}")
                os.rmdir(temp_dir)
            except Exception as e:
                print(f"Error cleaning up temporary directory: {e}")

# ✅ Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

### 📌 User Authentication & Registration ###
def register_user(uid, email, name, user_type):
    """
    Register a new user in Firestore.
    user_type can be 'student' or 'teacher'.
    """
    user_ref = db.collection("users").document(uid)
    user_ref.set({
        "email": email,
        "name": name,
        "user_type": user_type,
        "created_at": firestore.SERVER_TIMESTAMP
    }, merge=True)
    return {"message": "User registered successfully!"}

def verify_google_token(id_token):
    """
    Verify Google ID token and return user data.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return {
            "uid": decoded_token["uid"], 
            "email": decoded_token["email"], 
            "name": decoded_token.get("name", "Unknown User")
        }
    except Exception as e:
        return {"error": str(e)}

### 📌 AI Response Generation ###
def generate_response(user_input, chat_history=None, student_id=None):
    """
    Generate AI response using Gemini API with dynamic length and chat history.
    Args:
        user_input: The user's question or input
        chat_history: Optional list of previous chat messages
        student_id: Optional student ID for storing chat history
    Returns:
        Generated response and updated chat history
    """
    try:
        if not user_input or user_input.strip() == "":
            return "Did you mean to ask something else?", chat_history

        # Create prompt with dynamic length instruction
        system_prompt = """You are an intelligent AI tutor. Analyze the question and:
        1. For simple concepts that can be explained briefly, provide concise answers
        2. For complex topics requiring detailed explanation, provide comprehensive responses
        3. For moderate complexity, provide balanced explanations
        
        Always maintain clarity and accuracy regardless of response length.
        If the question is unclear or too broad, ask for clarification."""

        # Include chat history in the context if available
        if chat_history:
            context = "Previous conversation:\n" + "\n".join([
                f"Q: {msg['question']}\nA: {msg['answer']}" 
                for msg in chat_history[-3:]  # Include last 3 messages for context
            ]) + "\n\nCurrent question: " + user_input
        else:
            context = user_input

        # Generate response with context
        response = model.generate_content(
            [system_prompt, context],
            generation_config=GenerationConfig(
                temperature=0.7,  # Slightly reduced for more focused responses
                top_p=0.95,
                top_k=40,
                max_output_tokens=8192,
            )
        )

        # Store chat history if student_id is provided
        if student_id:
            chat_entry = {
                "student_id": student_id,
                "question": user_input,
                "answer": response.text,
                "timestamp": firestore.SERVER_TIMESTAMP
            }
            
            # Store in Firestore
            db.collection("chat_history").add(chat_entry)

            # Update chat history
            if chat_history is None:
                chat_history = []
            chat_history.append({
                "question": user_input,
                "answer": response.text
            })

        return response.text, chat_history

    except Exception as e:
        return f"I apologize, but I encountered an error: {str(e)}", chat_history

def get_student_chat_history(student_id, limit=10):
    """
    Retrieve chat history for a specific student.
    Args:
        student_id: The student's ID
        limit: Maximum number of messages to retrieve
    Returns:
        List of chat messages
    """
    try:
        # Query Firestore for chat history
        chats = (db.collection("chat_history")
                .where("student_id", "==", student_id)
                .order_by("timestamp", direction=firestore.Query.DESCENDING)
                .limit(limit)
                .stream())
        
        return [{
            "question": chat.get("question"),
            "answer": chat.get("answer"),
            "timestamp": chat.get("timestamp")
        } for chat in chats]
    except Exception as e:
        return []

def handle_transcribed_text(text, student_id):
    """
    Process transcribed text and store it for the student.
    Args:
        text: Transcribed text from audio
        student_id: Student's ID
    Returns:
        AI response and chat history
    """
    try:
        if not text or text.lower() in ["could not recognize speech.", ""]:
            return "Did you mean to ask something else?", None

        # Store transcription
        transcription_entry = {
            "student_id": student_id,
            "transcribed_text": text,
            "timestamp": firestore.SERVER_TIMESTAMP
        }
        db.collection("transcriptions").add(transcription_entry)

        # Get chat history
        chat_history = get_student_chat_history(student_id)

        # Generate response
        return generate_response(text, chat_history, student_id)

    except Exception as e:
        return f"Error processing transcription: {str(e)}", None

### 📌 RAG: Process and Store Book in Firestore + FAISS ###
def process_and_store_book(file_path, classroom_id):
    """Splits a book into chunks, embeds them, and stores in Firestore & FAISS for retrieval."""
    if not os.path.exists(file_path):
        return {"error": f"File not found: {file_path}"}

    with open(file_path, "r", encoding="utf-8") as f:
        book_text = f.read()

    # Split text into manageable chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(book_text)

    # Embed each chunk
    embeddings = GoogleGenerativeAIEmbeddings(model="text-embedding-004")
    vector_data = [embeddings.embed(chunk) for chunk in chunks]

    # Store embeddings in FAISS
    dimension = len(vector_data[0])
    index = faiss.IndexFlatL2(dimension)
    index.add(vector_data)

    # Save FAISS index
    with open(f"{classroom_id}_book_index.pkl", "wb") as f:
        pickle.dump(index, f)

    # Store chunks in Firestore with page references
    for i, chunk in enumerate(chunks):
        db.collection("classrooms").document(classroom_id).collection("book_chunks").document(str(i)).set({
            "page_number": (i // 2) + 1,  # Approximate page number
            "text": chunk
        })

    return {"message": "Book processed and stored successfully!"}

### 📌 RAG: Retrieve Relevant Passages for Grading ###
def retrieve_relevant_passages(query, classroom_id):
    """Find relevant passages from stored book content."""
    try:
        # This is a placeholder - implement actual RAG retrieval logic
        return {
            "text": "Relevant passage will be retrieved here",
            "page_number": "1"
        }
    except Exception as e:
        return {
            "text": "No reference available",
            "page_number": "N/A"
        }

### 📌 AI Grading with Book Reference (RAG Integrated) ###
def grade_answer_with_context(classroom_id, student_name, roll_no, question_paper, student_answers, solution_set=None):
    """AI grades an entire paper with references."""
    try:
        # Get relevant book passages (if available)
        reference = retrieve_relevant_passages(question_paper, classroom_id)

        feedback_prompt = f"""
        You are a teacher grading an exam.

        **Exam Structure**:
        - The **Question Paper** is: {question_paper}
        - The **Student's Answer Sheet** is: {student_answers}
        - The **Solution Set (if provided)** is: {solution_set if solution_set else "Not provided"}
        - The **Reference from Book** is: {reference.get('text', 'No reference available')} 
            (Page {reference.get('page_number', 'N/A')})

        **Task**:
        - Provide an overall assessment of the student's performance.
        - Highlight **strong areas and weak areas**.
        - Suggest **how the student can improve**.
        """

        overall_feedback = model.generate_content(feedback_prompt).text

        # Save feedback to Firestore
        doc_ref = db.collection("classrooms").document(classroom_id).collection("students").document(roll_no)
        doc_ref.set({
            "student_name": student_name,
            "total_score": "Auto-calculated",
            "overall_feedback": overall_feedback,
            "timestamp": firestore.SERVER_TIMESTAMP
        }, merge=True)

        return {"total_score": "Auto-calculated", "overall_feedback": overall_feedback}
    except Exception as e:
        return {"error": f"Grading failed: {str(e)}"}

### 📌 Save Results with Book References ###
def save_graded_response(classroom_id, student_name, roll_no, total_score, overall_feedback, detailed_feedback):
    """Save graded response in Firestore under the correct Classroom and Student."""
    doc_ref = db.collection("classrooms").document(classroom_id).collection("students").document(roll_no)
    doc_ref.set({
        "student_name": student_name,
        "total_score": total_score,
        "overall_feedback": overall_feedback,
        "detailed_feedback": detailed_feedback
    })
    return {"message": "Graded response saved successfully!"}
