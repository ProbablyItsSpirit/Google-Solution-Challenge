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
  Chip,
  Button,
  TextField,
  LinearProgress,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Assignment,
  Grade,
  History,
  Chat,
  Dashboard,
  Logout,
  Menu as MenuIcon,
  Notifications,
  Send,
  CheckCircle,
  Cancel,
  PendingActions,
  School,
  CloudUpload,
  ArrowBack,
} from "@mui/icons-material";

// Mock data for classes
const mockClasses = [
  {
    id: "1",
    name: "Mathematics",
    teacher: "Dr. Smith",
    teacherPfp: "https://placekitten.com/100/100",
    code: "MATH101",
  },
  {
    id: "2",
    name: "English Literature",
    teacher: "Ms. Johnson",
    teacherPfp: "https://placekitten.com/101/101",
    code: "ENG201",
  },
  {
    id: "3",
    name: "Chemistry",
    teacher: "Mr. Rodriguez",
    teacherPfp: "https://placekitten.com/102/102",
    code: "CHEM101",
  },
  {
    id: "4",
    name: "History",
    teacher: "Dr. Patel",
    teacherPfp: "https://placekitten.com/103/103",
    code: "HIST202",
  },
];

// Mock data for assignments
const mockAssignments = [
  {
    id: "1",
    title: "Math Homework 3.2",
    classId: "1",
    className: "Mathematics",
    dueDate: "2025-03-15",
    status: "graded",
    grade: 92,
    classAverage: 85,
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
    classId: "2",
    className: "English Literature",
    dueDate: "2025-03-10",
    status: "graded",
    grade: 88,
    classAverage: 82,
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
    classId: "3",
    className: "Chemistry",
    dueDate: "2025-03-20",
    status: "pending",
    submittedOn: "2025-03-19",
    feedback: "",
  },
  {
    id: "4",
    title: "History Research Paper",
    classId: "4",
    className: "History",
    dueDate: "2025-03-25",
    status: "not_submitted",
    feedback: "",
  },
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
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState("overview");
  const [chatMessages, setChatMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
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
    setSelectedClass(null);
    setViewMode("overview");
  };

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    setViewMode("assignment");
  };

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setViewMode("class");
  };

  const handleBackToOverview = () => {
    setViewMode("overview");
    setSelectedAssignment(null);
    setSelectedClass(null);
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

  const handleFileChange = (event) => {
    setFileToUpload(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (fileToUpload && selectedClassId) {
      // Simulate file upload
      alert(`File "${fileToUpload.name}" uploaded to class "${mockClasses.find(c => c.id === selectedClassId).name}"`);
      setFileToUpload(null);
      setSelectedClassId("");
    } else {
      alert("Please select a file and a class");
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
          ClassroomApp
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
            <School />
          </ListItemIcon>
          <ListItemText primary="Classes" />
        </ListItem>
        <ListItem button selected={activeTab === 2} onClick={() => handleTabChange(null, 2)}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItem>
        <ListItem button selected={activeTab === 3} onClick={() => handleTabChange(null, 3)}>
          <ListItemIcon>
            <Grade />
          </ListItemIcon>
          <ListItemText primary="Grades" />
        </ListItem>
        <ListItem button selected={activeTab === 4} onClick={() => handleTabChange(null, 4)}>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="AI Assistant" />
        </ListItem>
        <ListItem button selected={activeTab === 5} onClick={() => handleTabChange(null, 5)}>
          <ListItemIcon>
            <CloudUpload />
          </ListItemIcon>
          <ListItemText primary="Upload Work" />
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
          startIcon={<ArrowBack />} 
          variant="text" 
          onClick={handleBackToOverview}
          sx={{ mb: 2 }}
        >
          Back to All Assignments
        </Button>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={selectedAssignment.title}
            subheader={`${selectedAssignment.className} • Due: ${new Date(selectedAssignment.dueDate).toLocaleDateString()}`}
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
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Class Average: {selectedAssignment.classAverage}/100
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

  const renderClassDetail = () => {
    if (!selectedClass) return null;

    const classAssignments = mockAssignments.filter(a => a.classId === selectedClass.id);

    return (
      <Box>
        <Button 
          startIcon={<ArrowBack />} 
          variant="text" 
          onClick={handleBackToOverview}
          sx={{ mb: 2 }}
        >
          Back to All Classes
        </Button>
        
        <Card sx={{ mb: 3 }}>
          <CardHeader
            avatar={<Avatar src={selectedClass.teacherPfp} />}
            title={selectedClass.name}
            subheader={`Teacher: ${selectedClass.teacher} • Class Code: ${selectedClass.code}`}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Class Assignments
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Class Average</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classAssignments.length > 0 ? (
                    classAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusChip(assignment.status)}</TableCell>
                        <TableCell>
                          {assignment.status === "graded" ? `${assignment.grade}/100` : "-"}
                        </TableCell>
                        <TableCell>
                          {assignment.status === "graded" ? `${assignment.classAverage}/100` : "-"}
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">No assignments for this class</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  setActiveTab(5);
                  setSelectedClassId(selectedClass.id);
                }}
              >
                Upload Assignment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderDashboardTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="My Classes" />
          <CardContent>
            <List>
              {mockClasses.slice(0, 3).map((classItem) => (
                <ListItem 
                  key={classItem.id} 
                  button 
                  onClick={() => handleClassSelect(classItem)}
                  sx={{ 
                    mb: 1,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" }
                  }}
                >
                  <Avatar src={classItem.teacherPfp} sx={{ mr: 2 }} />
                  <ListItemText 
                    primary={classItem.name} 
                    secondary={`Teacher: ${classItem.teacher}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button 
              variant="text" 
              color="primary" 
              onClick={() => handleTabChange(null, 1)}
              sx={{ mt: 1 }}
            >
              View All Classes
            </Button>
          </CardContent>
        </Card>
      </Grid>
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
                    secondary={`${assignment.className} • Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                  />
                  {getStatusChip(assignment.status)}
                </ListItem>
              ))}
            </List>
            <Button 
              variant="text" 
              color="primary" 
              onClick={() => handleTabChange(null, 2)}
              sx={{ mt: 1 }}
            >
              View All Assignments
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
                    <TableCell>Class</TableCell>
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
                        <TableCell>{assignment.className}</TableCell>
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

  const renderClassesTab = () => {
    if (viewMode === "class") {
      return renderClassDetail();
    }
    
    return (
      <Box>
        <Card>
          <CardHeader title="My Classes" />
          <CardContent>
            <Grid container spacing={3}>
              {mockClasses.map((classItem) => (
                <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: "pointer",
                      "&:hover": { boxShadow: 3 }
                    }}
                    onClick={() => handleClassSelect(classItem)}
                  >
                    <CardHeader
                      avatar={<Avatar src={classItem.teacherPfp} />}
                      title={classItem.name}
                      subheader={`Teacher: ${classItem.teacher}`}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Class Code: {classItem.code}
                      </Typography>
                      <Button 
                        variant="text" 
                        color="primary"
                        sx={{ mt: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClassSelect(classItem);
                        }}
                      >
                        View Class
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderAssignmentsTab = () => {
    if (viewMode === "assignment") {
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
                    <TableCell>Class</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Class Average</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.className}</TableCell>
                      <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusChip(assignment.status)}</TableCell>
                      <TableCell>
                        {assignment.status === "graded" ? `${assignment.grade}/100` : "-"}
                      </TableCell>
                      <TableCell>
                        {assignment.status === "graded" ? `${assignment.classAverage}/100` : "-"}
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
                  <TableCell>Class</TableCell>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Class Average</TableCell>
                  <TableCell>Date Graded</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAssignments
                  .filter(a => a.status === "graded")
                  .map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.className}</TableCell>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.grade}/100</TableCell>
                      <TableCell>{assignment.classAverage}/100</TableCell>
                      <TableCell>{new Date(assignment.gradedOn).toLocaleDateString()}</TableCell>
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

  const renderUploadTab = () => (
    <Box>
      <Card>
        <CardHeader title="Upload Assignment" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="class-select-label">Select Class</InputLabel>
                <Select
                  labelId="class-select-label"
                  value={selectedClassId}
                  label="Select Class"
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  {mockClasses.map((classItem) => (
                    <MenuItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 3, textAlign: 'center' }}>
                <input
                  accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  style={{ display: 'none' }}
                  id="upload-assignment-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-assignment-file">
                  <Button 
                    variant="outlined" 
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    Select File
                  </Button>
                </label>
                {fileToUpload && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Selected file: {fileToUpload.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                disabled={!fileToUpload || !selectedClassId}
                fullWidth
              >
                Upload Assignment
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Recent Uploads" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Assignment</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Uploaded Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockAssignments
                  .filter(a => a.status === "pending" || a.status === "graded")
                  .map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.className}</TableCell>
                      <TableCell>{new Date(assignment.submittedOn).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusChip(assignment.status)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 0:
        return renderDashboardTab();
      case 1:
        return renderClassesTab();
      case 2:
        return renderAssignmentsTab();
      case 3:
        return renderGradesTab();
      case 4:
        return renderAIAssistantTab();
      case 5:
        return renderUploadTab();
      default:
        return renderDashboardTab();
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GradeGood
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={2} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Avatar src={user?.photoURL} sx={{ width: 32, height: 32 }} />
            <Typography variant="body1" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              {user?.displayName}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 250,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
          display: { xs: "none", sm: "block" },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", sm: `calc(100% - 250px)` },
          mt: 8,
        }}
      >
        {renderMainContent()}
      </Box>
    </Box>
  );
};

export default StudentDashboard;

// Add a new component for the submission confirmation dialog
const SubmissionConfirmationDialog = ({ open, onClose, fileName, className }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submission Successful</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your file "{fileName}" has been successfully uploaded to {className}.
          You will be notified when your submission is graded.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Add a new component for upcoming assignments
const UpcomingAssignments = ({ assignments }) => {
  const sortedAssignments = [...assignments]
    .filter(a => a.status !== "graded")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <Card>
      <CardHeader title="Upcoming Assignments" />
      <CardContent>
        <List>
          {sortedAssignments.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const today = new Date();
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            
            let severity = "info";
            if (diffDays <= 1) {
              severity = "error";
            } else if (diffDays <= 3) {
              severity = "warning";
            }
            
            return (
              <ListItem key={assignment.id}>
                <ListItemText
                  primary={assignment.title}
                  secondary={`${assignment.className} • Due: ${dueDate.toLocaleDateString()}`}
                />
                <Chip 
                  label={diffDays <= 0 ? "Due Today" : `${diffDays} day${diffDays !== 1 ? 's' : ''} left`}
                  color={severity}
                  size="small"
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

// Add a chatbot enhancement for better context understanding
const enhancedHandleSendMessage = () => {
  if (newMessage.trim()) {
    const newMsg = {
      id: chatMessages.length + 1,
      sender: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    setChatMessages([...chatMessages, newMsg]);
    setNewMessage("");
    
    // Use context awareness to provide better responses
    let aiResponse;
    
    // Check if message is related to assignments
    if (newMessage.toLowerCase().includes("assignment") || 
        newMessage.toLowerCase().includes("homework") ||
        newMessage.toLowerCase().includes("due")) {
      
      // Get upcoming assignments
      const upcomingAssignments = mockAssignments
        .filter(a => a.status !== "graded")
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      aiResponse = {
        id: chatMessages.length + 2,
        sender: "ai",
        message: `I see you're asking about assignments. You have ${upcomingAssignments.length} upcoming assignments. The most urgent one is "${upcomingAssignments[0].title}" for ${upcomingAssignments[0].className} due on ${new Date(upcomingAssignments[0].dueDate).toLocaleDateString()}. Would you like more details about a specific assignment?`,
        timestamp: new Date().toISOString(),
      };
    } 
    // Check if message is related to grades
    else if (newMessage.toLowerCase().includes("grade") || 
             newMessage.toLowerCase().includes("score") ||
             newMessage.toLowerCase().includes("mark")) {
      
      const gradedAssignments = mockAssignments.filter(a => a.status === "graded");
      const avgGrade = gradedAssignments.reduce((sum, a) => sum + a.grade, 0) / gradedAssignments.length;
      
      aiResponse = {
        id: chatMessages.length + 2,
        sender: "ai",
        message: `You're asking about grades. Your current average grade across all classes is ${avgGrade.toFixed(1)}%. Your highest grade is ${Math.max(...gradedAssignments.map(a => a.grade))}% for "${gradedAssignments.find(a => a.grade === Math.max(...gradedAssignments.map(a => a.grade))).title}". Would you like to know more about a specific class or assignment?`,
        timestamp: new Date().toISOString(),
      };
    }
    // Default response for other queries
    else {
      aiResponse = {
        id: chatMessages.length + 2,
        sender: "ai",
        message: "I'm here to help with your studies. I can assist with assignments, grades, or any subject-specific questions. Let me know what you need help with!",
        timestamp: new Date().toISOString(),
      };
    }
    
    // Simulate AI response delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  }
};

// Add a component for class performance analytics
const ClassPerformanceAnalytics = ({ classes, assignments }) => {
  // Calculate average grades by class
  const classPerformance = classes.map(classItem => {
    const classAssignments = assignments.filter(a => a.classId === classItem.id && a.status === "graded");
    const avgGrade = classAssignments.length > 0 
      ? classAssignments.reduce((sum, a) => sum + a.grade, 0) / classAssignments.length 
      : 0;
    
    return {
      ...classItem,
      avgGrade,
      totalAssignments: classAssignments.length
    };
  });

  return (
    <Card>
      <CardHeader title="Class Performance" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Average Grade</TableCell>
                <TableCell>Completed Assignments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classPerformance.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>
                    {classItem.avgGrade > 0 ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {classItem.avgGrade.toFixed(1)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={classItem.avgGrade} 
                          sx={{ width: 100, borderRadius: 5 }}
                        />
                      </Box>
                    ) : (
                      "No grades yet"
                    )}
                  </TableCell>
                  <TableCell>{classItem.totalAssignments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

// Add mobile responsiveness improvements


// Add notifications component
const NotificationsMenu = ({ notifications }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 320,
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 2 }}>Notifications</Typography>
        <Divider />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleClose}>
              <ListItemIcon>
                {notification.type === 'grade' ? <Grade fontSize="small" /> : <Assignment fontSize="small" />}
              </ListItemIcon>
              <ListItemText 
                primary={notification.message} 
                secondary={new Date(notification.timestamp).toLocaleString()} 
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <ListItemText primary="No new notifications" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
