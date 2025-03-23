import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Typography, Button, Container, Paper, CircularProgress, Grid, Alert, Link,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, IconButton,
  AppBar, Toolbar, Tab, Tabs, Avatar, Badge, Card, CardContent, CardHeader, Collapse,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db, testFirestoreConnection } from '../firebase';
import { useNavigate } from 'react-router-dom';
import FirebaseRulesGuide from '../components/FirebaseRulesGuide';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  InsertDriveFile as FileIcon,
  Description as DescriptionIcon,
  QuestionAnswer as QuestionIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

// Styled components
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[200],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  display: 'flex',
  flexDirection: 'column',
}));

const FileChip = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  fontSize: '0.75rem',
}));

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // Mock data for classroom analytics
  const recentGrades = [
    { id: 1, class: "Physics 101", assignment: "Midterm Exam", avgScore: 78, submissions: 28, total: 30, date: "2023-10-15" },
    { id: 2, class: "Chemistry 202", assignment: "Lab Report", avgScore: 85, submissions: 25, total: 25, date: "2023-10-12" },
    { id: 3, class: "Biology 303", assignment: "Final Project", avgScore: 92, submissions: 22, total: 24, date: "2023-10-08" },
    { id: 4, class: "Math 404", assignment: "Quiz 3", avgScore: 72, submissions: 26, total: 28, date: "2023-10-05" },
  ];

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

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        try {
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
        } catch (permissionError) {
          console.error("TeacherDashboard: Permission test error:", permissionError);
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

          // Mock chat history
          setChatHistory([
            { id: 1, title: "Grading assistance", time: "10:30 AM" },
            { id: 2, title: "Lesson plan creation", time: "Yesterday" },
            { id: 3, title: "Student performance analysis", time: "2 days ago" },
            { id: 4, title: "Quiz generation", time: "1 week ago" },
          ]);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleChatHistoryToggle = () => {
    setChatHistoryOpen(!chatHistoryOpen);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim() === '' && uploadedFiles.length === 0) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: chatInput,
      role: 'user',
      files: uploadedFiles
    };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setUploadedFiles([]);

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: getAIResponse(chatInput, uploadedFiles),
        role: 'assistant'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input, files) => {
    if (files.length > 0) {
      if (files.some(f => f.name.toLowerCase().includes('question'))) {
        return "I've analyzed the question paper. It contains 5 multiple choice questions and 3 essay questions. Would you like me to suggest a grading rubric?";
      } else if (files.some(f => f.name.toLowerCase().includes('answer'))) {
        return "I've reviewed the answer sheets. Based on my analysis, the average score is 78%. Would you like a detailed breakdown of common mistakes?";
      } else if (files.some(f => f.name.toLowerCase().includes('solution'))) {
        return "I've processed the solution paper. It's well-structured and covers all the key points. Would you like me to compare it with student answers?";
      }
      return "I've received your files and processed them. How would you like me to help with these documents?";
    }

    if (input.toLowerCase().includes('grade') || input.toLowerCase().includes('assess')) {
      return "I can help you grade papers. Upload student submissions, and I'll analyze them based on your rubric or solution key.";
    } else if (input.toLowerCase().includes('quiz') || input.toLowerCase().includes('test')) {
      return "I can help you create quizzes or tests. What subject and difficulty level are you looking for?";
    } else if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('performance')) {
      return "I can analyze student performance data. Upload assessment results, and I'll provide insights on strengths, weaknesses, and improvement areas.";
    }
    
    return "I'm your AI teaching assistant. I can help with grading, creating educational content, analyzing student performance, and more. How can I assist you today?";
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.toLowerCase().includes('question')) return <QuestionIcon fontSize="small" />;
    if (fileName.toLowerCase().includes('answer')) return <AssignmentIcon fontSize="small" />;
    if (fileName.toLowerCase().includes('solution')) return <DescriptionIcon fontSize="small" />;
    return <FileIcon fontSize="small" />;
  };

  const getFileType = (fileName) => {
    if (fileName.toLowerCase().includes('question')) return 'Question Paper';
    if (fileName.toLowerCase().includes('answer')) return 'Answer Paper';
    if (fileName.toLowerCase().includes('solution')) return 'Solution Paper';
    return 'Document';
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUpIcon fontSize="small" style={{ color: 'green' }} />;
    if (current < previous) return <TrendingDownIcon fontSize="small" style={{ color: 'red' }} />;
    return <RemoveIcon fontSize="small" style={{ color: 'gray' }} />;
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
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Teacher Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body1" sx={{ mr: 2 }}>
            {userData?.name}
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {userData?.name?.charAt(0) || 'T'}
          </Avatar>
        </Toolbar>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          sx={{ bgcolor: 'primary.dark' }}
        >
          <Tab label="AI Assistant" />
          <Tab label="Classroom" />
        </Tabs>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        {/* Chat History Section */}
        <List>
          <ListItem button onClick={handleChatHistoryToggle}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary="Chat History" />
            {chatHistoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={chatHistoryOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {chatHistory.map((chat) => (
                <ListItem button key={chat.id} sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <Badge color="primary" variant="dot">
                      <MessageIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText 
                    primary={chat.title} 
                    secondary={chat.time}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
        
        <Divider />
        
        {/* Recent Uploads */}
        <List>
          <ListItem>
            <ListItemText primary="Recent Uploads" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FileIcon />
            </ListItemIcon>
            <ListItemText primary="Physics Midterm" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <FileIcon />
            </ListItemIcon>
            <ListItemText primary="Chemistry Quiz" />
          </ListItem>
        </List>
        
        <Divider />
        
        {/* Profile & Logout */}
        <List sx={{ marginTop: 'auto' }}>
          <ListItem button>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Main open={drawerOpen}>
        <DrawerHeader />
        
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

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {/* AI Assistant Tab */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              AI Teaching Assistant
            </Typography>
            
            {/* Chat Messages */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2, display: 'flex', flexDirection: 'column' }}>
              {messages.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', p: 3 }}>
                  <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    How can I help you today?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                    Ask me questions about teaching, grading, or upload papers for analysis.
                  </Typography>
                  <Grid container spacing={2} sx={{ maxWidth: 500 }}>
                    <Grid item xs={12} sm={4}>
                      <Button variant="outlined" fullWidth>Create a quiz</Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button variant="outlined" fullWidth>Grade papers</Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button variant="outlined" fullWidth>Analyze results</Button>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                messages.map((message) => (
                  <Box 
                    key={message.id} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    {message.role !== 'user' && (
                      <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>AI</Avatar>
                    )}
                    <MessageBubble isUser={message.role === 'user'}>
                      {message.content}
                      {message.files && message.files.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          {message.files.map((file, index) => (
                            <FileChip key={index}>
                              {getFileIcon(file.name)}
                              <Typography variant="caption" sx={{ ml: 0.5, mr: 0.5 }}>
                                {file.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ({getFileType(file.name)})
                              </Typography>
                            </FileChip>
                          ))}
                        </Box>
                      )}
                    </MessageBubble>
                    {message.role === 'user' && (
                      <Avatar sx={{ ml: 1 }}>{userData?.name?.charAt(0) || 'U'}</Avatar>
                    )}
                  </Box>
                ))
              )}
              {isTyping && (
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>AI</Avatar>
                  <MessageBubble isUser={false}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">Thinking...</Typography>
                    </Box>
                  </MessageBubble>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
            
            {/* Chat Input */}
            <Box component="form" onSubmit={handleChatSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
              {uploadedFiles.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
                  {uploadedFiles.map((file, index) => (
                    <FileChip key={index}>
                      {getFileIcon(file.name)}
                      <Typography variant="caption" sx={{ ml: 0.5, mr: 0.5 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({getFileType(file.name)})
                      </Typography>
                    </FileChip>
                  ))}
                </Box>
              )}
              <Box sx={{ display: 'flex' }}>
                <Tooltip title="Upload question papers, answer sheets, or solution papers">
                  <IconButton 
                    color="primary" 
                    component="label"
                    sx={{ mr: 1 }}
                  >
                    <AttachFileIcon />
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </IconButton>
                </Tooltip>
                <TextField
                  fullWidth
                  placeholder="Ask me anything or upload papers for analysis..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  sx={{ ml: 1 }}
                  disabled={isTyping && !chatInput && uploadedFiles.length === 0}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Classroom Tab */}
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h4">107</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Across 4 classes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Average Grade
                  </Typography>
                  <Typography variant="h4">B (82%)</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon(82, 79)}
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 0.5 }}>
                      +3% from last semester
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Assignments
                  </Typography>
                  <Typography variant="h4">24</Typography>
                  <Typography variant="body2" color="textSecondary">
                    12 graded, 12 pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Grades Table */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Grades
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Assignment</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell align="right">Avg. Score</TableCell>
                        <TableCell align="right">Submissions</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentGrades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>{grade.assignment}</TableCell>
                          <TableCell>{grade.class}</TableCell>
                          <TableCell align="right">
                            <ChipComponent 
                              label={`${grade.avgScore}%`}
                              color={grade.avgScore >= 80 ? "success" : grade.avgScore >= 70 ? "warning" : "error"}
                            />
                          </TableCell>
                          <TableCell align="right">{grade.submissions}/{grade.total}</TableCell>
                          <TableCell align="right">
                            <IconButton size="small">
                              <DescriptionIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                              <AssessmentIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Analytics Charts */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    [Grade Distribution Chart - A: 8, B: 12, C: 6, D: 3, F: 1]
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Performance Trend
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    [Performance Trend Chart - Quiz 1: 75%, Quiz 2: 78%, Midterm: 72%, Quiz 3: 80%, Final: 85%]
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Main>
    </Box>
  );
};

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Message Icon Component
function MessageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="24"
      height="24"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ChipComponent for Material UI compatibility
function ChipComponent({ label, color }) {
  const getColor = () => {
    switch (color) {
      case 'success': return { bgcolor: '#4caf50', color: 'white' };
      case 'warning': return { bgcolor: '#ff9800', color: 'white' };
      case 'error': return { bgcolor: '#f44336', color: 'white' };
      default: return { bgcolor: '#e0e0e0', color: 'black' };
    }
  };

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        padding: '0px 8px',
        height: '24px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        ...getColor()
      }}
    >
      {label}
    </Box>
  );
}

export default TeacherDashboard;