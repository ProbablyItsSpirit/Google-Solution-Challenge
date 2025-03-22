import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Alert, Paper, Card, CardContent, 
  Snackbar, Link, Backdrop, CircularProgress, Divider,
  Stepper, Step, StepLabel, StepContent, Container
} from '@mui/material';
import { CheckCircle, Error, OpenInNew, ContentCopy, Refresh, SecurityOutlined } from '@mui/icons-material';
import { testFirestoreConnection } from '../firebase';

// Rules content for easy copying
const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

const STORAGE_RULES = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`;

const EnhancedFirebaseRulesGuide = ({ onClose, onRulesFixed }) => {
  const [checking, setChecking] = useState(false);
  const [rulesUpdated, setRulesUpdated] = useState(false);
  const [errorChecking, setErrorChecking] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [checkCount, setCheckCount] = useState(0);

  // Auto-check rules status periodically
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!rulesUpdated && checkCount < 20) { // Only check 20 times maximum
        try {
          const result = await testFirestoreConnection();
          if (result) {
            setRulesUpdated(true);
            setSnackbarMessage('Firebase permissions are now working! 🎉');
            setSnackbarOpen(true);
            clearInterval(intervalId);
            if (onRulesFixed) onRulesFixed();
          }
          setCheckCount(prev => prev + 1);
        } catch (error) {
          console.error("Auto-check error:", error);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 6000); // Check every 6 seconds
    
    return () => clearInterval(intervalId);
  }, [rulesUpdated, checkCount, onRulesFixed]);

  const checkRulesUpdated = async () => {
    setChecking(true);
    setErrorChecking(false);
    
    try {
      const result = await testFirestoreConnection();
      setRulesUpdated(result);
      
      if (result) {
        setSnackbarMessage('Firebase permissions are now working! You can continue using the application.');
        setSnackbarOpen(true);
        if (onRulesFixed) onRulesFixed();
      } else {
        setSnackbarMessage('Rules still not updated. Please follow the steps carefully and try again.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error checking Firebase rules:", error);
      setErrorChecking(true);
      setSnackbarMessage('Error checking rules: ' + error.message);
      setSnackbarOpen(true);
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage('Copied to clipboard!');
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setSnackbarMessage('Failed to copy - please select and copy manually');
        setSnackbarOpen(true);
      });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Define steps for the guide
  const steps = [
    {
      label: 'Update Firestore Rules',
      content: (
        <>
          <Typography paragraph fontWeight={500} sx={{ mt: 1 }}>
            Go to <Link 
              href="https://console.firebase.google.com/project/solutionchallenge-e876c/firestore/rules" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ display: 'inline-flex', alignItems: 'center' }}
              color="primary"
            >
              Firebase Firestore Rules <OpenInNew fontSize="small" sx={{ ml: 0.5 }} />
            </Link>
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 2, bgcolor: '#f8f9fa', borderColor: '#e0e0e0' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Replace the current rules with:
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: '#f5f7fa', 
                borderRadius: 1, 
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                position: 'relative',
                mb: 1,
                border: '1px solid #e0e0e0'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '180px' }}>{FIRESTORE_RULES}</pre>
                <Button 
                  variant="contained" 
                  size="small"
                  color="primary" 
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(FIRESTORE_RULES)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  Copy
                </Button>
              </Box>
              <Typography paragraph sx={{ mt: 2 }}>
                When done, click the <strong>Publish</strong> button in the Firebase console
              </Typography>
            </CardContent>
          </Card>
        </>
      )
    },
    {
      label: 'Update Storage Rules',
      content: (
        <>
          <Typography paragraph fontWeight={500} sx={{ mt: 1 }}>
            Go to <Link 
              href="https://console.firebase.google.com/project/solutionchallenge-e876c/storage/rules" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ display: 'inline-flex', alignItems: 'center' }}
              color="primary"
            >
              Firebase Storage Rules <OpenInNew fontSize="small" sx={{ ml: 0.5 }} />
            </Link>
          </Typography>
          
          <Card variant="outlined" sx={{ mb: 2, bgcolor: '#f8f9fa', borderColor: '#e0e0e0' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Replace the current rules with:
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: '#f5f7fa', 
                borderRadius: 1, 
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                position: 'relative',
                mb: 1,
                border: '1px solid #e0e0e0'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '180px' }}>{STORAGE_RULES}</pre>
                <Button 
                  variant="contained" 
                  size="small"
                  color="primary" 
                  startIcon={<ContentCopy />}
                  onClick={() => copyToClipboard(STORAGE_RULES)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  Copy
                </Button>
              </Box>
              <Typography paragraph sx={{ mt: 2 }}>
                When done, click the <strong>Publish</strong> button in the Firebase console
              </Typography>
            </CardContent>
          </Card>
        </>
      )
    },
    {
      label: 'Verify Rules Update',
      content: (
        <>
          <Typography paragraph>
            After updating both sets of rules, click the button below to verify if your app can now connect to Firebase.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={checkRulesUpdated}
              disabled={checking || rulesUpdated}
              startIcon={checking ? <CircularProgress size={20} color="inherit" /> : rulesUpdated ? <CheckCircle /> : <Refresh />}
              size="large"
            >
              {checking ? 'Checking...' : rulesUpdated ? 'Rules Updated Successfully' : 'Check Rules Status'}
            </Button>
          </Box>
          
          {rulesUpdated && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body1">
                Firebase permissions are now working properly! You can continue using the application.
              </Typography>
            </Alert>
          )}
          
          {checking && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body1">
                Checking permissions... This may take a few seconds.
              </Typography>
            </Alert>
          )}
          
          {!rulesUpdated && !checking && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body1">
                If you've updated the rules, click the button above to verify. Sometimes it takes a minute for rule changes to propagate.
              </Typography>
            </Alert>
          )}
        </>
      )
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Alert 
          severity={rulesUpdated ? "success" : "warning"} 
          variant="filled"
          sx={{ mb: 3 }}
          icon={rulesUpdated ? <CheckCircle /> : <Error />}
        >
          <Typography variant="subtitle1">
            {rulesUpdated 
              ? "Firebase security rules have been updated successfully!" 
              : "Your app cannot access Firebase properly due to security rules"}
          </Typography>
        </Alert>
        
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Firebase Security Rules Setup Guide
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel><Typography fontWeight={500}>{step.label}</Typography></StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 1, display: 'flex', gap: 1 }}>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      Back
                    </Button>
                    {index < steps.length - 1 && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ ml: 1 }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 3, bgcolor: '#fafafa', p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" fontWeight={500} sx={{ display: 'flex', alignItems: 'center' }}>
            <SecurityOutlined sx={{ mr: 1, color: 'text.secondary' }} />
            How it works
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Firebase requires proper security rules to allow your application to read and write data. 
            For development, we're setting open rules to make it easier to build your app.
          </Typography>
        </Box>
        
        <Alert severity="error" variant="outlined" sx={{ mt: 3, mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Important Security Note
          </Typography>
          <Typography variant="body2">
            These rules allow anyone to read and write to your database and storage. 
            This is fine for development but should be replaced with proper authentication 
            rules before deploying to production.
          </Typography>
        </Alert>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          {rulesUpdated && (
            <Button 
              variant="contained" 
              color="success" 
              onClick={() => window.location.reload()}
              startIcon={<Refresh />}
              size="large"
            >
              Reload Application
            </Button>
          )}
          
          {onClose && (
            <Button 
              variant="outlined" 
              onClick={onClose}
              size="large"
            >
              Close Guide
            </Button>
          )}
        </Box>
      </Paper>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={checking}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Checking Firebase permissions...</Typography>
        </Box>
      </Backdrop>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default EnhancedFirebaseRulesGuide;
