import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
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

// Initialize Firebase servicesge services are initialized
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Add persistence settings to keep users logged in
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence set to LOCAL"))
  .catch(error => console.error("Auth persistence error:", error));

export { auth, db, storage };
export default app;