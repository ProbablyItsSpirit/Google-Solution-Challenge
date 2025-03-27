<<<<<<< Updated upstream
import React from 'react'

const TeacherDashboard = () => {
  return (
    <div>TeacherDashboard</div>
  )
}

=======
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
  Zoom,
  Fade,
  Grow,
  Slide,
  useTheme,
  alpha,
  Skeleton,
  Snackbar,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { getAuth, signOut } from "firebase/auth"
import { doc, getDoc, collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore"
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
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Lightbulb as LightbulbIcon,
  Help as HelpIcon,
  Bookmark as BookmarkIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material"

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`

const ripple = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.4);
    opacity: 0;
  }
`

const blink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`

// Styled components
const drawerWidth = 240

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: "100%",
  marginTop: theme.spacing(8),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  animation: `${fadeIn} 0.5s ease-in-out`,
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
  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  animation: `${slideUp} 0.3s ease-out`,
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    transform: "translateY(-2px)",
  },
}))

const FileChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  fontSize: "0.75rem",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}))

// Enhanced speech recognition pulse animation
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
  animation: `${pulse} 1.5s infinite`,
}))

const RippleEffect = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  backgroundColor: theme.palette.error.main,
  opacity: 0.3,
  animation: `${ripple} 1.5s infinite`,
}))

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}))

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
  },
}))

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  transition: "all 0.3s ease",
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.5)}`,
  },
}))

const ProgressIndicator = styled(LinearProgress)(({ theme, value }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    background: value >= 80
      ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
      : value >= 70
        ? `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`
        : `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
  },
}))

// Typing animation cursor
const TypingCursor = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: '2px',
  height: '14px',
  backgroundColor: theme.palette.text.primary,
  marginLeft: '2px',
  verticalAlign: 'middle',
  animation: `${blink} 1s infinite`,
}))

// Add this function before the component
function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Enhanced Summary Card Component
const SummaryCard = ({ title, value, subtitle, icon, trend }) => {
  const theme = useTheme()
  
  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {icon && (
            <Box 
              sx={{ 
                mr: 1, 
                color: "primary.main",
                p: 1,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          )}
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
          {trend && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary'
            }}>
              {trend > 0 ? <TrendingUpIcon fontSize="small" /> : 
               trend < 0 ? <TrendingDownIcon fontSize="small" /> : 
               <RemoveIcon fontSize="small" />}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  )
}

// Enhanced Chat Message Component
const ChatMessage = ({ message, userData, getFileIcon, getFileType }) => {
  const [hover, setHover] = useState(false)
  
  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: message.role === "user" ? "flex-end" : "flex-start",
          mb: 2,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {message.role !== "user" && (
          <AnimatedAvatar sx={{ mr: 1, bgcolor: "primary.main" }}>AI</AnimatedAvatar>
        )}
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
          <Typography variant="caption" color="text.secondary" sx={{ 
            alignSelf: message.role === "user" ? "flex-start" : "flex-end",
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.3s ease',
            mt: 0.5
          }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </MessageBubble>
        {message.role === "user" && (
          <AnimatedAvatar sx={{ ml: 1 }}>{userData?.name?.charAt(0) || "U"}</AnimatedAvatar>
        )}
      </Box>
    </Zoom>
  )
}

// Typing Animation Component
const TypingAnimation = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef(text);
  const indexRef = useRef(0);
  
  useEffect(() => {
    textRef.current = text;
    indexRef.current = 0;
    setDisplayText('');
    setIsComplete(false);
    
    const typeText = () => {
      if (indexRef.current < textRef.current.length) {
        setDisplayText(prev => prev + textRef.current.charAt(indexRef.current));
        indexRef.current += 1;
        
        // Random typing speed between 20ms and 50ms for natural effect
        const randomDelay = Math.floor(Math.random() * 30) + 20;
        setTimeout(typeText, randomDelay);
      } else {
        setIsComplete(true);
      }
    };
    
    // Start typing with a small initial delay
    const timer = setTimeout(typeText, 300);
    
    return () => clearTimeout(timer);
  }, [text]);
  
  return (
    <Box>
      {displayText}
      {!isComplete && <TypingCursor />}
    </Box>
  );
};

// Enhanced Empty State Component
const EmptyState = ({ icon, title, description, actionButton }) => (
  <Fade in={true} timeout={800}>
    <Box sx={{ 
      textAlign: "center", 
      p: 3, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      {icon && (
        <Box sx={{ 
          mb: 2, 
          color: "primary.main", 
          p: 2,
          borderRadius: '50%',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
      )}
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
        {description}
      </Typography>
      {actionButton}
    </Box>
  </Fade>
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
  const [typingText, setTypingText] = useState("")
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [darkMode, setDarkMode] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [suggestions, setSuggestions] = useState([
    "How can I create a quiz for my biology class?",
    "Help me grade these math assignments",
    "Analyze student performance trends",
    "Generate a lesson plan for tomorrow"
  ])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [pinnedMessages, setPinnedMessages] = useState([])
  const [showPinned, setShowPinned] = useState(false)

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
      showSnackbar("Speech recognition is not supported in your browser", "error")
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
      showSnackbar("Listening... Speak now", "info")
    }
  }

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      showSnackbar("You're back online!", "success")
    }
    const handleOffline = () => {
      setIsOffline(true)
      showSnackbar("You're offline. Some features may be limited.", "warning")
    }

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
  }, [messages, isTyping])

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
            showSnackbar(`Database error: ${firestoreError.message}`, "error")
          }
        }
      } catch (error) {
        console.error("TeacherDashboard: Error fetching user data:", error)
        showSnackbar(`Error: ${error.message}`, "error")
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
      setRefreshing(true)
      
      // Mock data for demonstration
      setTimeout(() => {
        // Mock classes data
        const mockClasses = [
          {
            id: "class1",
            name: "Biology 101",
            code: "BIO101",
            students: [
              { id: "s1", name: "Alice Smith", email: "alice@example.com", assignmentsCompleted: 8, totalAssignments: 10, averageGrade: 92 },
              { id: "s2", name: "Bob Johnson", email: "bob@example.com", assignmentsCompleted: 7, totalAssignments: 10, averageGrade: 85 },
              { id: "s3", name: "Charlie Brown", email: "charlie@example.com", assignmentsCompleted: 5, totalAssignments: 10, averageGrade: 78 }
            ],
            assignments: [
              { id: "a1", title: "Cell Structure Quiz", dueDate: "2023-05-15", submitted: 3, averageGrade: 88 },
              { id: "a2", title: "Photosynthesis Essay", dueDate: "2023-05-22", submitted: 2, averageGrade: 82 }
            ]
          },
          {
            id: "class2",
            name: "Chemistry 202",
            code: "CHEM202",
            students: [
              { id: "s4", name: "David Wilson", email: "david@example.com", assignmentsCompleted: 6, totalAssignments: 8, averageGrade: 79 },
              { id: "s5", name: "Emma Davis", email: "emma@example.com", assignmentsCompleted: 8, totalAssignments: 8, averageGrade: 94 }
            ],
            assignments: [
              { id: "a3", title: "Periodic Table Test", dueDate: "2023-05-18", submitted: 2, averageGrade: 86 }
            ]
          }
        ];
        
        // Mock grades data
        const mockGrades = [
          { id: "g1", assignment: "Cell Structure Quiz", class: "Biology 101", avgScore: 88, submissions: 3, total: 3 },
          { id: "g2", title: "Photosynthesis Essay", class: "Biology 101", avgScore: 82, submissions: 2, total: 3 },
          { id: "g3", title: "Periodic Table Test", class: "Chemistry 202", avgScore: 86, submissions: 2, total: 2 }
        ];
        
        // Mock chat history
        const mockChatHistory = [
          { 
            id: "ch1", 
            title: "Help with grading biology quizzes", 
            time: new Date().toISOString(),
            messages: [
              { id: Date.now() - 1000, content: "Can you help me grade these biology quizzes?", role: "user" },
              { id: Date.now() - 500, content: "I'd be happy to help with grading biology quizzes. Please upload the answer sheets and I'll analyze them.", role: "assistant" }
            ]
          },
          { 
            id: "ch2", 
            title: "Creating a chemistry lesson plan", 
            time: new Date(Date.now() - 86400000).toISOString(),
            messages: [
              { id: Date.now() - 100000, content: "I need a lesson plan for tomorrow's chemistry class", role: "user" },
              { id: Date.now() - 99500, content: "I can help you create a chemistry lesson plan. What topic are you covering and what grade level is this for?", role: "assistant" }
            ]
          }
        ];
        
        setClasses(mockClasses);
        setRecentGrades(mockGrades);
        setChatHistory(mockChatHistory);
        setRefreshing(false);
        setLoadingClasses(false);
        showSnackbar("Data refreshed successfully", "success");
      }, 1500);
    } catch (error) {
      console.error("Error fetching data:", error)
      showSnackbar("Failed to fetch data from the database", "error")
      setRefreshing(false)
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
      showSnackbar("Logged out successfully", "success")
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
      showSnackbar("Failed to sign out. Please try again.", "error")
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
    showSnackbar(`Switched to ${view.replace('-', ' ')} view`, "info")

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
    showSnackbar(`Viewing ${classItem.name} class details`, "info")
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

  const handleChatSubmit = (e) => {
    e.preventDefault()

    if (!validateChatInput()) {
      return
    }

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
    setShowSuggestions(false)

    // Simulate AI response with proper loading state
    setIsTyping(true)
    
    // Generate AI response text
    const responseText = getAIResponse(chatInput, uploadedFiles);
    setTypingText(responseText);

    // Use a more realistic delay based on message length and files
    const responseDelay = Math.min(1000 + chatInput.length / 10 + uploadedFiles.length * 500, 3000)

    setTimeout(() => {
      try {
        const aiResponse = {
          id: Date.now() + 1,
          content: responseText,
          role: "assistant",
        }
        setMessages((prev) => [...prev, aiResponse])
        saveChatHistory(userMessage, aiResponse)
        showSnackbar("Response received", "success")
      } catch (error) {
        console.error("Error generating AI response:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            content: "I'm sorry, I encountered an error processing your request. Please try again.",
            role: "assistant",
            isError: true,
          },
        ])
        showSnackbar("Error generating response", "error")
      } finally {
        setIsTyping(false)
        setTypingText("")
      }
    }, responseDelay)
  }

  const getAIResponse = (input, files) => {
    if (files.length > 0) {
      if (files.some((f) => f.name.toLowerCase().includes("question"))) {
        return "I've analyzed the question paper. It contains 5 multiple choice questions and 3 essay questions. Would you like me to suggest a grading rubric?"
      } else if (files.some((f) => f.name.toLowerCase().includes("answer"))) {
        return "I've reviewed the answer sheets. Based on my analysis, the average score is 78%. Would you like a detailed breakdown of common mistakes?"
      } else if (files.some((f) => f.name.toLowerCase().includes("solution"))) {
        return "I've processed the solution paper. It's well-structured and covers all the key points. Would you like me to compare it with student answers?"
      }
      return "I've received your files and processed them. How would you like me to help with these documents?"
    }

    if (input.toLowerCase().includes("grade") || input.toLowerCase().includes("assess")) {
      return "I can help you grade papers. Upload student submissions, and I'll analyze them based on your rubric or solution key."
    } else if (input.toLowerCase().includes("quiz") || input.toLowerCase().includes("test")) {
      return "I can help you create quizzes or tests. What subject and difficulty level are you looking for?"
    } else if (input.toLowerCase().includes("analyze") || input.toLowerCase().includes("performance")) {
      return "I can analyze student performance data. Upload assessment results, and I'll provide insights on strengths, weaknesses, and improvement areas."
    }

    return "I'm your AI teaching assistant. I can help with grading, creating educational content, analyzing student performance, and more. How can I assist you today?"
  }

  const handleFileUpload = (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files)

        // Check file size (limit to 10MB per file)
        const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024)
        if (oversizedFiles.length > 0) {
          showSnackbar(`Some files exceed the 10MB size limit: ${oversizedFiles.map((f) => f.name).join(", ")}`, "error")
          return
        }

        // Check total number of files (limit to 5 at a time)
        if (uploadedFiles.length + newFiles.length > 5) {
          showSnackbar("You can only upload up to 5 files at a time", "error")
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

        setUploadedFiles((prev) => [...prev, ...renamedFiles])
        showSnackbar(`${renamedFiles.length} file(s) uploaded successfully`, "success")
        setError(null)
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      showSnackbar("Failed to process uploaded files", "error")
    }
  }

  const handleSpecificFileUpload = (type) => {
    if (fileInputRef.current) {
      // Set a data attribute to track which button was clicked
      fileInputRef.current.setAttribute("data-file-type", type)
      fileInputRef.current.click()
    }
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    showSnackbar("File removed", "info")
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
      showSnackbar("Failed to save chat history", "error")
    }
  }

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
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

  const handleRefresh = () => {
    if (auth.currentUser) {
      fetchData(auth.currentUser.uid)
    }
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter)
    handleFilterClose()
    showSnackbar(`Filter applied: ${filter}`, "info")
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus()
      }, 100)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion)
    setShowSuggestions(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    showSnackbar(`${darkMode ? 'Light' : 'Dark'} mode enabled`, "info")
  }

  const handlePinMessage = (message) => {
    setPinnedMessages(prev => [...prev, message])
    showSnackbar("Message pinned", "success")
  }

  const handleUnpinMessage = (messageId) => {
    setPinnedMessages(prev => prev.filter(msg => msg.id !== messageId))
    showSnackbar("Message unpinned", "info")
  }

  const togglePinnedMessages = () => {
    setShowPinned(!showPinned)
  }

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
            <GradientButton variant="contained" onClick={() => window.location.reload()}>
              Refresh Page
            </GradientButton>

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
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
        }}
      >
        <Box sx={{ position: 'relative', mb: 4 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography 
            variant="h4" 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            G
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
          GradeGood
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Loading teacher dashboard...
        </Typography>
        <Box sx={{ width: '200px', mt: 3 }}>
          <LinearProgress color="primary" />
        </Box>
      </Box>
    )
  }

  const renderAIAssistantView = () => (
    <Box sx={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
      <Paper elevation={3} sx={{ 
        p: 2, 
        borderRadius: 2, 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8]
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            AI Teaching Assistant
          </Typography>
          <Box>
            <Tooltip title="Pinned messages">
              <IconButton onClick={togglePinnedMessages} color={showPinned ? "primary" : "default"}>
                <BookmarkIcon />
                {pinnedMessages.length > 0 && (
                  <Badge 
                    color="primary" 
                    badgeContent={pinnedMessages.length} 
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                  />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Help">
              <IconButton>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Pinned Messages */}
        <Collapse in={showPinned && pinnedMessages.length > 0}>
          <Paper variant="outlined" sx={{ mb: 2, p: 1, maxHeight: '150px', overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
              Pinned Messages
            </Typography>
            {pinnedMessages.map(message => (
              <Box key={message.id} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 1, 
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' }
              }}>
                <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {message.content.substring(0, 50)}...
                </Typography>
                <IconButton size="small" onClick={() => handleUnpinMessage(message.id)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Paper>
        </Collapse>

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
                    <GradientButton variant="contained" fullWidth>
                      Create a quiz
                    </GradientButton>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <GradientButton variant="contained" fullWidth>
                      Grade papers
                    </GradientButton>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <GradientButton variant="contained" fullWidth>
                      Analyze results
                    </GradientButton>
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
              <AnimatedAvatar sx={{ mr: 1, bgcolor: "primary.main" }}>AI</AnimatedAvatar>
              <MessageBubble isUser={false}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {typingText ? (
                    <TypingAnimation text={typingText} />
                  ) : (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">Thinking...</Typography>
                    </>
                  )}
                </Box>
              </MessageBubble>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Suggestions */}
        {showSuggestions && messages.length === 0 && (
          <Fade in={true}>
            <Paper variant="outlined" sx={{ mb: 2, p: 1 }}>
              <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
                Suggestions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip 
                    key={index}
                    label={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    clickable
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Fade>
        )}

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", mb: 1 }}>
            {uploadedFiles.map((file, index) => (
              <Zoom in={true} key={index} style={{ transitionDelay: `${index * 50}ms` }}>
                <FileChip sx={{ display: "flex", alignItems: "center" }}>
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
              </Zoom>
            ))}
          </Box>
        )}

        {/* Interim transcript display */}
        {interimTranscript && (
          <Fade in={true}>
            <Box sx={{ mb: 1, px: 2, py: 1, bgcolor: "rgba(0, 0, 0, 0.05)", borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                {interimTranscript}...
              </Typography>
            </Box>
          </Fade>
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
                  sx={{ 
                    mr: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
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
                  sx={{ 
                    mr: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
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
                  sx={{ 
                    mr: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
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
              onChange={(e) => setChatInput(e.target.value)}
              variant="outlined"
              size="small"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleChatSubmit(e)
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s ease',
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                  }
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
                    transition: 'all 0.2s ease',
                    "&:hover": {
                      bgcolor: isListening ? "rgba(211, 47, 47, 0.2)" : "rgba(25, 118, 210, 0.1)",
                      transform: 'scale(1.1)'
                    },
                  }}
                >
                  {isListening ? <MicIcon /> : <MicIcon />}
                </IconButton>
                {isListening && (
                  <>
                    <PulseCircle />
                    <RippleEffect />
                  </>
                )}
              </Box>
            </Tooltip>

            <GradientButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              disabled={isTyping || (chatInput.trim() === "" && uploadedFiles.length === 0)}
            >
              <SendIcon />
            </GradientButton>
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
          <Button 
            startIcon={<ArrowBackIcon />} 
            variant="text" 
            onClick={handleBackToOverview} 
            sx={{ 
              mb: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateX(-5px)'
              }
            }}
          >
            Back to All Classes
          </Button>

          <StyledCard sx={{ mb: 3 }}>
            <CardHeader
              avatar={<AnimatedAvatar>{selectedClass.name.charAt(0)}</AnimatedAvatar>}
              title={selectedClass.name}
              subheader={`Class Code: ${selectedClass.code}`}
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Class Roster
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
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
                        <TableRow key={student.id} sx={{ 
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                        }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <AnimatedAvatar sx={{ mr: 1, width: 28, height: 28 }}>{student.name.charAt(0)}</AnimatedAvatar>
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
                              <ProgressIndicator
                                variant="determinate"
                                value={student.averageGrade}
                                sx={{ width: 100, borderRadius: 5 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <GradientButton variant="contained" size="small">
                              View Details
                            </GradientButton>
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
                        <TableRow key={assignment.id} sx={{ 
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                        }}>
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
                                <ProgressIndicator
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
                            <GradientButton variant="contained" size="small">
                              Grade
                            </GradientButton>
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
                <GradientButton variant="contained" color="primary" startIcon={<AddIcon />}>
                  Add Assignment
                </GradientButton>
                <Button variant="outlined" color="secondary" startIcon={<ChatIcon />}>
                  Send Announcement
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
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
            trend={5}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Average Grade"
            value={averageGrade ? `${averageGrade}%` : "N/A"}
            subtitle={averageGrade ? "Compared to last semester" : "No data available"}
            icon={<AssessmentIcon />}
            trend={2}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Assignments"
            value={totalAssignments}
            subtitle={`${gradedAssignments} graded, ${pendingAssignments} pending`}
            icon={<AssignmentIcon />}
            trend={-3}
          />
        </Grid>

        {/* Recent Grades Table */}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader 
              title="Recent Grades" 
              action={
                <Box>
                  <Tooltip title="Refresh">
                    <IconButton onClick={handleRefresh} disabled={refreshing}>
                      {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Filter">
                    <IconButton onClick={handleFilterOpen}>
                      <FilterListIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterClose}
                  >
                    <MenuItem onClick={() => handleFilterSelect('all')} selected={selectedFilter === 'all'}>
                      All Grades
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect('high')} selected={selectedFilter === 'high'}>
                      High Scores (80%+)
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect('low')} selected={selectedFilter === 'low'}>
                      Low Scores (Below 70%)
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect('incomplete')} selected={selectedFilter === 'incomplete'}>
                      Incomplete Submissions
                    </MenuItem>
                  </Menu>
                </Box>
              }
            />
            <CardContent>
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
                        <TableRow key={grade.id} sx={{ 
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
                        }}>
                          <TableCell>{grade.assignment}</TableCell>
                          <TableCell>{grade.class}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${grade.avgScore}%`}
                              color={grade.avgScore >= 80 ? "success" : grade.avgScore >= 70 ? "warning" : "error"}
                              sx={{ 
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)'
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {grade.submissions}/{grade.total}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton size="small" sx={{ 
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' }
                              }}>
                                <DescriptionIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Analytics">
                              <IconButton size="small" sx={{ 
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'scale(1.1)' }
                              }}>
                                <AssessmentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          {loadingClasses ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                              <CircularProgress size={24} />
                            </Box>
                          ) : (
                            "No recent grades available"
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* My Classes */}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader 
              title="My Classes" 
              action={
                <GradientButton 
                  variant="contained" 
                  size="small" 
                  startIcon={<AddIcon />}
                  sx={{ mr: 1 }}
                >
                  Create Class
                </GradientButton>
              }
            />
            <CardContent>
              {loadingClasses ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : classes.length > 0 ? (
                <Grid container spacing={3}>
                  {classes.map((classItem) => (
                    <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                      <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={500}>
                        <StyledCard
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={() => handleClassSelect(classItem)}
                        >
                          <CardHeader
                            avatar={<AnimatedAvatar>{classItem.name.charAt(0)}</AnimatedAvatar>}
                            title={classItem.name}
                            subheader={`${classItem.students?.length || 0} students`}
                            action={
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle more options
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            }
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Chip 
                                size="small" 
                                label={`Code: ${classItem.code}`} 
                                color="primary" 
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {classItem.assignments?.length || 0} assignments
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                Class Progress:
                              </Typography>
                              <ProgressIndicator
                                variant="determinate"
                                value={75}
                                sx={{ flexGrow: 1 }}
                              />
                            </Box>
                          </CardContent>
                          <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                            <GradientButton
                              variant="contained"
                              fullWidth
                              onClick={(e) => {
                                e.stopPropagation()
                                handleClassSelect(classItem)
                              }}
                            >
                              View Class
                            </GradientButton>
                          </Box>
                        </StyledCard>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  icon={<SchoolIcon sx={{ fontSize: 60 }} />}
                  title="No Classes Yet"
                  description="Create your first class to get started with managing your students and assignments."
                  actionButton={
                    <GradientButton variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                      Create Your First Class
                    </GradientButton>
                  }
                />
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    )
  }

  const renderSettingsView = () => (
    <StyledCard sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledCard variant="outlined" sx={{ p: 2 }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    transition: 'all 0.3s ease',
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                label="Email"
                defaultValue={userData?.email}
                variant="outlined"
                margin="normal"
                disabled
              />
              <GradientButton variant="contained" color="primary" sx={{ mt: 2 }}>
                Update Profile
              </GradientButton>
            </Box>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive email notifications for important updates"
                />
                <Switch defaultChecked />
              </ListItem>
              <ListItem>
                <ListItemText primary="Assignment Reminders" secondary="Get reminders about upcoming assignments" />
                <Switch defaultChecked />
              </ListItem>
              <ListItem>
                <ListItemText primary="Student Submissions" secondary="Be notified when students submit assignments" />
                <Switch defaultChecked />
              </ListItem>
            </List>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              AI Assistant Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Save Chat History" secondary="Store your conversations with the AI assistant" />
                <Switch defaultChecked />
              </ListItem>
              <ListItem>
                <ListItemText primary="Voice Recognition" secondary="Enable or disable speech-to-text functionality" />
                <Switch defaultChecked />
              </ListItem>
              <ListItem>
                <ListItemText primary="Dark Mode" secondary="Switch between light and dark theme" />
                <Switch checked={darkMode} onChange={toggleDarkMode} />
              </ListItem>
            </List>
            <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Data & Privacy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your conversations with the AI assistant are stored securely and used only to improve your experience.
                You can delete your chat history at any time.
              </Typography>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />} 
                sx={{ mt: 2 }}
                onClick={() => showSnackbar("Chat history cleared", "success")}
              >
                Clear Chat History
              </Button>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
    </StyledCard>
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
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            edge="start"
            onClick={() => setSidebarOpen(true)}
            sx={{ 
              mr: 2,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'rotate(180deg)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            GradeGood
          </Typography>

          {showSearch && (
            <Fade in={showSearch}>
              <TextField
                id="search-input"
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  mr: 2,
                  width: 200,
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    opacity: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={toggleSearch} sx={{ color: 'white' }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </Fade>
          )}

          <Tooltip title="Search">
            <IconButton color="inherit" onClick={toggleSearch} sx={{ display: showSearch ? 'none' : 'flex' }}>
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit" aria-label="notifications">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <AnimatedAvatar 
              sx={{ 
                bgcolor: "secondary.main", 
                width: 32, 
                height: 32,
                cursor: 'pointer'
              }}
              onClick={handleMenuOpen}
            >
              {userData?.name?.charAt(0) || "T"}
            </AnimatedAvatar>
            <Typography variant="body1" sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
              {userData?.name}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen} size="small" sx={{ ml: 0.5 }}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => {
                handleMenuClose();
                handleViewChange('settings');
              }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={toggleDarkMode}>
                <ListItemIcon>
                  {darkMode ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                </ListItemIcon>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogoutClick}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
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
            boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)'
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            GradeGood
          </Typography>
          <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleViewChange("ai-assistant")} 
              selected={activeView === "ai-assistant"}
              sx={{
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <ChatIcon color={activeView === "ai-assistant" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="AI Assistant" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleViewChange("classroom")} 
              selected={activeView === "classroom"}
              sx={{
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <SchoolIcon color={activeView === "classroom" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Classroom" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleViewChange("settings")} 
              selected={activeView === "settings"}
              sx={{
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <SettingsIcon color={activeView === "settings" ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleChatHistoryToggle}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
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
                  <ListItem 
                    key={index} 
                    sx={{ 
                      pl: 4,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    <ListItemText 
                      primary={chat.title} 
                      secondary={new Date(chat.time).toLocaleString()} 
                      primaryTypographyProps={{ 
                        noWrap: true,
                        style: { maxWidth: '180px' }
                      }}
                    />
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
            <ListItemButton 
              onClick={handleLogoutClick}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  color: theme.palette.error.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.error.main,
                  }
                }
              }}
            >
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
          <Fade in={isOffline}>
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                animation: `${pulse} 2s infinite`
              }}
              action={
                <Button color="inherit" size="small">
                  Retry
                </Button>
              }
            >
              You are currently offline. Some features may be limited until you reconnect.
            </Alert>
          </Fade>
        )}

        {error && (
          <Fade in={Boolean(error)}>
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {renderContent()}

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={showLogoutConfirm}
          onClose={handleLogoutCancel}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
          TransitionComponent={Slide}
          TransitionProps={{ direction: "up" }}
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
            <Button onClick={handleLogoutConfirm} color="error" variant="contained" autoFocus>
              Logout
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
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
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }
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

>>>>>>> Stashed changes
export default TeacherDashboard