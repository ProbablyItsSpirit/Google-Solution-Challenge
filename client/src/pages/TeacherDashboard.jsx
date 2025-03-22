import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Paper, CircularProgress, Grid, Alert, Link } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, testFirestoreConnection } from '../firebase';
import { useNavigate } from 'react-router-dom';
import FirebaseRulesGuide from '../components/FirebaseRulesGuide';

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("TeacherDashboard: Fetching user data...");
        const user = auth.currentUser;
        
        if (!user) {
          console.log("TeacherDashboard: No current user found, redirecting to login");
          navigate('/');
          return;
        }
        
        console.log(`TeacherDashboard: User authenticated, UID: ${user.uid.substring(0, 5)}...`);
        
        // Test Firestore permissions first
        const hasPermissions = await testFirestoreConnection();
        
        if (!hasPermissions) {
          console.log("TeacherDashboard: Firestore permission test failed");
          setUserData({
            name: user.displayName || user.email?.split('@')[0] || "Teacher",
            role: "teacher",
            email: user.email,
            permissionError: true
          });
          setLoading(false);
          return;
        }
        
        // If offline, use a default user object
        if (isOffline) {
          console.log("TeacherDashboard: Working in offline mode");
          setUserData({
            name: user.displayName || user.email?.split('@')[0] || "Teacher",
            role: "teacher",
            email: user.email,
            isOfflineData: true
          });
          setLoading(false);
          return;
        }
        
        try {
          const userRef = doc(db, 'users', user.uid);
          console.log(`TeacherDashboard: Fetching document from path: ${userRef.path}`);
          
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            console.log("TeacherDashboard: User document exists in Firestore");
            setUserData(userDoc.data());
          } else {
            console.log("TeacherDashboard: User document doesn't exist in Firestore");
            // Create fallback user data from auth object
            setUserData({
              name: user.displayName || user.email?.split('@')[0] || "Teacher",
              role: "teacher",
              email: user.email,
              isNewUser: true
            });
          }
        } catch (firestoreError) {
          console.error("TeacherDashboard: Firestore error:", firestoreError);
          
          // Handle offline errors gracefully
          if (firestoreError.message?.includes("offline")) {
            setUserData({
              name: user.displayName || user.email?.split('@')[0] || "Teacher", 
              role: "teacher",
              email: user.email,
              isOfflineData: true
            });
          } else {
            setError(`Database error: ${firestoreError.message}`);
          }
        }
      } catch (error) {
        console.error('TeacherDashboard: Error fetching user data:', error);
        setError(`Error: ${error.message}`);
      } finally {
        console.log("TeacherDashboard: Setting loading to false");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [auth, navigate, isOffline]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (showPermissionGuide) {
    return (
      <FirebaseRulesGuide onClose={() => setShowPermissionGuide(false)} />
    );
  }

  if (userData?.permissionError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Firebase Security Rules Error
          </Typography>
          
          <Alert severity="error" sx={{ mb: 3 }}>
            Missing or insufficient permissions to access Firestore
          </Alert>
          
          <Typography variant="h6" gutterBottom>
            Please update your Firestore security rules:
          </Typography>
          
          <ol>
            <li>
              <Typography paragraph>
                Go to <Link 
                  href="https://console.firebase.google.com/project/solutionchallenge-e876c/firestore/rules" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Firebase Firestore Rules
                </Link>
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                Replace the current rules with:
              </Typography>
              <Paper sx={{ bgcolor: '#f5f5f5', p: 2, my: 2, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                rules_version = '2';<br/>
                service cloud.firestore {'{'}<br/>
                &nbsp;&nbsp;match /databases/{'{'}database{'}'}/documents {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;match /{'{'}document=**{'}'} {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read, write: if true;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br/>
                &nbsp;&nbsp;{'}'}<br/>
                {'}'}
              </Paper>
            </li>
            <li>
              <Typography paragraph>
                Click "Publish"
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                Then go to <Link 
                  href="https://console.firebase.google.com/project/solutionchallenge-e876c/storage/rules" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Firebase Storage Rules
                </Link> and do the same for Storage rules
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                After updating the rules, refresh this page
              </Typography>
            </li>
          </ol>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="body1" color="text.secondary">
          Loading teacher dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {isOffline && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are currently offline. Some features may be limited until you reconnect.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Teacher Dashboard
        </Typography>
        
        {userData ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Welcome, {userData.name}!</Typography>
            <Typography variant="body1" color="text.secondary">
              Role: {userData.role}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {userData.email}
            </Typography>
            {userData.isOfflineData && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                Working with offline data. Some information may not be up to date.
              </Typography>
            )}
          </Box>
        ) : (
          <Typography color="error">
            User data not available. Please try refreshing the page.
          </Typography>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Classes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                No classes created yet. Create your first class to get started.
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleLogout}
          sx={{ mt: 4 }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default TeacherDashboard;