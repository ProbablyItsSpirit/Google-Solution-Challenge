import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
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
  Link
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Invalid email or password. Please try again.");
    }
  };

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
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center",
                mb: 4
              }}
            >
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
                sx={{ mb: 3 }}
              >
                Sign in to continue
              </Typography>
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

            <form onSubmit={handleLogin}>
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

            <Box sx={{ mt: 3, mb: 2 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  or
                </Typography>
              </Divider>
            </Box>

            
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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