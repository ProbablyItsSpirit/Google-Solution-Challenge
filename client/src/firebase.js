import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpKE6ljAJFKcM4CJwhpkxhCcDn4AaLwHA",
  authDomain: "solutionchallenge-e876c.firebaseapp.com",
  databaseURL: "https://solutionchallenge-e876c-default-rtdb.firebaseio.com",
  projectId: "solutionchallenge-e876c",
  storageBucket: "solutionchallenge-e876c.firebasestorage.app",
  messagingSenderId: "927958129805",
  appId: "1:927958129805:web:5019c6e517182f35c816c4",
  measurementId: "G-D0S1TP8CJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;