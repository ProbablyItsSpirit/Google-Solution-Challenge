import React, { useState } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile, // Add this import
  signInWithRedirect
} from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { loginUser } from "../services/api";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  TextField, 
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Google, 
  School, 
  Person,
  AccountCircle
} from "@mui/icons-material";

const API_BASE_URL = 'http://localhost:8000';

const handleFirebaseError = (error) => {
  const errorMap = {
    'auth/user-not-found': "No account exists with this email. Please sign up.",
    'auth/wrong-password': "Incorrect password. Please try again.",
    'auth/email-already-in-use': "This email is already registered. Please login instead.",
    'auth/invalid-email': "Please enter a valid email address.",
    'auth/weak-password': "Password should be at least 6 characters.",
    'auth/network-request-failed': "Network error. Please check your connection.",
    'auth/too-many-requests': "Too many failed attempts. Please try again later.",
    'auth/popup-closed-by-user': "Google sign-in was cancelled. Please try again.",
    'auth/invalid-credential': "Invalid email or password. If you signed up with Google, please use Google Sign-in instead.",
    'auth/operation-not-allowed': "This sign-in method is not enabled. Please contact support.",
    'auth/account-exists-with-different-credential': "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
  };
  
  return errorMap[error.code] || `Authentication error: ${error.message}`;
};

const Login = () => {
  // View states: "selection", "student", "teacher", "student-signup", "teacher-signup"
  const [activeView, setActiveView] = useState("selection");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [authTab, setAuthTab] = useState(0); // 0 for login, 1 for signup
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setAuthTab(newValue);
    clearForm();
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setError("");
  };

  const handleLogin = async (e, role) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }
    
    try {
      console.log(`Attempting to login with email: ${email} as ${role}`);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful:", result.user.uid);
      
      try {
        // Register with backend
        const userData = {
          uid: result.user.uid,
          name: result.user.displayName || email.split('@')[0],
          email: result.user.email,
          role: role
        };
        
        const response = await loginUser(userData);
        console.log("Backend login response:", response);
        
        // Check if the user exists in Firestore
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role !== role) {
            setError(`This account is registered as a ${userData.role}, not as a ${role}`);
            await auth.signOut();
            setLoading(false);
            return;
          }
        } else {
          // Create the user in Firestore
          await setDoc(userRef, {
            email: result.user.email,
            name: result.user.displayName || email.split('@')[0],
            role: role,
            createdAt: new Date()
          });
        }
        
        setSnackbar({
          open: true,
          message: 'Login successful! Redirecting...',
          severity: 'success'
        });
        
        // Navigate based on role
        setTimeout(() => {
          navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
        }, 1500);
      } catch (backendError) {
        console.error("Backend verification error:", backendError);
        setError("Failed to verify with the server. Please try again.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Firebase authentication error:", error);
      setError(handleFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e, role) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!email || !password || !confirmPassword || !name) {
      setError("Please complete all fields");
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      console.log(`Attempting to signup with email: ${email} as ${role}`);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup successful:", result.user.uid);
      
      try {
        // Update profile with name - fixed to use the imported updateProfile function
        await updateProfile(result.user, {
          displayName: name
        });
        
        // Register with backend
        const userData = {
          uid: result.user.uid,
          name: name,
          email: result.user.email,
          role: role
        };
        
        console.log("Sending user data to backend:", userData);
        const response = await loginUser(userData);
        console.log("Backend registration response:", response);
        
        // Create the user in Firestore
        const userRef = doc(db, "users", result.user.uid);
        await setDoc(userRef, {
          email: result.user.email,
          name: name,
          role: role,
          createdAt: new Date()
        });
        
        setSnackbar({
          open: true,
          message: 'Account created successfully! Redirecting...',
          severity: 'success'
        });
        
        // Navigate based on role
        setTimeout(() => {
          navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
        }, 1500);
      } catch (backendError) {
        console.error("Backend registration error:", backendError);
        setError(`Failed to register with the server: ${backendError.message || "Please try again"}`);
        await auth.signOut();
      }
    } catch (error) {
      console.error("Firebase signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please login instead.");
        // Automatically switch to login tab if email already exists
        setAuthTab(0);
      } else {
        setError(handleFirebaseError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (role) => {
    setLoading(true);
    setError("");
    try {
      console.log(`Attempting Google sign in as ${role}`);
      const provider = new GoogleAuthProvider();
      
      // Add scopes for better user data
      provider.addScope('email');
      provider.addScope('profile');
      
      // Set custom parameters to handle session state issues
      provider.setCustomParameters({
        prompt: 'select_account',
        // Use browser's btoa function instead of Node.js Buffer
        state: btoa(`role=${role}&time=${Date.now()}`)
      });
      
      // Try to use signInWithRedirect on mobile devices (more reliable)
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await signInWithRedirect(auth, provider);
        return; // The page will redirect and reload
      }
      
      // Use popup for desktop
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google sign in successful:", user.uid);
      
      // Try to register with backend regardless of Firestore permissions
      try {
        // Register with backend
        const userData = {
          uid: user.uid,
          name: user.displayName || "User",
          email: user.email,
          role: role
        };
        
        const response = await loginUser(userData);
        console.log("Backend registration response:", response);
        
        // Show success message and redirect even if Firestore operations fail
        setSnackbar({
          open: true,
          message: 'Google sign-in successful! Redirecting...',
          severity: 'success'
        });
        
        // Try to test Firestore permissions, but don't block login if they fail
        try {
          await testFirestoreConnection();
        } catch (permissionError) {
          console.warn("Firebase permissions issue detected:", permissionError);
          setSnackbar({
            open: true,
            message: 'Login successful but Firebase permissions need to be updated. Some features may be limited.',
            severity: 'warning'
          });
        }
        
        // Try Firestore operations but don't block if they fail
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            try {
              await setDoc(userRef, {
                email: user.email,
                name: user.displayName || "User",
                role: role,
                createdAt: new Date()
              });
            } catch (writeError) {
              console.warn("Could not write to Firestore:", writeError);
            }
          }
        } catch (firestoreError) {
          console.warn("Firestore operations failed - continuing with limited functionality:", firestoreError);
        }
        
        // Navigation happens regardless of Firestore errors
        console.log(`Redirecting to ${role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"}`);
        setTimeout(() => {
          navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
        }, 1000);
      } catch (backendError) {
        console.error("Backend registration error:", backendError);
        setError("Failed to register with the server. Please try again.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      
      // Add specific error handling for common Google Sign-In issues
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in popup was closed before completing the process. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        setError("Sign-in popup was blocked by your browser. Please enable popups and try again.");
      } else if (error.message && error.message.includes('initial state')) {
        setError("Browser session storage issue. Please try using incognito mode or clearing cookies.");
      } else {
        setError(handleFirebaseError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderRoleSelection = () => (
    <Box sx={{ textAlign: "center" }}>
      <Typography 
        variant="h4" 
        component="div" 
        sx={{ 
          fontWeight: 700,
          color: "#1a73e8",
          mb: 1,
          letterSpacing: "-0.5px"
        }}
      >
        GradeGood
      </Typography>
      <Typography 
        variant="subtitle1" 
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Choose how you want to sign in
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 6,
              }
            }}
            onClick={() => setActiveView("student")}
          >
            <School sx={{ fontSize: 50, color: "#1a73e8", mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              I'm a Student
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 6,
              }
            }}
            onClick={() => setActiveView("teacher")}
          >
            <Person sx={{ fontSize: 50, color: "#1a73e8", mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              I'm a Teacher
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAuthForm = (role) => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: "#1a73e8",
            letterSpacing: "-0.5px" 
          }}
        >
          {role === "teacher" ? "Teacher Account" : "Student Account"}
        </Typography>
        <Button 
          variant="text" 
          onClick={() => setActiveView("selection")}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>
      </Box>

      <Tabs value={authTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
        <Tab label="Login" />
        <Tab label="Sign Up" />
      </Tabs>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={<Google />}
        onClick={() => handleGoogleSignIn(role)}
        disabled={loading}
        sx={{
          borderRadius: 3,
          py: 1.5,
          mb: 3,
          textTransform: "none",
          fontWeight: 500,
          borderColor: "#DADCE0",
          color: "#3c4043",
          "&:hover": {
            borderColor: "#DADCE0",
            backgroundColor: "#f8f9fa"
          },
        }}
      >
        {loading ? <CircularProgress size={24} /> : `${authTab === 0 ? 'Sign in' : 'Sign up'} with Google`}
      </Button>

      <Box sx={{ mt: 1, mb: 3 }}>
        <Divider>
          <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
            or {authTab === 0 ? 'sign in' : 'sign up'} with email
          </Typography>
        </Divider>
      </Box>

      {authTab === 0 ? (
        // Login Form
        <form onSubmit={(e) => handleLogin(e, role)}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#1a73e8",
              "&:hover": {
                backgroundColor: "#1557b0",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Link 
              href="#" 
              underline="none" 
              sx={{ 
                color: "#1a73e8", 
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer" 
              }}
            >
              Forgot password?
            </Link>
          </Box>
        </form>
      ) : (
        // Signup Form
        <form onSubmit={(e) => handleSignup(e, role)}>
          <TextField
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
            variant="outlined"
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#1a73e8",
              "&:hover": {
                backgroundColor: "#1557b0",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>
        </form>
      )}
    </Box>
  );

  return (
    <Box 
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Card 
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            py: 4,
            px: { xs: 3, sm: 6 },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {activeView === "selection" && renderRoleSelection()}
            {activeView === "student" && renderAuthForm("student")}
            {activeView === "teacher" && renderAuthForm("teacher")}
          </CardContent>
        </Card>
        
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} GradeGood. All rights reserved.
          </Typography>
        </Box>
      </Container>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;