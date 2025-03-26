"use client"

import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  Grid,
  Alert,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
  LinearProgress,
  ListItemButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { getAuth, signOut } from "firebase/auth"
import { doc, getDoc, collection, addDoc } from "firebase/firestore"
import { db, testFirestoreConnection } from "../firebase"
import { useNavigate } from "react-router-dom"
import FirebaseRulesGuide from "../components/FirebaseRulesGuide"
import {
  Send as SendIcon,
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
  Remove as RemoveIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Mic as MicIcon,
} from "@mui/icons-material"
import { processChatMessage, uploadFileToBackend, gradeAnswerPaper } from "../services/api"

// Styled components
const drawerWidth = 240

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: "100%",
  marginTop: theme.spacing(8), // Adjusted spacing since we removed the tabs
}))

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: "80%",
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(1),
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[200],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? "flex-end" : "flex-start",
  display: "flex",
  flexDirection: "column",
}))

const FileChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  fontSize: "0.75rem",
}))

// Speech recognition pulse animation
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
}))

// Add this function before the component
function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Summary Card Component
const SummaryCard = ({ title, value, subtitle, icon }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon && <Box sx={{ mr: 1, color: "primary.main" }}>{icon}</Box>}
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4">{value}</Typography>
      <Typography variant="body2" color="textSecondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
)

// Chat Message Component
const ChatMessage = ({ message, userData, getFileIcon, getFileType }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: message.role === "user" ? "flex-end" : "flex-start",
      mb: 2,
    }}
  >
    {message.role !== "user" && <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>AI</Avatar>}
    <MessageBubble isUser={message.role === "user"}>
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
    {message.role === "user" && <Avatar sx={{ ml: 1 }}>{userData?.name?.charAt(0) || "U"}</Avatar>}
  </Box>
)

// Empty State Component
const EmptyState = ({ icon, title, description, actionButton }) => (
  <Box sx={{ textAlign: "center", p: 3 }}>
    {icon && <Box sx={{ mb: 2, color: "primary.main" }}>{icon}</Box>}
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
      {description}
    </Typography>
    {actionButton}
  </Box>
)

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showPermissionGuide, setShowPermissionGuide] = useState(false)
  const [activeView, setActiveView] = useState("ai-assistant") // Default view
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [classes, setClasses] = useState([])
  const [recentGrades, setRecentGrades] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [viewMode, setViewMode] = useState("overview")
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const auth = getAuth()
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [inputError, setInputError] = useState("")
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechError, setSpeechError] = useState(null)
  const recognitionRef = useRef(null)
  const [interimTranscript, setInterimTranscript] = useState("")

  // Initialize speech recognition
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let interimText = ""
        let finalText = chatInput

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript + " "
          } else {
            interimText += event.results[i][0].transcript
          }
        }

        setChatInput(finalText)
        setInterimTranscript(interimText)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setSpeechError(`Error: ${event.error}`)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setInterimTranscript("")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      showErrorWithTimeout("Speech recognition is not supported in your browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript("")
    } else {
      setSpeechError(null)
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("TeacherDashboard: Fetching user data...")
        const user = auth.currentUser

        if (!user) {
          console.log("TeacherDashboard: No current user found, redirecting to login")
          navigate("/")
          return
        }

        console.log(`TeacherDashboard: User authenticated, UID: ${user.uid.substring(0, 5)}...`)

        // Test Firestore permissions first
        try {
          const hasPermissions = await testFirestoreConnection()

          if (!hasPermissions) {
            console.log("TeacherDashboard: Firestore permission test failed")
            setUserData({
              name: user.displayName || user.email?.split("@")[0] || "Teacher",
              role: "teacher",
              email: user.email,
              permissionError: true,
            })
            setLoading(false)
            return
          }
        } catch (permissionError) {
          console.error("TeacherDashboard: Permission test error:", permissionError)
          setUserData({
            name: user.displayName || user.email?.split("@")[0] || "Teacher",
            role: "teacher",
            email: user.email,
            permissionError: true,
          })
          setLoading(false)
          return
        }

        // If offline, use a default user object
        if (isOffline) {
          console.log("TeacherDashboard: Working in offline mode")
          setUserData({
            name: user.displayName || user.email?.split("@")[0] || "Teacher",
            role: "teacher",
            email: user.email,
            isOfflineData: true,
          })
          setLoading(false)
          return
        }

        try {
          const userRef = doc(db, "users", user.uid)
          console.log(`TeacherDashboard: Fetching document from path: ${userRef.path}`)

          const userDoc = await getDoc(userRef)

          if (userDoc.exists()) {
            console.log("TeacherDashboard: User document exists in Firestore")
            setUserData(userDoc.data())
          } else {
            console.log("TeacherDashboard: User document doesn't exist in Firestore")
            // Create fallback user data from auth object
            setUserData({
              name: user.displayName || user.email?.split("@")[0] || "Teacher",
              role: "teacher",
              email: user.email,
              isNewUser: true,
            })
          }

          // Fetch chat history, classes, and grades from Firestore
          fetchData(user.uid)
        } catch (firestoreError) {
          console.error("TeacherDashboard: Firestore error:", firestoreError)

          // Handle offline errors gracefully
          if (firestoreError.message?.includes("offline")) {
            setUserData({
              name: user.displayName || user.email?.split("@")[0] || "Teacher",
              role: "teacher",
              email: user.email,
              isOfflineData: true,
            })
          } else {
            showErrorWithTimeout(`Database error: ${firestoreError.message}`)
          }
        }
      } catch (error) {
        console.error("TeacherDashboard: Error fetching user data:", error)
        showErrorWithTimeout(`Error: ${error.message}`)
      } finally {
        console.log("TeacherDashboard: Setting loading to false")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [auth, navigate, isOffline])

  const fetchData = async (userId) => {
    try {
      setLoadingClasses(true)
      // These would be actual Firestore queries
      // Example for fetching classes:
      // const classesRef = collection(db, 'teachers', userId, 'classes');
      // const classesSnapshot = await getDocs(classesRef);
      // const classesData = classesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // setClasses(classesData);

      // Example for fetching recent grades:
      // const gradesRef = collection(db, 'teachers', userId, 'recentGrades');
      // const gradesSnapshot = await getDocs(gradesRef);
      // const gradesData = gradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // setRecentGrades(gradesData);

      // Example for fetching chat history:
      // const chatRef = collection(db, 'teachers', userId, 'chatHistory');
      // const chatSnapshot = await getDocs(chatRef);
      // const chatData = chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // setChatHistory(chatData);

      // For now, set empty arrays instead of mock data
      setClasses([])
      setRecentGrades([])
      setChatHistory([])
    } catch (error) {
      console.error("Error fetching data:", error)
      showErrorWithTimeout("Failed to fetch data from the database")
    } finally {
      setLoadingClasses(false)
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
    setSidebarOpen(false)
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false)
  }

  const handleLogoutConfirm = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
      showErrorWithTimeout("Failed to sign out. Please try again.")
    } finally {
      setShowLogoutConfirm(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleViewChange = (view) => {
    setActiveView(view)
    setSidebarOpen(false)

    // Reset class view when switching to classroom
    if (view === "classroom") {
      setViewMode("overview")
      setSelectedClass(null)
    }
  }

  const handleChatHistoryToggle = () => {
    setChatHistoryOpen(!chatHistoryOpen)
  }

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem)
    setViewMode("class")
  }

  const handleBackToOverview = () => {
    setViewMode("overview")
    setSelectedClass(null)
  }

  const validateChatInput = () => {
    if (chatInput.trim() === "" && uploadedFiles.length === 0) {
      setInputError("Please enter a message or upload a file")
      return false
    }

    if (chatInput.length > 1000) {
      setInputError("Message is too long (maximum 1000 characters)")
      return false
    }

    setInputError("")
    return true
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!validateChatInput()) return

    // Stop speech recognition if it's active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      setInterimTranscript("")
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: chatInput,
      role: "user",
      files: uploadedFiles,
    }
    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setUploadedFiles([])

    // Simulate AI response with proper loading state
    setIsTyping(true)

    try {
      const result = await processChatMessage(chatInput, userData.uid)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: result.response || "Error from AI",
          role: "ai",
        },
      ])
    } catch (err) {
      console.error("Chat request failed:", err)
    } finally {
      setIsTyping(false)
    }
  }

  const handleFileUpload = async (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files)

        // Check file size (limit to 10MB per file)
        const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024)
        if (oversizedFiles.length > 0) {
          showErrorWithTimeout(`Some files exceed the 10MB size limit: ${oversizedFiles.map((f) => f.name).join(", ")}`)
          return
        }

        // Check total number of files (limit to 5 at a time)
        if (uploadedFiles.length + newFiles.length > 5) {
          showErrorWithTimeout("You can only upload up to 5 files at a time")
          return
        }

        // Add file type prefix based on which button was clicked
        const fileType = fileInputRef.current?.getAttribute("data-file-type") || ""
        const renamedFiles = newFiles.map((file) => {
          // Only rename if the file doesn't already have the prefix
          if (
            !file.name.toLowerCase().includes("question") &&
            !file.name.toLowerCase().includes("answer") &&
            !file.name.toLowerCase().includes("solution")
          ) {
            // Create a new file with the modified name
            const newFileName = fileType ? `${fileType}_${file.name}` : file.name
            return new File([file], newFileName, { type: file.type })
          }
          return file
        })

        for (const f of renamedFiles) {
          const response = await uploadFileToBackend(f, "general")
          console.log("Upload response:", response)
          setUploadedFiles((prev) => [...prev, f])

          // Trigger grading if an answer paper is uploaded
          if (fileType === "answer") {
            try {
              // Assuming you have assignmentId and other necessary info
              const gradingResult = await gradeAnswerPaper(f, "assignmentId", userData.uid);
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + 2,
                  content: gradingResult.feedback || "Grading failed",
                  role: "ai",
                },
              ]);
            } catch (gradingError) {
              console.error("Grading request failed:", gradingError);
              showErrorWithTimeout("Failed to initiate grading");
            }
          }
        }
        setError(null)
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      showErrorWithTimeout("Failed to process uploaded files")
    }
  }

  const handleSpecificFileUpload = async (type) => {
    if (fileInputRef.current) {
      // Set a data attribute to track which button was clicked
      fileInputRef.current.setAttribute("data-file-type", type)
      fileInputRef.current.click()
      // In the 'onChange' we can pass 'type' to uploadFileToBackend if needed
    }
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileName) => {
    if (fileName.toLowerCase().includes("question")) return <QuestionIcon fontSize="small" />
    if (fileName.toLowerCase().includes("answer")) return <AssignmentIcon fontSize="small" />
    if (fileName.toLowerCase().includes("solution")) return <DescriptionIcon fontSize="small" />
    return <FileIcon fontSize="small" />
  }

  const getFileType = (fileName) => {
    if (fileName.toLowerCase().includes("question")) return "Question Paper"
    if (fileName.toLowerCase().includes("answer")) return "Answer Paper"
    if (fileName.toLowerCase().includes("solution")) return "Solution Paper"
    return "Document"
  }

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUpIcon fontSize="small" style={{ color: "green" }} />
    if (current < previous) return <TrendingDownIcon fontSize="small" style={{ color: "red" }} />
    return <RemoveIcon fontSize="small" style={{ color: "gray" }} />
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "graded":
        return <Chip icon={<CheckCircleIcon />} label="Graded" size="small" color="success" variant="outlined" />
      case "pending":
        return (
          <Chip icon={<PendingActionsIcon />} label="Pending Review" size="small" color="warning" variant="outlined" />
        )
      case "not_submitted":
        return <Chip icon={<CancelIcon />} label="Not Submitted" size="small" color="error" variant="outlined" />
      default:
        return null
    }
  }

  const saveChatHistory = async (message, response) => {
    if (!auth.currentUser) return

    try {
      const chatHistoryRef = collection(db, "teachers", auth.currentUser.uid, "chatHistory")
      const newChatEntry = {
        title: message.content.substring(0, 50) + (message.content.length > 50 ? "..." : ""),
        time: new Date().toISOString(),
        messages: [message, response],
        createdAt: new Date(),
      }

      await addDoc(chatHistoryRef, newChatEntry)

      // Update local chat history
      setChatHistory((prev) => [newChatEntry, ...prev])
    } catch (error) {
      console.error("Error saving chat history:", error)
    }
  }

  const showErrorWithTimeout = (errorMessage, timeout = 5000) => {
    setError(errorMessage)

    // Clear the error after timeout
    setTimeout(() => {
      setError(null)
    }, timeout)
  }

  const debouncedSetChatInput = useCallback(
    debounce((value) => {
      setChatInput(value)
    }, 300),
    [],
  )

  const totalStudents = useMemo(() => {
    return classes.reduce((total, c) => total + (c.students?.length || 0), 0)
  }, [classes])

  const averageGrade = useMemo(() => {
    if (recentGrades.length === 0) return null
    return Math.round(recentGrades.reduce((sum, g) => sum + g.avgScore, 0) / recentGrades.length)
  }, [recentGrades])

  const totalAssignments = useMemo(() => {
    return classes.reduce((total, c) => total + (c.assignments?.length || 0), 0)
  }, [classes])

  const gradedAssignments = useMemo(() => {
    return recentGrades.filter((g) => g.submissions === g.total).length
  }, [recentGrades])

  const pendingAssignments = useMemo(() => {
    return recentGrades.filter((g) => g.submissions < g.total).length
  }, [recentGrades])

  if (showPermissionGuide) {
    return <FirebaseRulesGuide onClose={() => setShowPermissionGuide(false)} />
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
                Go to{" "}
                <Link
                  href="https://console.firebase.google.com/project/solutionchallenge-e876c/firestore/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Firebase Firestore Rules
                </Link>
              </Typography>
            </li>
            <li>
              <Typography paragraph>Replace the current rules with:</Typography>
              <Paper sx={{ bgcolor: "#f5f5f5", p: 2, my: 2, fontFamily: "monospace", fontSize: "0.9rem" }}>
                rules_version = '2';
                <br />
                service cloud.firestore {"{"}
                <br />
                &nbsp;&nbsp;match /databases/{"{"}database{"}"}/documents {"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;match /{"{"}document=**{"}"} {"{"}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read, write: if true;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                <br />
                &nbsp;&nbsp;{"}"}
                <br />
                {"}"}
              </Paper>
            </li>
            <li>
              <Typography paragraph>Click "Publish"</Typography>
            </li>
            <li>
              <Typography paragraph>
                Then go to{" "}
                <Link
                  href="https://console.firebase.google.com/project/solutionchallenge-e876c/storage/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Firebase Storage Rules
                </Link>{" "}
                and do the same for Storage rules
              </Typography>
            </li>
            <li>
              <Typography paragraph>After updating the rules, refresh this page</Typography>
            </li>
          </ol>

          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>

            <Button variant="outlined" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    )
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ mb: 3 }} />
        <Typography variant="body1" color="text.secondary">
          Loading teacher dashboard...
        </Typography>
      </Box>
    )
  }

  const renderAIAssistantView = () => (
    <Box sx={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" gutterBottom>
          AI Teaching Assistant
        </Typography>

        {/* Chat Messages */}
        <Box sx={{ flexGrow: 1, overflow: "auto", mb: 2, display: "flex", flexDirection: "column" }}>
          {messages.length === 0 ? (
            <EmptyState
              icon={<SchoolIcon sx={{ fontSize: 60 }} />}
              title="How can I help you today?"
              description="Ask me questions about teaching, grading, or upload papers for analysis."
              actionButton={
                <Grid container spacing={2} sx={{ maxWidth: 500, mx: "auto" }}>
                  <Grid item xs={12} sm={4}>
                    <Button variant="outlined" fullWidth>
                      Create a quiz
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="outlined" fullWidth>
                      Grade papers
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button variant="outlined" fullWidth>
                      Analyze results
                    </Button>
                  </Grid>
                </Grid>
              }
            />
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                userData={userData}
                getFileIcon={getFileIcon}
                getFileType={getFileType}
              />
            ))
          )}
          {isTyping && (
            <Box sx={{ display: "flex", mb: 2 }}>
              <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>AI</Avatar>
              <MessageBubble isUser={false}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">Thinking...</Typography>
                </Box>
              </MessageBubble>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", mb: 1 }}>
            {uploadedFiles.map((file, index) => (
              <FileChip key={index} sx={{ display: "flex", alignItems: "center" }}>
                {getFileIcon(file.name)}
                <Typography variant="caption" sx={{ ml: 0.5, mr: 0.5 }}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({getFileType(file.name)})
                </Typography>
                <IconButton size="small" onClick={() => removeFile(index)} sx={{ ml: 0.5, p: 0.5 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </FileChip>
            ))}
          </Box>
        )}

        {/* Interim transcript display */}
        {interimTranscript && (
          <Box sx={{ mb: 1, px: 2, py: 1, bgcolor: "rgba(0, 0, 0, 0.05)", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              {interimTranscript}...
            </Typography>
          </Box>
        )}

        {/* Speech recognition error display */}
        {speechError && (
          <Typography variant="caption" color="error" sx={{ mb: 1 }}>
            {speechError}
          </Typography>
        )}

        {/* Chat Input with Specific File Upload Buttons */}
        <Box component="form" onSubmit={handleChatSubmit} sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", mr: 1 }}>
              {/* Question Paper Upload Button */}
              <Tooltip title="Upload Question Paper">
                <IconButton
                  color="primary"
                  component="button"
                  onClick={() => handleSpecificFileUpload("question")}
                  sx={{ mr: 0.5 }}
                >
                  <QuestionIcon />
                </IconButton>
              </Tooltip>

              {/* Answer Paper Upload Button */}
              <Tooltip title="Upload Answer Paper">
                <IconButton
                  color="primary"
                  component="button"
                  onClick={() => handleSpecificFileUpload("answer")}
                  sx={{ mr: 0.5 }}
                >
                  <AssignmentIcon />
                </IconButton>
              </Tooltip>

              {/* Solution Paper Upload Button */}
              <Tooltip title="Upload Solution Paper">
                <IconButton
                  color="primary"
                  component="button"
                  onClick={() => handleSpecificFileUpload("solution")}
                  sx={{ mr: 0.5 }}
                >
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                aria-label="Upload files"
              />
            </Box>

            <TextField
              fullWidth
              placeholder="Ask me anything or upload papers for analysis..."
              value={chatInput}
              onChange={(e) => debouncedSetChatInput(e.target.value)}
              variant="outlined"
              size="small"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleChatSubmit(e)
                }
              }}
            />

            {/* Improved Speech to Text Button */}
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
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              disabled={isTyping || (chatInput.trim() === "" && uploadedFiles.length === 0)}
            >
              <SendIcon />
            </Button>
          </Box>
          {inputError && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {inputError}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )

  const renderClassroomView = () => {
    if (viewMode === "class" && selectedClass) {
      return (
        <Box>
          <Button startIcon={<ArrowBackIcon />} variant="text" onClick={handleBackToOverview} sx={{ mb: 2 }}>
            Back to All Classes
          </Button>

          <Card sx={{ mb: 3 }}>
            <CardHeader
              avatar={<Avatar>{selectedClass.name.charAt(0)}</Avatar>}
              title={selectedClass.name}
              subheader={`Class Code: ${selectedClass.code}`}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Class Roster
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Assignments Completed</TableCell>
                      <TableCell>Average Grade</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedClass.students?.length > 0 ? (
                      selectedClass.students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ mr: 1, width: 28, height: 28 }}>{student.name.charAt(0)}</Avatar>
                              {student.name}
                            </Box>
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            {student.assignmentsCompleted}/{student.totalAssignments}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {student.averageGrade}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={student.averageGrade}
                                sx={{ width: 100, borderRadius: 5 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button variant="outlined" size="small">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No students in this class
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Class Assignments
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Average Grade</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedClass.assignments?.length > 0 ? (
                      selectedClass.assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>{assignment.title}</TableCell>
                          <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {assignment.submitted}/{selectedClass.students?.length || 0}
                          </TableCell>
                          <TableCell>
                            {assignment.averageGrade ? (
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                  {assignment.averageGrade}%
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={assignment.averageGrade}
                                  sx={{ width: 100, borderRadius: 5 }}
                                />
                              </Box>
                            ) : (
                              "Not graded yet"
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="outlined" size="small">
                              Grade
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No assignments for this class
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button variant="contained" color="primary">
                  Add Assignment
                </Button>
                <Button variant="outlined" color="secondary">
                  Send Announcement
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )
    }

    return (
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Total Students"
            value={totalStudents}
            subtitle={`Across ${classes.length} classes`}
            icon={<PersonIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Average Grade"
            value={averageGrade ? `${averageGrade}%` : "N/A"}
            subtitle={averageGrade ? "Compared to last semester" : "No data available"}
            icon={<AssessmentIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Assignments"
            value={totalAssignments}
            subtitle={`${gradedAssignments} graded, ${pendingAssignments} pending`}
            icon={<AssignmentIcon />}
          />
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
                  {recentGrades.length > 0 ? (
                    recentGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>{grade.assignment}</TableCell>
                        <TableCell>{grade.class}</TableCell>
                        <TableCell align="right">
                          <ChipComponent
                            label={`${grade.avgScore}%`}
                            color={grade.avgScore >= 80 ? "success" : grade.avgScore >= 70 ? "warning" : "error"}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {grade.submissions}/{grade.total}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <DescriptionIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <AssessmentIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No recent grades available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* My Classes */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="My Classes" />
            <CardContent>
              {loadingClasses ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : classes.length > 0 ? (
                <Grid container spacing={3}>
                  {classes.map((classItem) => (
                    <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { boxShadow: 3 },
                        }}
                        onClick={() => handleClassSelect(classItem)}
                      >
                        <CardHeader
                          avatar={<Avatar>{classItem.name.charAt(0)}</Avatar>}
                          title={classItem.name}
                          subheader={`${classItem.students?.length || 0} students`}
                        />
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            Class Code: {classItem.code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {classItem.assignments?.length || 0} assignments
                          </Typography>
                          <Button
                            variant="text"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleClassSelect(classItem)
                            }}
                          >
                            View Class
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No classes available. Create your first class to get started.
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Create Class
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  const renderSettingsView = () => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Display Name"
                defaultValue={userData?.name}
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                defaultValue={userData?.email}
                variant="outlined"
                margin="normal"
                disabled
              />
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Update Profile
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive email notifications for important updates"
                />
                {/* Toggle switch would go here */}
              </ListItem>
              <ListItem>
                <ListItemText primary="Assignment Reminders" secondary="Get reminders about upcoming assignments" />
                {/* Toggle switch would go here */}
              </ListItem>
              <ListItem>
                <ListItemText primary="Student Submissions" secondary="Be notified when students submit assignments" />
                {/* Toggle switch would go here */}
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              AI Assistant Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Save Chat History" secondary="Store your conversations with the AI assistant" />
                {/* Toggle switch would go here */}
              </ListItem>
              <ListItem>
                <ListItemText primary="Voice Recognition" secondary="Enable or disable speech-to-text functionality" />
                {/* Toggle switch would go here */}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  )

  const renderContent = () => {
    switch (activeView) {
      case "ai-assistant":
        return renderAIAssistantView()
      case "classroom":
        return renderClassroomView()
      case "settings":
        return renderSettingsView()
      default:
        return renderAIAssistantView()
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            edge="start"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            GradeGood
          </Typography>

          <IconButton color="inherit" aria-label="notifications">
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
              {userData?.name?.charAt(0) || "T"}
            </Avatar>
            <Typography variant="body1" sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
              {userData?.name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a73e8" }}>
            Menu
          </Typography>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleViewChange("ai-assistant")} selected={activeView === "ai-assistant"}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="AI Assistant" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleViewChange("classroom")} selected={activeView === "classroom"}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Classroom" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleViewChange("settings")} selected={activeView === "settings"}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleChatHistoryToggle}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Chat History" />
              {chatHistoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>
          <Collapse in={chatHistoryOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {chatHistory.length > 0 ? (
                chatHistory.map((chat, index) => (
                  <ListItem key={index} sx={{ pl: 4 }}>
                    <ListItemText primary={chat.title} secondary={new Date(chat.time).toLocaleString()} />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ pl: 4 }}>
                  <ListItemText
                    primary="No chat history"
                    primaryTypographyProps={{ color: "text.secondary", fontSize: "0.875rem" }}
                  />
                </ListItem>
              )}
            </List>
          </Collapse>
          <Divider sx={{ my: 1 }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Main>
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

        {renderContent()}

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={showLogoutConfirm}
          onClose={handleLogoutCancel}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
        >
          <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText id="logout-dialog-description">
              Are you sure you want to log out? Any unsaved changes will be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLogoutCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleLogoutConfirm} color="error" autoFocus>
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Main>
    </Box>
  )
}

// ChipComponent for Material UI compatibility
function ChipComponent({ label, color }) {
  const getColor = () => {
    switch (color) {
      case "success":
        return { bgcolor: "#4caf50", color: "white" }
      case "warning":
        return { bgcolor: "#ff9800", color: "white" }
      case "error":
        return { bgcolor: "#f44336", color: "white" }
      default:
        return { bgcolor: "#e0e0e0", color: "black" }
    }
  }

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        padding: "0px 8px",
        height: "24px",
        fontSize: "0.75rem",
        fontWeight: "bold",
        ...getColor(),
      }}
    >
      {label}
    </Box>
  )
}

// Missing MUI Icons
function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PendingActionsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CancelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 14L12 12M12 12L14 10M12 12L10 10M12 12L14 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowBackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 19L3 12M3 12L10 5M3 12H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default TeacherDashboard
