import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  Button,
  TextField,
  LinearProgress,
  useTheme,
} from "@mui/material";
import {
  Assignment,
  Grade,
  History,
  Analytics,
  Chat,
  Dashboard,
  Logout,
  Menu as MenuIcon,
  Notifications,
  AttachFile,
  Send,
  Person,
  Message,
  Star,
  Visibility,
  CalendarToday,
  TrendingUp,
  CheckCircle,
  Cancel,
  PendingActions,
} from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock data for assignments
const mockAssignments = [
  {
    id: "1",
    title: "Math Homework 3.2",
    subject: "Mathematics",
    dueDate: "2025-03-15",
    status: "graded",
    grade: 92,
    submittedOn: "2025-03-14",
    gradedOn: "2025-03-17",
    teacherName: "Dr. Smith",
    teacherPfp: "https://placekitten.com/100/100",
    feedback: "Excellent work on the calculus problems. Work on showing your steps more clearly for integrals.",
    detailedFeedback: [
      { question: "Question 1", score: 10, maxScore: 10, feedback: "Perfect solution" },
      { question: "Question 2", score: 8, maxScore: 10, feedback: "Good approach but missed the second derivative" },
      { question: "Question 3", score: 9, maxScore: 10, feedback: "Well explained but small calculation error" },
    ]
  },
  {
    id: "2",
    title: "Literary Analysis Essay",
    subject: "English",
    dueDate: "2025-03-10",
    status: "graded",
    grade: 88,
    submittedOn: "2025-03-09",
    gradedOn: "2025-03-12",
    teacherName: "Ms. Johnson",
    teacherPfp: "https://placekitten.com/101/101",
    feedback: "Strong thesis and good examples. Work on paragraph transitions and conclusion.",
    detailedFeedback: [
      { question: "Thesis", score: 18, maxScore: 20, feedback: "Clear thesis but could be more specific" },
      { question: "Analysis", score: 35, maxScore: 40, feedback: "Good analysis with relevant examples" },
      { question: "Structure", score: 18, maxScore: 20, feedback: "Well structured but work on transitions" },
      { question: "Grammar", score: 17, maxScore: 20, feedback: "A few minor grammatical errors" },
    ]
  },
  {
    id: "3",
    title: "Chemistry Lab Report",
    subject: "Chemistry",
    dueDate: "2025-03-20",
    status: "pending",
    submittedOn: "2025-03-19",
    feedback: "",
  },
  {
    id: "4",
    title: "History Research Paper",
    subject: "History",
    dueDate: "2025-03-25",
    status: "not_submitted",
    feedback: "",
  },
];

// Mock data for performance analytics
const performanceData = [
  { month: 'Jan', grade: 85 },
  { month: 'Feb', grade: 82 },
  { month: 'Mar', grade: 88 },
  { month: 'Apr', grade: 90 },
  { month: 'May', grade: 92 },
];

const subjectPerformance = [
  { subject: 'Math', grade: 92 },
  { subject: 'English', grade: 88 },
  { subject: 'Science', grade: 90 },
  { subject: 'History', grade: 85 },
  { subject: 'Art', grade: 95 },
];

// Mock chat messages
const mockMessages = [
  { id: 1, sender: "ai", message: "Hi there! How can I help you with your studies today?", timestamp: "2025-03-19T10:30:00" },
  { id: 2, sender: "user", message: "I'm having trouble understanding derivatives in calculus", timestamp: "2025-03-19T10:31:00" },
  { id: 3, sender: "ai", message: "I'd be happy to help! A derivative measures the rate of change of a function with respect to a variable. Let's start with the basic concept: the derivative of f(x) is defined as the limit of [f(x+h) - f(x)]/h as h approaches 0. Would you like me to explain with an example?", timestamp: "2025-03-19T10:32:00" },
];

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [viewMode, setViewMode] = useState("overview");
  const [chatMessages, setChatMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // Simulate loading user data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || "Alex Johnson",
          photoURL: currentUser.photoURL || "https://placekitten.com/64/64",
        });
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedAssignment(null);
    setViewMode("overview");
  };

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    setViewMode("detail");
  };

  const handleBackToOverview = () => {
    setViewMode("overview");
    setSelectedAssignment(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        sender: "user",
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: chatMessages.length + 2,
          sender: "ai",
          message: "I'm analyzing your question. Let me provide some assistance on that topic.",
          timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/");
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "graded":
        return theme.palette.success.main;
      case "pending":
        return theme.palette.warning.main;
      case "not_submitted":
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "graded":
        return (
          <Chip 
            icon={<CheckCircle />} 
            label="Graded" 
            size="small" 
            color="success" 
            variant="outlined" 
          />
        );
      case "pending":
        return (
          <Chip 
            icon={<PendingActions />} 
            label="Pending" 
            size="small" 
            color="warning" 
            variant="outlined" 
          />
        );
      case "not_submitted":
        return (
          <Chip 
            icon={<Cancel />} 
            label="Not Submitted" 
            size="small" 
            color="error" 
            variant="outlined" 
          />
        );
      default:
        return null;
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a73e8" }}>
          GradeGood
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button selected={activeTab === 0} onClick={() => handleTabChange(null, 0)}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button selected={activeTab === 1} onClick={() => handleTabChange(null, 1)}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItem>
        <ListItem button selected={activeTab === 2} onClick={() => handleTabChange(null, 2)}>
          <ListItemIcon>
            <Grade />
          </ListItemIcon>
          <ListItemText primary="Grades" />
        </ListItem>
        <ListItem button selected={activeTab === 3} onClick={() => handleTabChange(null, 3)}>
          <ListItemIcon>
            <Analytics />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
        <ListItem button selected={activeTab === 4} onClick={() => handleTabChange(null, 4)}>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="AI Assistant" />
        </ListItem>
        <ListItem button selected={activeTab === 5} onClick={() => handleTabChange(null, 5)}>
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText primary="History" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  const renderAssignmentDetail = () => {
    if (!selectedAssignment) return null;

    return (
      <Box>
        <Button 
          startIcon={<Visibility />} 
          variant="text" 
          onClick={handleBackToOverview}
          sx={{ mb: 2 }}
        >
          Back to All Assignments
        </Button>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={selectedAssignment.title}
            subheader={`${selectedAssignment.subject} • Due: ${new Date(selectedAssignment.dueDate).toLocaleDateString()}`}
            action={getStatusChip(selectedAssignment.status)}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Submitted on: {new Date(selectedAssignment.submittedOn).toLocaleDateString()}
                </Typography>
                {selectedAssignment.status === "graded" && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Graded on: {new Date(selectedAssignment.gradedOn).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Avatar src={selectedAssignment.teacherPfp} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2">
                        Graded by: {selectedAssignment.teacherName}
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>
              {selectedAssignment.status === "graded" && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                      {selectedAssignment.grade}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ ml: 1 }}>
                      / 100
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            {selectedAssignment.status === "graded" && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Teacher Feedback
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedAssignment.feedback}
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Detailed Breakdown
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Feedback</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedAssignment.detailedFeedback?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.question}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {item.score}/{item.maxScore}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={(item.score / item.maxScore) * 100} 
                                sx={{ width: 100, borderRadius: 5 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>{item.feedback}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderDashboardTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Recent Assignments" />
          <CardContent>
            <List>
              {mockAssignments.slice(0, 3).map((assignment) => (
                <ListItem 
                  key={assignment.id} 
                  button 
                  onClick={() => handleAssignmentSelect(assignment)}
                  sx={{ 
                    borderLeft: `4px solid ${getStatusColor(assignment.status)}`,
                    mb: 1,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" }
                  }}
                >
                  <ListItemText 
                    primary={assignment.title} 
                    secondary={`${assignment.subject} • Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                  />
                  {getStatusChip(assignment.status)}
                </ListItem>
              ))}
            </List>
            <Button 
              variant="text" 
              color="primary" 
              onClick={() => handleTabChange(null, 1)}
              sx={{ mt: 1 }}
            >
              View All
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Performance Overview" />
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="grade" stroke="#1a73e8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            <Button 
              variant="text" 
              color="primary" 
              onClick={() => handleTabChange(null, 3)}
              sx={{ mt: 1 }}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Upcoming Deadlines" />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Assignment</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAssignments
                    .filter(a => a.status !== "graded")
                    .map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{assignment.subject}</TableCell>
                        <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusChip(assignment.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAssignmentsTab = () => {
    if (viewMode === "detail") {
      return renderAssignmentDetail();
    }
    
    return (
      <Box>
        <Card>
          <CardHeader title="All Assignments" />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.subject}</TableCell>
                      <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusChip(assignment.status)}</TableCell>
                      <TableCell>
                        {assignment.status === "graded" ? `${assignment.grade}/100` : "-"}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleAssignmentSelect(assignment)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderGradesTab = () => (
    <Box>
      <Card>
        <CardHeader title="Grade Summary" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Date Graded</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAssignments
                  .filter(a => a.status === "graded")
                  .map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.subject}</TableCell>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.grade}/100</TableCell>
                      <TableCell>{new Date(assignment.gradedOn).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar src={assignment.teacherPfp} sx={{ width: 24, height: 24, mr: 1 }} />
                          {assignment.teacherName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleAssignmentSelect(assignment)}
                        >
                          View Feedback
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Performance Trend" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="grade" stroke="#1a73e8" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Subject Performance" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Bar dataKey="grade" fill="#1a73e8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Improvement Areas" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Mathematics" 
                  secondary="Improved by 7% in the last month"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary="Literature Analysis" 
                  secondary="Requires improvement in thesis development"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Science" 
                  secondary="Consistent performance across assignments"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAIAssistantTab = () => (
    <Box sx={{ height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
      <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <CardHeader title="AI Study Assistant" />
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2, p: 2 }}>
            {chatMessages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "75%",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: msg.sender === "user" ? "#1a73e8" : "#f1f3f4",
                    color: msg.sender === "user" ? "white" : "text.primary",
                  }}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: "flex", p: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask me anything about your studies..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSendMessage}
              endIcon={<Send />}
            >
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderHistoryTab = () => (
    <Box>
      <Card>
        <CardHeader title="Assignment History" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Submitted On</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAssignments
                  .filter(a => a.status === "graded")
                  .map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.subject}</TableCell>
                      <TableCell>{new Date(assignment.submittedOn).toLocaleDateString()}</TableCell>
                      <TableCell>{assignment.grade}/100</TableCell>
                      <TableCell>{assignment.teacherName}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          onClick={() => handleAssignmentSelect(assignment)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return renderDashboardTab();
      case 1:
        return renderAssignmentsTab();
      case 2:
        return renderGradesTab();
      case 3:
        return renderAnalyticsTab();
      case 4:
        return renderAIAssistantTab();
      case 5:
        return renderHistoryTab();
      default:
        return renderDashboardTab();
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#fff",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={user.photoURL} sx={{ width: 35, height: 35, mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {user.displayName}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <Message />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
      
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "none", md: "block" },
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - 250px)` } }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {activeTab === 0 && "Dashboard"}
              {activeTab === 1 && "Assignments"}
              {activeTab === 2 && "Grades"}
              {activeTab === 3 && "Analytics"}
              {activeTab === 4 && "AI Assistant"}
              {activeTab === 5 && "History"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default StudentDashboard;