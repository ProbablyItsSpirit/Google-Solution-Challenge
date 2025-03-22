import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';

const ADMIN_EMAIL = "admin@gradegood.com";
const ADMIN_PASSWORD = "AdminJDC2025";

const App = () => {
  useEffect(() => {
    // Try to create admin account on app initialization
    const createAdminAccount = async () => {
      try {
        // Check if we have network connectivity first
        if (!navigator.onLine) {
          console.log("No internet connection. Skipping admin account check.");
          return;
        }
        
        // First try to sign in - if it works, the account exists
        try {
          await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          console.log("Admin account exists");
        } catch (error) {
          // If sign in fails with user-not-found, create the account
          if (error.code === 'auth/user-not-found') {
            try {
              console.log("Creating admin account...");
              const result = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
              
              // Set admin user data in Firestore
              await setDoc(doc(db, "users", result.user.uid), {
                email: ADMIN_EMAIL,
                name: "Administrator",
                role: "teacher",
                isAdmin: true,
                createdAt: new Date()
              });
              console.log("Admin account created successfully");
            } catch (createError) {
              console.error("Error creating admin account:", createError);
            }
          } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            console.log("Admin account exists but credentials may have changed");
          } else {
            console.error("Error checking admin account:", error);
          }
        }
      } catch (error) {
        console.error("Critical error in admin account setup:", error);
      } finally {
        // Sign out after checking/creating the admin account
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await signOut(auth);
          }
        } catch (signOutError) {
          console.error("Error signing out after admin check:", signOutError);
        }
      }
    };

    createAdminAccount();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;