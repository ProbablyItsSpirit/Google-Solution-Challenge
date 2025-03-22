import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper, Snackbar, Link, Container } from '@mui/material';
import { CheckCircle, Error, OpenInNew } from '@mui/icons-material';
import { testFirestoreConnection } from '../firebase';
import EnhancedFirebaseRulesGuide from './EnhancedFirebaseRulesGuide';

const FirebaseRulesGuide = ({ onClose }) => {
  const [showEnhancedGuide, setShowEnhancedGuide] = useState(false);

  // If user wants the enhanced guide with step-by-step process
  if (showEnhancedGuide) {
    return <EnhancedFirebaseRulesGuide onClose={onClose} />;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your app cannot access Firebase properly due to security rules
        </Alert>
        
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Firebase Security Rules Setup Guide
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ my: 2 }}
          onClick={() => setShowEnhancedGuide(true)}
        >
          Show Step-by-Step Guide
        </Button>
        
        <Typography paragraph>
          To use this application properly, you need to configure Firebase security rules.
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Quick Setup:
        </Typography>
        
        <Typography component="div" paragraph>
          <ol>
            <li>
              <Typography paragraph>
                Go to <Link 
                  href="https://console.firebase.google.com/project/solutionchallenge-e876c/firestore/rules" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  Firebase Firestore Rules <OpenInNew fontSize="small" sx={{ ml: 0.5 }} />
                </Link>
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                Replace the current rules and click "Publish"
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                Then go to <Link 
                  href="https://console.firebase.google.com/project/solutionchallenge-e876c/storage/rules" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center' }}
                >
                  Firebase Storage Rules <OpenInNew fontSize="small" sx={{ ml: 0.5 }} />
                </Link> and do the same
              </Typography>
            </li>
          </ol>
        </Typography>
        
        <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Important Security Note
          </Typography>
          <Typography variant="body2">
            These rules allow anyone to read and write to your database and storage. 
            This is fine for development but should be replaced with proper authentication 
            rules before deploying to production.
          </Typography>
        </Alert>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
          
          {onClose && (
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{ ml: 'auto' }}
            >
              Close Guide
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default FirebaseRulesGuide;
