import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db, testFirestoreConnection } from '../firebase';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermissions, setHasPermissions] = useState(true);
  const [securityRulesUpdated, setSecurityRulesUpdated] = useState(false);
  const [permissionsCheckAttempts, setPermissionsCheckAttempts] = useState(0);

  // Function to determine role based on fallback methods
  const determineFallbackRole = (user) => {
    // Simple heuristic - education emails are likely students
    if (user?.email?.endsWith('.edu')) {
      return 'student';
    }
    
    // Check for certain keywords in email that might indicate teacher
    const teacherKeywords = ['teach', 'prof', 'faculty', 'staff', 'instructor'];
    const emailLower = user?.email?.toLowerCase() || '';
    if (teacherKeywords.some(keyword => emailLower.includes(keyword))) {
      return 'teacher';
    }
    
    // Default to teacher for now (application seems more teacher-focused)
    return 'teacher';
  };

  // This function handles Firestore failures gracefully
  const safeFirestoreOperation = async (operation, fallback) => {
    try {
      return await operation();
    } catch (error) {
      console.warn("Firestore operation failed:", error.message);
      setHasPermissions(false);
      return fallback;
    }
  };

  useEffect(() => {
    const checkFirebasePermissions = async () => {
      try {
        // Incrementally back off permission checks to reduce console spam
        if (permissionsCheckAttempts > 3) {
          console.log(`Skipping permission check #${permissionsCheckAttempts} to reduce rate`);
          return false;
        }
        
        setPermissionsCheckAttempts(prev => prev + 1);
        
        // Test if we have write permissions
        const hasPermissions = await testFirestoreConnection();
        setHasPermissions(hasPermissions);
        setSecurityRulesUpdated(hasPermissions);
        
        // If permissions fixed, reset counter
        if (hasPermissions) {
          setPermissionsCheckAttempts(0);
        }
        
        return hasPermissions;
      } catch (error) {
        console.error("Failed to test Firebase permissions:", error);
        setHasPermissions(false);
        return false;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        
        if (user) {
          // Always set the Firebase user
          setCurrentUser(user);
          
          // Check if we have proper Firestore permissions
          const hasDatabaseAccess = await checkFirebasePermissions();
          
          if (!hasDatabaseAccess) {
            console.log("Firebase permissions not set correctly - using fallback data");
            
            // Determine role based on email patterns as fallback
            const fallbackRole = determineFallbackRole(user);
            
            // Set fallback data when permissions aren't available
            setUserRole(fallbackRole);
            setUserDetails({
              uid: user.uid,
              email: user.email,
              name: user.displayName || user.email?.split('@')[0] || "User",
              role: fallbackRole,
              permissionError: true,
              createdVia: 'fallback',
              createdAt: new Date()
            });
          } else {
            // Try to get user data from Firestore
            const userDoc = await safeFirestoreOperation(
              async () => await getDoc(doc(db, "users", user.uid)),
              null
            );
            
            if (userDoc && userDoc.exists()) {
              const userData = userDoc.data();
              setUserRole(userData.role);
              setUserDetails({...userData, lastLogin: new Date()});
              
              // Update last login time
              await safeFirestoreOperation(
                async () => await setDoc(doc(db, "users", user.uid), {
                  lastLogin: new Date()
                }, { merge: true }),
                null
              );
            } else {
              // Create new user document if it doesn't exist
              const newUserData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || "User",
                role: determineFallbackRole(user),
                createdAt: new Date(),
                lastLogin: new Date()
              };
              
              await safeFirestoreOperation(
                async () => await setDoc(doc(db, "users", user.uid), newUserData),
                null
              );
              
              setUserRole(newUserData.role);
              setUserDetails(newUserData);
            }
          }
        } else {
          // User is signed out
          setCurrentUser(null);
          setUserRole(null);
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Check periodically for security rules updates with improved error handling
  useEffect(() => {
    if (!hasPermissions && currentUser) {
      // Calculate backoff interval: 3s, 6s, 12s, 24s, capped at 30s
      const backoffInterval = Math.min(3000 * Math.pow(2, permissionsCheckAttempts - 1), 30000);
      
      console.log(`Setting permission check interval: ${backoffInterval}ms (attempt #${permissionsCheckAttempts})`);
      
      const checkInterval = setInterval(async () => {
        try {
          const result = await testFirestoreConnection();
          if (result) {
            console.log("✅ Firebase permissions now detected as working!");
            setHasPermissions(true);
            setSecurityRulesUpdated(true);
            setPermissionsCheckAttempts(0);
            clearInterval(checkInterval);
            
            // Try to refresh user data if permissions are now available
            try {
              const userRef = doc(db, "users", currentUser.uid);
              const userDoc = await getDoc(userRef);
              
              if (userDoc.exists()) {
                console.log("✅ User data successfully loaded from Firestore");
                setUserDetails(userDoc.data());
                setUserRole(userDoc.data().role);
              }
            } catch (error) {
              console.warn("Still having issues with Firestore after rules update:", error);
            }
          } else {
            // Only log on certain attempts to reduce console spam
            if (permissionsCheckAttempts % 3 === 0) {
              console.log(`Firebase permissions check attempt #${permissionsCheckAttempts} - still not working`);
            }
          }
        } catch (error) {
          console.error(`Firebase permissions check error:`, error);
        }
      }, backoffInterval);
      
      return () => clearInterval(checkInterval);
    }
  }, [hasPermissions, currentUser, permissionsCheckAttempts]);

  const value = {
    currentUser,
    userRole,
    userDetails,
    loading,
    error,
    hasPermissions,
    securityRulesUpdated,
    isAuthenticated: !!currentUser,
    permissionCheckCount: permissionsCheckAttempts
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
