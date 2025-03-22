/**
 * This file provides instructions to properly set up Firebase security rules
 * 
 * Step 1: Go to https://console.firebase.google.com/
 * Step 2: Select your project "solutionchallenge-e876c"
 * Step 3: Navigate to Firestore Database in the left sidebar
 * Step 4: Click the "Rules" tab
 * Step 5: Copy and paste the rules below
 * Step 6: Click "Publish"
 * 
 * Then do the same for Storage:
 * Step 1: Go to "Storage" in the left sidebar
 * Step 2: Click the "Rules" tab
 * Step 3: Copy and paste the storage rules
 * Step 4: Click "Publish"
 */

// Firestore Rules
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/

// Storage Rules
/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
*/
