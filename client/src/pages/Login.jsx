import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  Paper
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Google, School, Person } from "@mui/icons-material";

const Login = () => {
  const [activeView, setActiveView] = useState("selection");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async (e, role) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
  
      const userRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== role) {
          setError(`This account is registered as a ${userData.role}, not as a ${role}`);
          return;
        }
      } else {
      
        await setDoc(userRef, {
          email: result.user.email,
          role: role,
          createdAt: new Date()
        });
      }
      
      
      navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password. Please try again.");
    }
  };


  const handleGoogleSignIn = async (role) => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
    
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== role) {
          setError(`This Google account is already registered as a ${userData.role}. Please use a different account.`);
          return;
        }
      } else {
        
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          role: role,
          createdAt: new Date()
        });
      }
      
      
      navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
    } catch (error) {
      console.error(error);
      setError("Google sign in failed. Please try again.");
    }
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

  
  const renderLoginForm = (role) => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: "#1a73e8",
            letterSpacing: "-0.5px" 
          }}
        >
          {role === "teacher" ? "Teacher Login" : "Student Login"}
        </Typography>
        <Button 
          variant="text" 
          onClick={() => setActiveView("selection")}
          sx={{ textTransform: "none" }}
        >
          Back
        </Button>
      </Box>

      {error && (
        <Typography 
          color="error" 
          variant="body2" 
          sx={{ mb: 2, textAlign: "center" }}
        >
          {error}
        </Typography>
      )}

      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={<Google />}
        onClick={() => handleGoogleSignIn(role)}
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
        Sign in with Google
      </Button>

      <Box sx={{ mt: 1, mb: 3 }}>
        <Divider>
          <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
            or sign in with email
          </Typography>
        </Divider>
      </Box>

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
          Sign In
        </Button>
      </form>
      
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
            {activeView === "student" && renderLoginForm("student")}
            {activeView === "teacher" && renderLoginForm("teacher")}
          </CardContent>
        </Card>
        
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} GradeGood. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;