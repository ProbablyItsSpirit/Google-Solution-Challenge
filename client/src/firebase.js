import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  connectAuthEmulator
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

export { auth, db, storage };
export default app;