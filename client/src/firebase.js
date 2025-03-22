import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  connectAuthEmulator
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpKE6ljAJFKcM4CJwhpkxhCcDn4AaLwHA",
  authDomain: "solutionchallenge-e876c.firebaseapp.com",
  databaseURL: "https://solutionchallenge-e876c-default-rtdb.firebaseio.com",
  projectId: "solutionchallenge-e876c",
  storageBucket: "solutionchallenge-e876c.appspot.com",
  messagingSenderId: "927958129805",
  appId: "1:927958129805:web:5019c6e517182f35c816c4",
  measurementId: "G-D0S1TP8CJZ"
};

// Initialize Firebase - only once
let app;
let auth;
let db;
let storage;

try {
  // Check if Firebase app is already initialized
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
} catch (error) {
  if (!/already exists/.test(error.message)) {
    console.error("Firebase initialization error", error.stack);
    throw error;
  }
  // If app already exists, use the existing one
  console.log("Using existing Firebase app");
}

// Initialize Firebase services
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Try to determine if the browser supports persistent storage
const checkStorageAvailability = () => {
  try {
    // Test if localStorage is available
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return browserLocalPersistence;
  } catch (e) {
    // If localStorage fails, try sessionStorage
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      console.log("Using session persistence due to localStorage restrictions");
      return browserSessionPersistence;
    } catch (e) {
      // If both fail, use in-memory
      console.log("Using in-memory persistence due to storage restrictions");
      return inMemoryPersistence;
    }
  }
};

// Add persistence settings to keep users logged in when possible
setPersistence(auth, checkStorageAvailability())
  .then(() => console.log("Auth persistence set successfully"))
  .catch(error => {
    console.error("Auth persistence error:", error);
    console.log("Falling back to default persistence");
  });

// For development environments, you could use the emulator
if (window.location.hostname === "localhost") {
  // Uncomment the line below to use Firebase emulator
  // connectAuthEmulator(auth, "http://localhost:9099");
}

// Enhanced test function with better error handling and clearer descriptive guidance
export const testFirestoreConnection = async () => {
  try {
    // Try a simple write operation to test permissions
    const testRef = doc(db, "test_collection", "test_document");
    const timestamp = new Date();
    await setDoc(testRef, { 
      timestamp, 
      message: "Connection test",
      type: "connection_test"
    }, { merge: true });
    console.log("✅ Firestore write permission test successful");
    return true;
  } catch (error) {
    console.error("❌ Firestore permission test failed:", error.message);
    
    // More specific error handling based on error message
    if (error.message.includes("permission")) {
      console.warn(`
🔑 IMPORTANT: You need to update your Firestore security rules in the Firebase Console!

Direct links to update rules:
1. Firestore Rules: https://console.firebase.google.com/project/solutionchallenge-e876c/firestore/rules
2. Storage Rules: https://console.firebase.google.com/project/solutionchallenge-e876c/storage/rules

For both services, you should set these rules for development:
- Firestore: allow read, write: if true;
- Storage: allow read, write: if true;

After publishing the rules, refresh your browser.
      `);
    } else if (error.message.includes("network")) {
      console.warn("Network error detected - please check your internet connection.");
    } else if (error.message.includes("initialization")) {
      console.warn("Firebase initialization error - please make sure Firebase is properly configured.");
    }
    
    return false;
  }
};

// Run the test when the app initializes, but don't block the app
// Use a delay to ensure other initialization completes first
setTimeout(() => {
  testFirestoreConnection().then(result => {
    if (result) {
      console.log("Firebase permissions are set correctly!");
    } else {
      console.log("Firebase permissions need to be updated - see instructions above");
    }
  });
}, 2000);

export { auth, db, storage };
export default app;