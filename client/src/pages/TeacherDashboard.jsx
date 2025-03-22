import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Paper, CircularProgress, Grid } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user) {
          navigate('/');
          return;
        }
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [auth, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Teacher Dashboard
        </Typography>
        
        {userData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Welcome, {userData.name}!</Typography>
            <Typography variant="body1" color="text.secondary">
              Role: {userData.role}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {userData.email}
            </Typography>
          </Box>
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