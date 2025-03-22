/**
 * Utility script to help update Firebase security rules
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyCpKE6ljAJFKcM4CJwhpkxhCcDn4AaLwHA",
  authDomain: "solutionchallenge-e876c.firebaseapp.com",
  projectId: "solutionchallenge-e876c",
  storageBucket: "solutionchallenge-e876c.appspot.com",
  messagingSenderId: "927958129805",
  appId: "1:927958129805:web:5019c6e517182f35c816c4",
  measurementId: "G-D0S1TP8CJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "rules-helper");
const db = getFirestore(app);

// Test connection function
export const testFirestoreConnection = async () => {
  try {
    // Try writing to a test document
    const testRef = doc(db, "test_permissions", "test_document");
    await setDoc(testRef, {
      timestamp: new Date(),
      test: "Permissions test",
      success: true
    });
    console.log("✅ Firestore write permission test successful!");
    return true;
  } catch (error) {
    console.error("❌ Firestore permission test failed:", error.message);
    if (error.message.includes("permission")) {
      printRulesGuide();
    }
    return false;
  }
};

// Print guidance to console
export const printRulesGuide = () => {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                   FIREBASE SECURITY RULES GUIDE                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Your app cannot access Firebase properly due to security rules issues.

Follow these steps to fix:

1. Go to Firebase Firestore Rules:
   https://console.firebase.google.com/project/solutionchallenge-e876c/firestore/rules

2. Replace the current rules with:
   ---------------------------------------------------
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ---------------------------------------------------

3. Click "Publish"

4. Then update Firebase Storage Rules:
   https://console.firebase.google.com/project/solutionchallenge-e876c/storage/rules

5. Replace with:
   ---------------------------------------------------
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ---------------------------------------------------

6. Click "Publish"

7. Refresh your application

SECURITY NOTE: These rules allow public access to your Firebase resources.
They are suitable for development but should be replaced with proper
authentication rules before deploying to production.
  `);
};

// Auto-run test on load
testFirestoreConnection().then(result => {
  if (result) {
    console.log("Firebase permissions are correctly configured! 🎉");
  }
});

export default { testFirestoreConnection, printRulesGuide };
