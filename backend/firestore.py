import firebase_admin
from firebase_admin import credentials, firestore

# ✅ Initialize Firebase Admin (Ensure correct JSON path)
if not firebase_admin._apps:
    cred = credentials.Certificate("D:/Programming/Google-Solution-Challenge/backend/firebase-admin-sdk.json")  # Ensure correct path
    firebase_admin.initialize_app(cred)

# ✅ Initialize Firestore
db = firestore.client()

### 📌 Function to Delete All Collections in Firestore ###
def delete_collection(collection_ref, batch_size=50):
    """Deletes all documents inside a collection."""
    docs = collection_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        print(f"Deleting: {doc.id}")
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return delete_collection(collection_ref, batch_size)

# ✅ Delete existing collections
collections_to_delete = ["users", "classrooms", "assignments", "answers", "books", "uploads"]
for collection in collections_to_delete:
    print(f"🗑️ Deleting collection: {collection} ...")
    delete_collection(db.collection(collection))

print("✅ Firestore cleared! Now recreating structure...")

### 📌 Firestore Structure Recreation ###
def initialize_firestore():
    """Recreates Firestore structure with sample data."""

    # ✅ Users Collection (Students & Teachers)
    users_ref = db.collection("users")
    users_ref.document("student_1").set({
        "name": "Alice Johnson",
        "email": "alice@student.com",
        "user_type": "student"
    })
    users_ref.document("teacher_1").set({
        "name": "Mr. Smith",
        "email": "smith@teacher.com",
        "user_type": "teacher"
    })

    # ✅ Classrooms Collection
    classroom_ref = db.collection("classrooms").document("classroom_101")
    classroom_ref.set({
        "classroom_name": "AI & Machine Learning",
        "teacher_id": "teacher_1"
    })

    # ✅ Assignments Collection
    assignment_ref = classroom_ref.collection("assignments").document("assignment_1")
    assignment_ref.set({
        "title": "Neural Networks Basics",
        "description": "Solve the following questions on Neural Networks."
    })

    # ✅ Answers Collection (Students' Submissions)
    answers_ref = assignment_ref.collection("answers").document("student_1")
    answers_ref.set({
        "student_id": "student_1",
        "text_answer": "A neural network is a set of layers...",
        "audio_answer": "N/A",
        "file_upload": "N/A"
    })

    # ✅ Books Collection (For RAG)
    book_ref = db.collection("books").document("AI_Basics")
    book_ref.set({
        "title": "Introduction to AI",
        "author": "John AI",
        "total_pages": 250
    })

    print("✅ Firestore structure recreated successfully!")

# ✅ Reinitialize Firestore Structure
initialize_firestore()
