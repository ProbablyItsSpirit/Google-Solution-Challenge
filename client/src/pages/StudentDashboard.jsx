"use client"

import { useEffect, useState, useRef } from "react"
import { styled } from "@mui/material/styles"
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  ListItemButton,
  Grid,
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
  TextField,
  LinearProgress,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip
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
  Mic as MicIcon,
  QuestionAnswer as QuestionIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserData, getClasses, getAssignments, submitAssignment, sendChatMessage, getChatHistory, processChatMessage, uploadFileToBackend, gradeAnswerPaper } from '../services/api';

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

// Styled components
const PulseCircle = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  backgroundColor: theme.palette.error.main,
  opacity: 0.6,
  animation: "pulse 1.5s infinite",
  "@keyframes pulse": {
    "0%": {
      transform: "translate(-50%, -50%) scale(0.95)",
      opacity: 0.6,
    },
    "70%": {
      transform: "translate(-50%, -50%) scale(1.1)",
      opacity: 0.3,
    },
    "100%": {
      transform: "translate(-50%, -50%) scale(0.95)",
      opacity: 0.6,
    },
  },
}));

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
const [uploadsLoading, setUploadsLoading] = useState(false);
const [uploadsError, setUploadsError] = useState(null);
const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

  const [viewMode, setViewMode] = useState("overview");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [submittedFileName, setSubmittedFileName] = useState("");
  const [submittedClassName, setSubmittedClassName] = useState("");
  const [aiResponding, setAiResponding] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState("");

  // Initialize speech recognition
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimText = "";
        let finalText = newMessage;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript + " ";
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        setNewMessage(finalText);
        setInterimTranscript(interimText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setSpeechError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      showErrorWithTimeout("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
    } else {
      setSpeechError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Load user data and fetch all required data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async(currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || "Student User",
          photoURL: currentUser.photoURL || "https://placekitten.com/64/64",
        });
        
        fetchAllData(currentUser.uid);
      } else {
        navigate("/");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  
  
  // Function to fetch all data from backend
  const fetchAllData = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      setUploadsLoading(true);
      setUploadsError(null);
  
      // Fetch all data in parallel for better performance
      const promises = [
        getClasses(userId).catch(err => {
          console.error('Error fetching classes:', err);
          return [];
        }),
        getAssignments(userId).catch(err => {
          console.error('Error fetching assignments:', err);
          return [];
        }),
        getChatHistory(userId).catch(err => {
          console.error('Error fetching chat history:', err);
          return [];
        })
      ];
  
      const [classesData, assignmentsData, chatHistory] = await Promise.all(promises);
  
      // Set the data states
      setClasses(Array.isArray(classesData) ? classesData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      setChatMessages(Array.isArray(chatHistory) ? chatHistory : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setUploadsLoading(false);
    }
  };

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

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        // Add user's message to the chat
        const newMsg = {
          id: chatMessages.length + 1,
          sender: "user",
          message: newMessage,
          timestamp: new Date().toISOString(),
        };
        setChatMessages([...chatMessages, newMsg]);
        setNewMessage("");
  
        // Send message to the backend
        const aiResponse = await sendChatMessage(user.uid, newMessage);
        setChatMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
      }
    }
  };
  
  const handleFileChange = (event) => {
    setFileToUpload(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (fileToUpload && selectedClassId) {
      try {
        // Find the class name for the dialog
        const selectedClass = classes.find(c => c.id === selectedClassId);
        const className = selectedClass ? selectedClass.name : "Selected Class";
        
        // Upload the file to the backend
        const response = await submitAssignment(user.uid, selectedClassId, fileToUpload);
        
        // Show confirmation dialog
        setSubmittedFileName(fileToUpload.name);
        setSubmittedClassName(className);
        setConfirmDialogOpen(true);
  
        // Clear the file input
        setFileToUpload(null);
        setSelectedClassId("");
  
        // Refresh assignments
        const updatedAssignments = await getAssignments(user.uid);
        setAssignments(updatedAssignments);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('Failed to upload file. Please try again.');
      }
    } else {
      alert("Please select a file and a class");
    }
  };

  const handleCloseSubmissionDialog = () => {
    setSubmissionDialogOpen(false);
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
        <ListItemButton selected={activeTab === 0} onClick={() => handleTabChange(null, 0)}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton selected={activeTab === 1} onClick={() => handleTabChange(null, 1)}>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="Classes" />
        </ListItemButton>
        <ListItemButton selected={activeTab === 2} onClick={() => handleTabChange(null, 2)}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItemButton>
        <ListItemButton selected={activeTab === 3} onClick={() => handleTabChange(null, 3)}>
          <ListItemIcon>
            <Grade />
          </ListItemIcon>
          <ListItemText primary="Grades" />
        </ListItemButton>
        <ListItemButton selected={activeTab === 4} onClick={() => handleTabChange(null, 4)}>
          <ListItemIcon>
            <Chat />
          </ListItemIcon>
          <ListItemText primary="AI Assistant" />
        </ListItemButton>
        <ListItemButton selected={activeTab === 5} onClick={() => handleTabChange(null, 5)}>
          <ListItemIcon>
            <CloudUpload />
          </ListItemIcon>
          <ListItemText primary="Upload Work" />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
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
  
    // Filter assignments for the selected class
    const classAssignments = assignments.filter(a => a.classId === selectedClass.id);
  
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
            
            {error && (
              <Typography color="error" sx={{ my: 2 }}>
                {error}
              </Typography>
            )}
            
            {loading ? (
              <LinearProgress sx={{ my: 2 }} />
            ) : (
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
            )}
            
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
      {loading ? (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      ) : error ? (
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="My Classes" />
              <CardContent>
                <List>
                  {classes.slice(0, 3).map((classItem) => (
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
                  {assignments.slice(0, 3).map((assignment) => (
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
                      {assignments
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
        </>
      )}
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
            {loading ? (
              <LinearProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Grid container spacing={3}>
                {classes.map((classItem) => (
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
            )}
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
            {loading ? (
              <LinearProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
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
                    {assignments.length > 0 ? (
                      assignments.map((assignment) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">No assignments found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
          {loading ? (
            <LinearProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
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
                  {assignments
                    .filter(a => a.status === "graded")
                    .length > 0 ? (
                      assignments
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
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No graded assignments yet</TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
            {chatMessages.length > 0 ? (
              chatMessages.map((msg) => (
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
              ))
            ) : (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No messages yet. Start a conversation with your AI study assistant!
                </Typography>
              </Box>
            )}
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
            <Tooltip title={isListening ? "Stop listening" : "Speech to text"}>
              <Box sx={{ position: "relative", ml: 1 }}>
                <IconButton
                  color={isListening ? "error" : "primary"}
                  onClick={toggleSpeechRecognition}
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    bgcolor: isListening ? "rgba(211, 47, 47, 0.1)" : "transparent",
                    "&:hover": {
                      bgcolor: isListening ? "rgba(211, 47, 47, 0.2)" : "rgba(25, 118, 210, 0.1)",
                    },
                  }}
                >
                  {isListening ? <MicIcon /> : <MicIcon />}
                </IconButton>
                {isListening && <PulseCircle />}
              </Box>
            </Tooltip>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSendMessage}
              endIcon={<Send />}
              disabled={aiResponding}
            >
              {aiResponding ? 'Sending...' : 'Send'}
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
          {loading ? (
            <LinearProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
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
                    {classes.map((classItem) => (
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
          )}
        </CardContent>
      </Card>
      
      <Card sx={{ mt: 3 }}>
        <CardHeader title="Recent Uploads" />
        <CardContent>
          {uploadsLoading ? (
            <LinearProgress />
          ) : uploadsError ? (
            <Typography color="error">{uploadsError}</Typography>
          ) : assignments.length > 0 ? (
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
                  {assignments
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
          ) : (
            <Typography variant="body2" color="textSecondary" align="center">
              No assignments uploaded yet
            </Typography>
          )}
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

  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#8E33FF' }}>
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
    
    {/* Just the notification icon without functionality */}
    <IconButton color="inherit">
      <Badge badgeContent={0} color="error">
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
          width: drawerWidth,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
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
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {renderMainContent()}
      </Box>
      <SubmissionConfirmationDialog 
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        fileName={fileToUpload?.name || ""}
        className={classes.find(c => c.id === selectedClassId)?.name || ""}
      />
    </Box>
  );
};

export default StudentDashboard;

// Submission confirmation dialog component
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

// Updated UpcomingAssignments component using fetched data
const UpcomingAssignments = ({ assignments, loading, error }) => {
  const sortedAssignments = assignments
    .filter(a => a.status !== "graded")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <Card>
      <CardHeader title="Upcoming Assignments" />
      <CardContent>
        {loading ? (
          <LinearProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : sortedAssignments.length > 0 ? (
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
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            No upcoming assignments
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Updated chatbot handling with contextual awareness but using real data
const handleSendMessage = async () => {
  if (newMessage.trim()) {
    try {
      // Add user's message to the chat
      const newMsg = {
        id: chatMessages.length + 1,
        sender: "user",
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage("");
      
      // Show loading indicator
      setAiResponding(true);
      
      // Send message to the backend
      const aiResponse = await sendChatMessage(user.uid, newMessage);
      if (aiResponse) {
        setChatMessages((prev) => [...prev, {
          id: prev.length + 1,
          sender: "ai",
          message: aiResponse.message || "Sorry, I don't have a response for that.",
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages((prev) => [...prev, {
        id: prev.length + 1,
        sender: "ai",
        message: "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setAiResponding(false);
    }
  }
};
// Class Performance Analytics with real data
const ClassPerformanceAnalytics = ({ classes, assignments, loading, error }) => {
  // Process class performance data
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
        {loading ? (
          <LinearProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};



// Function to render status chip with appropriate color
const getStatusChip = (status) => {
  switch (status) {
    case 'pending':
      return <Chip label="Pending" color="warning" size="small" />;
    case 'graded':
      return <Chip label="Graded" color="success" size="small" />;
    case 'late':
      return <Chip label="Late" color="error" size="small" />;
    default:
      return <Chip label={status} color="default" size="small" />;
  }
};

// Dashboard tab rendering function
const renderDashboardTab = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <UpcomingAssignments 
          assignments={assignments} 
          loading={assignmentsLoading} 
          error={assignmentsError} 
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="At a Glance" />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText 
                  primary={`${classes.length} Enrolled Classes`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Assignment />
                </ListItemIcon>
                <ListItemText 
                  primary={`${assignments.filter(a => a.status !== "graded").length} Pending Assignments`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Grading />
                </ListItemIcon>
                <ListItemText 
                  primary={`${assignments.filter(a => a.status === "graded").length} Graded Assignments`} 
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <ClassPerformanceAnalytics 
          classes={classes} 
          assignments={assignments}
          loading={classesLoading || assignmentsLoading}
          error={classesError || assignmentsError}
        />
      </Grid>
    </Grid>
  );
};
