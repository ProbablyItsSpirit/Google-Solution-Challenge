"use client"

import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import axios from "axios"; // Corrected import statement for axios
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
  Snackbar,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { getAuth, signOut } from "firebase/auth"
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, testFirestoreConnection } from "../firebase"
import { useNavigate } from "react-router-dom"
import FirebaseRulesGuide from "../components/FirebaseRulesGuide"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase"
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
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
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Help as HelpIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  LibraryBooks as LibraryBooksIcon,
  Share as ShareIcon,
  Storage as StorageIcon,
  CloudUpload as CloudUploadIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PendingActions as PendingActionsIcon,
  VideoLibrary as VideoLibraryIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Slideshow as SlideshowIcon,
  Folder as FolderIcon,
  CloudDownload as CloudDownloadIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
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

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
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

// Update your MessageBubble definition like this:
const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser'
})(({ theme, isUser }) => ({
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
  transform: "translate(-50%, -50%)",
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
    background:
      value >= 80
        ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
        : value >= 70
        ? `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`
        : `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
  },
}))

const TypingCursor = styled("span")(({ theme }) => ({
  display: "inline-block",
  width: "2px",
  height: "14px",
  backgroundColor: theme.palette.text.primary,
  marginLeft: "2px",
  verticalAlign: "middle",
  animation: `${blink} 1s infinite`,
}))

const ResourceCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[10],
    "& .resource-icon": {
      animation: `${float} 2s ease-in-out infinite`,
    },
  },
}))

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  marginBottom: theme.spacing(2),
  width: 60,
  height: 60,
}))

// Backend API URL (replace with your actual backend URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// Add this function before the component
function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// File upload utility for Firebase Storage
const uploadFileToStorage = async (file, userId, type) => {
  try {
    const timestamp = new Date().getTime()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${type}_${timestamp}.${fileExtension}`
    const storageRef = ref(storage, `uploads/${userId}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return {
      name: file.name,
      url: downloadURL,
      type: type,
      uploadTime: timestamp
    }
  } catch (error) {
    console.error("Error uploading file to storage:", error)
    throw error
  }
}

// Send files to backend for grading
const sendFilesForGrading = async (files, userId) => {
  try {
    const fileData = {}

    // Upload each file to Firebase Storage and get download URLs
    for (const file of files) {
      // Determine file type (question, answer, or solution)
      let fileType = 'document'
      if (file.name.toLowerCase().includes('question')) {
        fileType = 'question'
      } else if (file.name.toLowerCase().includes('answer')) {
        fileType = 'answer'
      } else if (file.name.toLowerCase().includes('solution')) {
        fileType = 'solution'
      }
      
      const fileInfo = await uploadFileToStorage(file, userId, fileType)
      fileData[fileType] = fileInfo
    }

    // Send file URLs to backend for grading
    const response = await axios.post(`${API_BASE_URL}/grade`, {
      userId: userId,
      files: fileData
    })

    return response.data
  } catch (error) {
    console.error("Error sending files for grading:", error)
    throw error
  }
}

// Save grading results to Firestore
const saveGradingResults = async (userId, files, gradingResults) => {
  try {
    const gradingRef = collection(db, "users", userId, "gradings")
    const timestamp = serverTimestamp()
    const gradingData = {
      timestamp: timestamp,
      files: files,
      results: gradingResults,
      status: "completed"
    }

    const docRef = await addDoc(gradingRef, gradingData)
    
    // Add gradings to classroom if it exists
    if (gradingResults.classroomId) {
      const submissionRef = collection(db, "classrooms", gradingResults.classroomId, "submissions")
      await addDoc(submissionRef, {
        ...gradingData,
        studentId: gradingResults.studentId || null,
        assignmentId: gradingResults.assignmentId || null,
        gradedBy: userId
      })
    }
    
    return docRef.id
  } catch (error) {
    console.error("Error saving grading results:", error)
    throw error
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
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
          )}
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
          {trend !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: trend > 0 ? "success.main" : trend < 0 ? "error.main" : "text.secondary",
              }}
            >
              {trend > 0 ? (
                <TrendingUpIcon fontSize="small" />
              ) : trend < 0 ? (
                <TrendingDownIcon fontSize="small" />
              ) : (
                <RemoveIcon fontSize="small" />
              )}
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
const ChatMessage = ({ message, userData, getFileIcon, getFileType, onPin }) => {
  const [hover, setHover] = useState(false)

  return (
    <Zoom in={true} style={{ transitionDelay: "100ms" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: message.role === "user" ? "flex-end" : "flex-start",
          mb: 2,
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {message.role !== "user" && <AnimatedAvatar sx={{ mr: 1, bgcolor: "primary.main" }}>AI</AnimatedAvatar>}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
              opacity: hover ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
            {message.role === "assistant" && (
              <IconButton size="small" onClick={() => onPin && onPin(message)} sx={{ p: 0.5 }}>
                <BookmarkIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </MessageBubble>
        {message.role === "user" && <AnimatedAvatar sx={{ ml: 1 }}>{userData?.name?.charAt(0) || "U"}</AnimatedAvatar>}
      </Box>
    </Zoom>
  )
}

// Typing Animation Component
const TypingAnimation = ({ text }) => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const textRef = useRef(text)
  const indexRef = useRef(0)

  useEffect(() => {
    textRef.current = text
    indexRef.current = 0
    setDisplayText("")
    setIsComplete(false)

    const typeText = () => {
      if (indexRef.current < textRef.current.length) {
        setDisplayText((prev) => prev + textRef.current.charAt(indexRef.current))
        indexRef.current += 1

        // Random typing speed between 20ms and 50ms for natural effect
        const randomDelay = Math.floor(Math.random() * 30) + 20
        setTimeout(typeText, randomDelay)
      } else {
        setIsComplete(true)
      }
    }

    // Start typing with a small initial delay
    const timer = setTimeout(typeText, 300)

    return () => clearTimeout(timer)
  }, [text])

  return (
    <Box>
      {displayText}
      {!isComplete && <TypingCursor />}
    </Box>
  )
}

// Enhanced Empty State Component
const EmptyState = ({ icon, title, description, actionButton }) => (
  <Fade in={true} timeout={800}>
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {icon && (
        <Box
          sx={{
            mb: 2,
            color: "primary.main",
            p: 2,
            borderRadius: "50%",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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

// Resource Type Icon Component
const ResourceTypeIcon = ({ type, size = "medium" }) => {
  const iconSize = size === "small" ? { fontSize: "small" } : size === "large" ? { fontSize: "large" } : {}

  switch (type.toLowerCase()) {
    case "document":
      return <DescriptionIcon className="resource-icon" sx={iconSize} />
    case "presentation":
      return <SlideshowIcon className="resource-icon" sx={iconSize} />
    case "video":
      return <VideoLibraryIcon className="resource-icon" sx={iconSize} />
    case "image":
      return <ImageIcon className="resource-icon" sx={iconSize} />
    case "pdf":
      return <PdfIcon className="resource-icon" sx={iconSize} />
    case "folder":
      return <FolderIcon className="resource-icon" sx={iconSize} />
    case "quiz":
      return <AssignmentIcon className="resource-icon" sx={iconSize} />
    default:
      return <FileIcon className="resource-icon" sx={iconSize} />
  }
}

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
  const [isGrading, setIsGrading] = useState(false);
  const [gradingError, setGradingError] = useState(null);
  const [gradingResult, setGradingResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [recentGrades, setRecentGrades] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [viewMode, setViewMode] = useState("overview")
  const fileInputRef = useRef(null)
  const resourceFileInputRef = useRef(null)
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" })
  const [darkMode, setDarkMode] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  // Light/Dark theme configuration
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
    },
  })

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#ce93d8',
        light: '#f3e5f5',
        dark: '#ab47bc',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
  })
  
  // Select active theme based on darkMode state
  const activeTheme = darkMode ? darkTheme : lightTheme

  const [showSearch, setShowSearch] = useState(false)
  const [suggestions, setSuggestions] = useState([
    "How can I create a quiz for my biology class?",
    "Help me grade these math assignments",
    "Analyze student performance trends",
    "Generate a lesson plan for tomorrow",
  ])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [pinnedMessages, setPinnedMessages] = useState([])
  const [showPinned, setShowPinned] = useState(false)
  const [resourceMenuAnchorEl, setResourceMenuAnchorEl] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [resourceViewMode, setResourceViewMode] = useState("grid") // grid or list
  const [resourceSortBy, setResourceSortBy] = useState("dateAdded")
  const [resourceSortDirection, setResourceSortDirection] = useState("desc")
  const [resourceFilterType, setResourceFilterType] = useState("all")
  const [resourceFilterSubject, setResourceFilterSubject] = useState("all")
  const [showResourceUploadDialog, setShowResourceUploadDialog] = useState(false)
  const [newResourceData, setNewResourceData] = useState({
    title: "",
    type: "document",
    subject: "",
    description: "",
    file: null,
    shared: true,
  })
  const [resourceUploadProgress, setResourceUploadProgress] = useState(0)
  const [isResourceUploading, setIsResourceUploading] = useState(false)
  const [showResourceDetailDialog, setShowResourceDetailDialog] = useState(false)
  const [resources, setResources] = useState([
    {
      id: "r1",
      title: "Cell Biology Slides",
      type: "presentation",
      subject: "Biology",
      description: "Comprehensive slides covering cell structure and function for high school biology.",
      dateAdded: "2023-05-10",
      size: "2.4 MB",
      downloads: 12,
      shared: true,
      thumbnail: null,
    },
    {
      id: "r2",
      title: "Periodic Table Worksheet",
      type: "document",
      subject: "Chemistry",
      description: "Interactive worksheet for students to learn about the periodic table elements.",
      dateAdded: "2023-05-15",
      size: "1.1 MB",
      downloads: 8,
      shared: true,
      thumbnail: null,
    },
    {
      id: "r3",
      title: "Photosynthesis Video",
      type: "video",
      subject: "Biology",
      description: "Educational video explaining the process of photosynthesis with animations.",
      dateAdded: "2023-05-18",
      size: "45.6 MB",
      downloads: 5,
      shared: false,
      thumbnail: null,
    },
    {
      id: "r4",
      title: "Algebra Practice Problems",
      type: "document",
      subject: "Mathematics",
      description: "Collection of algebra problems with solutions for student practice.",
      dateAdded: "2023-05-20",
      size: "0.8 MB",
      downloads: 15,
      shared: true,
      thumbnail: null,
    },
    {
      id: "r5",
      title: "World History Timeline",
      type: "pdf",
      subject: "History",
      description: "Comprehensive timeline of major world events from ancient to modern history.",
      dateAdded: "2023-05-22",
      size: "3.2 MB",
      downloads: 7,
      shared: true,
      thumbnail: null,
    },
    {
      id: "r6",
      title: "Physics Lab Experiment Guide",
      type: "document",
      subject: "Physics",
      description: "Step-by-step instructions for 10 physics lab experiments suitable for high school.",
      dateAdded: "2023-05-25",
      size: "1.7 MB",
      downloads: 9,
      shared: true,
      thumbnail: null,
    },
    {
      id: "r7",
      title: "Literary Analysis Techniques",
      type: "presentation",
      subject: "English",
      description: "Presentation on techniques for analyzing literature and poetry.",
      dateAdded: "2023-05-28",
      size: "4.5 MB",
      downloads: 11,
      shared: true,
      thumbnail: null,
    },
    {
      id: "r8",
      title: "Geometry Formulas Cheat Sheet",
      type: "pdf",
      subject: "Mathematics",
      description: "Quick reference guide for all important geometry formulas.",
      dateAdded: "2023-06-01",
      size: "0.5 MB",
      downloads: 22,
      shared: true,
      thumbnail: null,
    },
  ])

  // Get unique subjects from resources
  const uniqueSubjects = useMemo(() => {
    const subjects = resources.map((r) => r.subject)
    return ["all", ...new Set(subjects)].filter(Boolean)
  }, [resources])

  // Get unique resource types
  const uniqueResourceTypes = useMemo(() => {
    const types = resources.map((r) => r.type)
    return ["all", ...new Set(types)].filter(Boolean)
  }, [resources])

  // Filter and sort resources
  const filteredAndSortedResources = useMemo(() => {
    let filtered = [...resources]

    // Apply type filter
    if (resourceFilterType !== "all") {
      filtered = filtered.filter((r) => r.type.toLowerCase() === resourceFilterType.toLowerCase())
    }

    // Apply subject filter
    if (resourceFilterSubject !== "all") {
      filtered = filtered.filter((r) => r.subject === resourceFilterSubject)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.subject.toLowerCase().includes(query),
      )
    }

    // Sort resources
    return filtered.sort((a, b) => {
      let comparison = 0

      switch (resourceSortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "type":
          comparison = a.type.localeCompare(b.type)
          break
        case "subject":
          comparison = a.subject.localeCompare(b.subject)
          break
        case "size":
          // Extract numeric part from size string (e.g., "2.4 MB" -> 2.4)
          const sizeA = Number.parseFloat(a.size)
          const sizeB = Number.parseFloat(b.size)
          comparison = sizeA - sizeB
          break
        case "downloads":
          comparison = a.downloads - b.downloads
          break
        case "dateAdded":
        default:
          // Compare dates
          comparison = new Date(a.dateAdded) - new Date(b.dateAdded)
          break
      }

      // Apply sort direction
      return resourceSortDirection === "asc" ? comparison : -comparison
    })
  }, [resources, resourceFilterType, resourceFilterSubject, resourceSortBy, resourceSortDirection, searchQuery])

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
  }, [chatInput])

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
              {
                id: "s1",
                name: "Alice Smith",
                email: "alice@example.com",
                assignmentsCompleted: 8,
                totalAssignments: 10,
                averageGrade: 92,
              },
              {
                id: "s2",
                name: "Bob Johnson",
                email: "bob@example.com",
                assignmentsCompleted: 7,
                totalAssignments: 10,
                averageGrade: 85,
              },
              {
                id: "s3",
                name: "Charlie Brown",
                email: "charlie@example.com",
                assignmentsCompleted: 5,
                totalAssignments: 10,
                averageGrade: 78,
              },
            ],
            assignments: [
              { id: "a1", title: "Cell Structure Quiz", dueDate: "2023-05-15", submitted: 3, averageGrade: 88 },
              { id: "a2", title: "Photosynthesis Essay", dueDate: "2023-05-22", submitted: 2, averageGrade: 82 },
            ],
          },
          {
            id: "class2",
            name: "Chemistry 202",
            code: "CHEM202",
            students: [
              {
                id: "s4",
                name: "David Wilson",
                email: "david@example.com",
                assignmentsCompleted: 6,
                totalAssignments: 8,
                averageGrade: 79,
              },
              {
                id: "s5",
                name: "Emma Davis",
                email: "emma@example.com",
                assignmentsCompleted: 8,
                totalAssignments: 8,
                averageGrade: 94,
              },
            ],
            assignments: [
              { id: "a3", title: "Periodic Table Test", dueDate: "2023-05-18", submitted: 2, averageGrade: 86 },
            ],
          },
        ]

        // Mock grades data
        const mockGrades = [
          { id: "g1", assignment: "Cell Structure Quiz", class: "Biology 101", avgScore: 88, submissions: 3, total: 3 },
          { id: "g2", title: "Photosynthesis Essay", class: "Biology 101", avgScore: 82, submissions: 2, total: 3 },
          { id: "g3", title: "Periodic Table Test", class: "Chemistry 202", avgScore: 86, submissions: 2, total: 2 },
        ]

        // Mock chat history
        const mockChatHistory = [
          {
            id: "ch1",
            title: "Help with grading biology quizzes",
            time: new Date().toISOString(),
            messages: [
              { id: Date.now() - 1000, content: "Can you help me grade these biology quizzes?", role: "user" },
              {
                id: Date.now() - 500,
                content:
                  "I'd be happy to help with grading biology quizzes. Please upload the answer sheets and I'll analyze them.",
                role: "assistant",
              },
            ],
          },
          {
            id: "ch2",
            title: "Creating a chemistry lesson plan",
            time: new Date(Date.now() - 86400000).toISOString(),
            messages: [
              { id: Date.now() - 100000, content: "I need a lesson plan for tomorrow's chemistry class", role: "user" },
              {
                id: Date.now() - 99500,
                content:
                  "I can help you create a chemistry lesson plan. What topic are you covering and what grade level is this for?",
                role: "assistant",
              },
            ],
          },
        ]

        setClasses(mockClasses)
        setRecentGrades(mockGrades)
        setChatHistory(mockChatHistory)
        setRefreshing(false)
        setLoadingClasses(false)
        showSnackbar("Data refreshed successfully", "success")
      }, 1500)
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
    showSnackbar(`Switched to ${view.replace("-", " ")} view`, "info")

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

  // Process grading with AI
  const processGrading = async () => {
    try {
      if (uploadedFiles.length === 0) {
        setInputError("Please upload files for grading")
        return
      }
      
      setIsGrading(true)
      setGradingError(null)
      
      // Add user message about grading
      const userMessage = {
        id: Date.now(),
        content: "Please grade these documents",
        role: "user",
        files: uploadedFiles,
      }
      setMessages((prev) => [...prev, userMessage])
      
      // Simulate typing for better UX
      setIsTyping(true)
      setTypingText("Processing your documents for grading...")
      
      // Get user ID
      const userId = auth.currentUser?.uid
      if (!userId) {
        throw new Error("User not authenticated")
      }
      
      // Send files to backend and get grading results
      const results = await sendFilesForGrading(uploadedFiles, userId)
      
      // Save results to Firebase
      await saveGradingResults(userId, uploadedFiles, results)
      
      // Store results in state
      setGradingResults(results)
      
      // Format response message
      let responseContent = "## Grading Results\n\n"
      
      if (results.totalScore !== undefined) {
        responseContent += `**Total Score:** ${results.totalScore}/${results.maxScore}\n\n`
      }
      
      if (results.feedback && results.feedback.length > 0) {
        responseContent += "### Question-by-Question Feedback:\n\n"
        results.feedback.forEach((item, index) => {
          responseContent += `**Question ${item.q}:** ${item.correct ? '✓' : '✗'} ${item.remarks}\n`
          if (item.refPage) {
            responseContent += `Reference: Page ${item.refPage}\n`
          }
          responseContent += '\n'
        })
      }
      
      responseContent += "Would you like me to provide more detailed feedback on any specific question?"
      
      // Add AI response with grading results
      const aiResponse = {
        id: Date.now() + 1,
        content: responseContent,
        role: "assistant",
        gradingResults: results
      }
      setMessages((prev) => [...prev, aiResponse])
      saveChatHistory(userMessage, aiResponse)
      
      // Clear uploaded files
      setUploadedFiles([])
      
      showSnackbar("Grading completed successfully", "success")
    } catch (error) {
      console.error("Error processing grading:", error)
      setGradingError(`Grading failed: ${error.message}`)
      
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: `I encountered an error while grading: ${error.message}. Please try again or check if all required documents are uploaded.`,
          role: "assistant",
          isError: true,
        },
      ])
      
      showSnackbar("Grading failed", "error")
    } finally {
      setIsTyping(false)
      setTypingText("")
      setIsGrading(false)
    }
  }

  // Handle grading request
  const handleGradingRequest = () => {
    processGrading()
  }

  const handleChatSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateChatInput()) {
      return;
    }
  
    // Stop speech recognition if it's active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
    }
  
    // Add user message
    const userMessage = {
      id: Date.now(),
      content: chatInput,
      role: "user",
      files: uploadedFiles,
    };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setUploadedFiles([]);
    setShowSuggestions(false);
  
    // Show typing indicator
    setIsTyping(true);
    setTypingText(""); // Clear any previous typing text
  
    try {
      // Make API call to your backend
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: userMessage.content,
        userId: auth.currentUser?.uid,
        files: uploadedFiles.length > 0 ? uploadedFiles.map(file => file.name) : [],
        history: messages.slice(-6) // Send last 6 messages for context
      });
  
      // Add AI response
      const aiResponse = {
        id: Date.now() + 1,
        content: response.data.text,
        role: "assistant",
      };
      setMessages((prev) => [...prev, aiResponse]);
      
      // Save to chat history
      saveChatHistory(userMessage, aiResponse);
      showSnackbar("Response received", "success");
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          role: "assistant",
          isError: true,
        },
      ]);
      showSnackbar("Error generating response", "error");
    } finally {
      setIsTyping(false);
      setTypingText("");
    }
  }; 
  // Enhanced getAIResponse function that recognizes grading requests
  const getAIResponse = (input, files) => {
    // Check if this is a grading-related query
    if (input.toLowerCase().includes("grade") || 
        input.toLowerCase().includes("check") || 
        input.toLowerCase().includes("review") || 
        input.toLowerCase().includes("evaluate")) {
      if (files.length > 0) {
        return "I'll analyze these documents and provide a detailed grading report."
      } else {
        return "I can help you grade documents. Please upload question papers, answer sheets, or solution papers to begin."
      }
    }

    // Handle files
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

    // Regular queries
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
          showSnackbar(
            `Some files exceed the 10MB size limit: ${oversizedFiles.map((f) => f.name).join(", ")}`,
            "error",
          )
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

  const handleResourceFileUpload = (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]

        // Check file size (limit to 50MB)
        if (file.size > 50 * 1024 * 1024) {
          showSnackbar(`File exceeds the 50MB size limit`, "error")
          return
        }

        // Update new resource data with file
        setNewResourceData((prev) => ({
          ...prev,
          file: file,
          size: formatFileSize(file.size),
        }))
        showSnackbar("File selected successfully", "success")
      }
    } catch (error) {
      console.error("Error selecting resource file:", error)
      showSnackbar("Failed to process selected file", "error")
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
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
        return <Chip icon={<PendingActionsIcon />} label="Pending Review" size="small" color="warning" variant="outlined" />
      case "not_submitted":
        return <Chip icon={<CancelIcon />} label="Not Submitted" size="small" color="error" variant="outlined" />
      default:
        return null
    }
  }

  const saveChatHistory = async (message, response) => {
    if (!auth.currentUser) return
  
    try {
      // Function to safely sanitize objects by removing File objects
      const sanitizeForFirestore = (obj) => {
        // Create a deep copy we can modify
        const sanitized = { ...obj };
        
        // If the object has files property that contains File objects, replace with metadata
        if (sanitized.files && Array.isArray(sanitized.files)) {
          sanitized.files = sanitized.files.map(file => {
            // If it's a File object
            if (file instanceof File || (file && typeof file === 'object' && file.name && file.type)) {
              return {
                name: file.name,
                type: file.type,
                size: file.size || 0,
                lastModified: file.lastModified || Date.now()
              };
            }
            return file; // If it's already sanitized or is just a string path
          });
        }
        
        return sanitized;
      };
  
      // Sanitize both message and response
      const sanitizedMessage = sanitizeForFirestore(message);
      const sanitizedResponse = sanitizeForFirestore(response);
  
      const chatHistoryRef = collection(db, "teachers", auth.currentUser.uid, "chatHistory")
      const newChatEntry = {
        title: message.content.substring(0, 50) + (message.content.length > 50 ? "...": ""),
        time: new Date().toISOString(),
        messages: [sanitizedMessage, sanitizedResponse],
        createdAt: new Date(),
      }
      
      await addDoc(chatHistoryRef, newChatEntry)
  
      // Update local chat history
      setChatHistory((prev) => [newChatEntry, ...prev])
      
      console.log("Chat history saved successfully");
    } catch (error) {
      console.error("Error saving chat history:", error)
      showSnackbar("Failed to save chat history", "error")
    }
  }

  const showSnackbar = (message, severity = "info") => {
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
        document.getElementById("search-input")?.focus()
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
    showSnackbar(`${darkMode ? "Light" : "Dark"} mode enabled`, "info")
  }

  const handlePinMessage = (message) => {
    setPinnedMessages((prev) => [...prev, message])
    showSnackbar("Message pinned", "success")
  }

  const handleUnpinMessage = (messageId) => {
    setPinnedMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    showSnackbar("Message unpinned", "info")
  }

  const togglePinnedMessages = () => {
    setShowPinned(!showPinned)
  }

  const handleResourceMenuOpen = (event, resource) => {
    setResourceMenuAnchorEl(event.currentTarget)
    setSelectedResource(resource)
  }

  const handleResourceMenuClose = () => {
    setResourceMenuAnchorEl(null)
  }

  const toggleResourceViewMode = () => {
    setResourceViewMode((prev) => (prev === "grid" ? "list" : "grid"))
  }

  const handleResourceSortChange = (sortBy) => {
    if (resourceSortBy === sortBy) {
      // Toggle direction if same sort field is selected
      setResourceSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setResourceSortBy(sortBy)
      setResourceSortDirection("desc") // Default to descending for new sort field
    }
  }

  const handleResourceFilterTypeChange = (event) => {
    setResourceFilterType(event.target.value)
  }

  const handleResourceFilterSubjectChange = (event) => {
    setResourceFilterSubject(event.target.value)
  }

  const handleResourceUploadDialogOpen = () => {
    setShowResourceUploadDialog(true)
  }

  const handleResourceUploadDialogClose = () => {
    setShowResourceUploadDialog(false)
    // Reset form data
    setNewResourceData({
      title: "",
      type: "document",
      subject: "",
      description: "",
      file: null,
      shared: true,
    })
    setResourceUploadProgress(0)
    setIsResourceUploading(false)
  }

  const handleResourceDetailDialogOpen = (resource) => {
    setSelectedResource(resource)
    setShowResourceDetailDialog(true)
  }

  const handleResourceDetailDialogClose = () => {
    setShowResourceDetailDialog(false)
  }

  const handleNewResourceInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewResourceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleResourceUpload = () => {
    // Validate form
    if (!newResourceData.title.trim()) {
      showSnackbar("Please enter a resource title", "error")
      return
    }

    if (!newResourceData.subject.trim()) {
      showSnackbar("Please enter a subject", "error")
      return
    }

    if (!newResourceData.file) {
      showSnackbar("Please select a file to upload", "error")
      return
    }

    // Simulate upload process
    setIsResourceUploading(true)

    const uploadInterval = setInterval(() => {
      setResourceUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          // Add new resource to the list
          const newResource = {
            id: `r${resources.length + 1}`,
            title: newResourceData.title,
            type: newResourceData.type,
            subject: newResourceData.subject,
            description: newResourceData.description || `${newResourceData.title} for ${newResourceData.subject} class`,
            dateAdded: new Date().toISOString().split("T")[0],
            size: newResourceData.size || formatFileSize(newResourceData.file.size),
            downloads: 0,
            shared: newResourceData.shared,
            thumbnail: null,
          }

          setResources((prev) => [newResource, ...prev])
          // Close dialog and show success message
          setTimeout(() => {
            setIsResourceUploading(false)
            handleResourceUploadDialogClose()
            showSnackbar("Resource uploaded successfully", "success")
          }, 500)

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleResourceDelete = (resourceId) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setResources((prev) => prev.filter((r) => r.id !== resourceId))
      showSnackbar("Resource deleted successfully", "success")
    }
  }

  const handleResourceShareToggle = (resourceId) => {
    setResources((prev) => prev.map((r) => (r.id === resourceId ? { ...r, shared: !r.shared } : r)))
    const resource = resources.find((r) => r.id === resourceId)
    showSnackbar(`Resource ${resource?.shared ? "unshared" : "shared"} successfully`, "success")
  }

  const handleResourceDownload = (resource) => {
    // Simulate download
    showSnackbar(`Downloading ${resource.title}...`, "info")
    // Update download count
    setResources((prev) => prev.map((r) => (r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r)))
    setTimeout(() => {
      showSnackbar(`${resource.title} downloaded successfully`, "success")
    }, 1500)
  }

  const renderAIAssistantView = () => (
    <Box sx={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">AI Teaching Assistant</Typography>
          <Box>
            <Tooltip title="Pinned messages">
              <IconButton onClick={togglePinnedMessages} color={showPinned ? "primary" : "default"}>
                <BookmarkIcon />
                {pinnedMessages.length > 0 && (
                  <Badge
                    color="primary"
                    badgeContent={pinnedMessages.length}
                    sx={{ position: "absolute", top: 0, right: 0 }}
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
          <Paper variant="outlined" sx={{ mb: 2, p: 1, maxHeight: "150px", overflow: "auto" }}>
            <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
              Pinned Messages
            </Typography>
            {pinnedMessages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {message.content.substring(0, 50)}...
                </Typography>
                <IconButton size="small" onClick={() => handleUnpinMessage(message.id)} sx={{ p: 0.5 }}>
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
                onPin={handlePinMessage}
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 1 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    clickable
                    color="primary"
                    variant="outlined"
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Fade>
        )}

        {/* Uploaded Files Display with Grading Button */}
        {uploadedFiles.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle2">Uploaded Files</Typography>
              <GradientButton
                size="small"
                startIcon={<AssessmentIcon />}
                onClick={handleGradingRequest}
                disabled={isGrading}
              >
                {isGrading ? "Grading..." : "Grade Documents"}
              </GradientButton>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
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
            {gradingError && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                {gradingError}
              </Typography>
            )}
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
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
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
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
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
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
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
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.3s ease",
                  "&.Mui-focused": {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
                  },
                },
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
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isListening ? "rgba(211, 47, 47, 0.2)" : "rgba(25, 118, 210, 0.1)",
                      transform: "scale(1.1)",
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
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateX(-5px)",
              },
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
                        <TableRow
                          key={student.id}
                          sx={{
                            transition: "background-color 0.2s ease",
                            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <AnimatedAvatar sx={{ mr: 1, width: 28, height: 28 }}>
                                {student.name.charAt(0)}
                              </AnimatedAvatar>
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
                        <TableRow
                          key={assignment.id}
                          sx={{
                            transition: "background-color 0.2s ease",
                            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                          }}
                        >
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
                  <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                    <MenuItem onClick={() => handleFilterSelect("all")} selected={selectedFilter === "all"}>
                      All Grades
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect("high")} selected={selectedFilter === "high"}>
                      High Scores (80%+)
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterSelect("low")} selected={selectedFilter === "low"}>
                      Low Scores (Below 70%)
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleFilterSelect("incomplete")}
                      selected={selectedFilter === "incomplete"}
                    >
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
                        <TableRow
                          key={grade.id}
                          sx={{
                            transition: "background-color 0.2s ease",
                            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                          }}
                        >
                          <TableCell>{grade.assignment}</TableCell>
                          <TableCell>{grade.class}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${grade.avgScore}%`}
                              color={grade.avgScore >= 80 ? "success" : grade.avgScore >= 70 ? "warning" : "error"}
                              sx={{
                                fontWeight: "bold",
                                transition: "all 0.2s ease",
                                "&:hover": { transform: "scale(1.05)" },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {grade.submissions}/{grade.total}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                sx={{
                                  transition: "all 0.2s ease",
                                  "&:hover": { transform: "scale(1.1)" },
                                }}
                              >
                                <DescriptionIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Analytics">
                              <IconButton
                                size="small"
                                sx={{
                                  transition: "all 0.2s ease",
                                  "&:hover": { transform: "scale(1.1)" },
                                }}
                              >
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
                            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
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
                <GradientButton variant="contained" size="small" startIcon={<AddIcon />} sx={{ mr: 1 }}>
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
                      <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={500}>
                        <StyledCard
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
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
                                  e.stopPropagation()
                                  // Handle more options
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            }
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                              <Chip size="small" label={`Code: ${classItem.code}`} color="primary" variant="outlined" />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {classItem.assignments?.length || 0} assignments
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                Class Progress:
                              </Typography>
                              <ProgressIndicator variant="determinate" value={75} sx={{ flexGrow: 1 }} />
                            </Box>
                          </CardContent>
                          <Box sx={{ p: 2, pt: 0, mt: "auto" }}>
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

  const renderResourceManagementView = () => (
    <Box>
      <StyledCard sx={{ mb: 3 }}>
        <CardHeader
          title="Resource Management"
          subheader="Manage and share your teaching resources"
          action={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Upload New Resource">
                <GradientButton
                  variant="contained"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mr: 1 }}
                  onClick={handleResourceUploadDialogOpen}
                >
                  Upload Resource
                </GradientButton>
              </Tooltip>
              <Tooltip title={resourceViewMode === "grid" ? "List View" : "Grid View"}>
                <IconButton onClick={toggleResourceViewMode}>
                  {resourceViewMode === "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton onClick={handleFilterOpen}>
                  <FilterAltIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <CardContent>
          {/* Resource Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Total Resources"
                value={resources.length}
                subtitle="Across all subjects"
                icon={<LibraryBooksIcon />}
                trend={8}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Shared Resources"
                value={resources.filter((r) => r.shared).length}
                subtitle="Available to students"
                icon={<ShareIcon />}
                trend={5}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Total Downloads"
                value={resources.reduce((sum, r) => sum + r.downloads, 0)}
                subtitle="This month"
                icon={<DownloadIcon />}
                trend={12}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Storage Used"
                value="49.9 MB"
                subtitle="of 5 GB limit"
                icon={<StorageIcon />}
                trend={-3}
              />
            </Grid>
          </Grid>

          {/* Resource Filters */}
          <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="resource-type-filter-label">Type</InputLabel>
              <Select
                labelId="resource-type-filter-label"
                id="resource-type-filter"
                value={resourceFilterType}
                label="Type"
                onChange={handleResourceFilterTypeChange}
              >
                {uniqueResourceTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="resource-subject-filter-label">Subject</InputLabel>
              <Select
                labelId="resource-subject-filter-label"
                id="resource-subject-filter"
                value={resourceFilterSubject}
                label="Subject"
                onChange={handleResourceFilterSubjectChange}
              >
                {uniqueSubjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject === "all" ? "All Subjects" : subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="resource-sort-label">Sort By</InputLabel>
              <Select
                labelId="resource-sort-label"
                id="resource-sort"
                value={resourceSortBy}
                label="Sort By"
                onChange={(e) => handleResourceSortChange(e.target.value)}
              >
                <MenuItem value="dateAdded">Date Added</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="subject">Subject</MenuItem>
                <MenuItem value="downloads">Downloads</MenuItem>
                <MenuItem value="size">Size</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title={`Sort ${resourceSortDirection === "asc" ? "Ascending" : "Descending"}`}>
              <IconButton
                onClick={() => setResourceSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                color={resourceSortDirection === "asc" ? "default" : "primary"}
              >
                <SortIcon />
              </IconButton>
            </Tooltip>

            <TextField
              size="small"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: "auto", width: { xs: "100%", sm: 200 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Resources Display */}
          {filteredAndSortedResources.length === 0 ? (
            <EmptyState
              icon={<LibraryBooksIcon sx={{ fontSize: 60 }} />}
              title="No Resources Found"
              description={
                searchQuery
                  ? "No resources match your search criteria. Try adjusting your filters or search terms."
                  : "You haven't added any resources yet. Upload your first resource to get started."
              }
              actionButton={
                <GradientButton
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2 }}
                  onClick={handleResourceUploadDialogOpen}
                >
                  Upload Your First Resource
                </GradientButton>
              }
            />
          ) : resourceViewMode === "grid" ? (
            <Grid container spacing={3}>
              {filteredAndSortedResources.map((resource) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
                  <ResourceCard>
                    <CardContent
                      sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
                    >
                      <IconContainer>
                        <ResourceTypeIcon type={resource.type} size="large" />
                      </IconContainer>
                      <Typography variant="h6" gutterBottom noWrap title={resource.title}>
                        {resource.title}
                      </Typography>
                      <Chip label={resource.subject} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, height: 40, overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {resource.description}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: "auto" }}>
                        <Typography variant="caption" color="text.secondary">
                          {resource.dateAdded}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {resource.size}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 1 }}>
                        <Chip
                          icon={<CloudDownloadIcon fontSize="small" />}
                          label={resource.downloads}
                          size="small"
                          variant="outlined"
                        />
                        <Switch
                          checked={resource.shared}
                          size="small"
                          onChange={() => handleResourceShareToggle(resource.id)}
                        />
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: "flex", justifyContent: "space-between" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleResourceDownload(resource)}
                      >
                        Download
                      </Button>
                      <IconButton size="small" onClick={(e) => handleResourceMenuOpen(e, resource)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </ResourceCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Date Added</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Downloads</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedResources.map((resource) => (
                    <TableRow
                      key={resource.id}
                      sx={{
                        transition: "background-color 0.2s ease",
                        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ResourceTypeIcon type={resource.type} />
                          <Typography sx={{ ml: 1 }}>{resource.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          size="small"
                          color={
                            resource.type === "document"
                              ? "primary"
                              : resource.type === "presentation"
                              ? "secondary"
                              : resource.type === "video"
                              ? "success"
                              : "default"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{resource.subject}</TableCell>
                      <TableCell>{resource.dateAdded}</TableCell>
                      <TableCell>{resource.size}</TableCell>
                      <TableCell>{resource.downloads}</TableCell>
                      <TableCell>
                        <Switch
                          checked={resource.shared}
                          size="small"
                          onChange={() => handleResourceShareToggle(resource.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              sx={{
                                transition: "all 0.2s ease",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                              onClick={() => handleResourceDownload(resource)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              sx={{
                                transition: "all 0.2s ease",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              sx={{
                                transition: "all 0.2s ease",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                              onClick={() => handleResourceDelete(resource.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </StyledCard>

      {/* Resource Menu */}
      <Menu anchorEl={resourceMenuAnchorEl} open={Boolean(resourceMenuAnchorEl)} onClose={handleResourceMenuClose}>
        <MenuItem
          onClick={() => {
            handleResourceDetailDialogOpen(selectedResource)
            handleResourceMenuClose()
          }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleResourceDownload(selectedResource)
            handleResourceMenuClose()
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleResourceShareToggle(selectedResource?.id)
            handleResourceMenuClose()
          }}
        >
          <ListItemIcon>
            {selectedResource?.shared ? <VisibilityOffIcon fontSize="small" /> : <ShareIcon fontSize="small" />}
          </ListItemIcon>
          {selectedResource?.shared ? "Unshare" : "Share"}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleResourceDelete(selectedResource?.id)
            handleResourceMenuClose()
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Resource Upload Dialog */}
      <Dialog open={showResourceUploadDialog} onClose={handleResourceUploadDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Resource</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              name="title"
              label="Resource Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newResourceData.title}
              onChange={handleNewResourceInputChange}
              required
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel id="resource-type-label">Resource Type</InputLabel>
              <Select
                labelId="resource-type-label"
                name="type"
                value={newResourceData.type}
                label="Resource Type"
                onChange={handleNewResourceInputChange}
              >
                <MenuItem value="document">Document</MenuItem>
                <MenuItem value="presentation">Presentation</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="quiz">Quiz</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              name="subject"
              label="Subject"
              type="text"
              fullWidth
              variant="outlined"
              value={newResourceData.subject}
              onChange={handleNewResourceInputChange}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              name="description"
              label="Description"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={newResourceData.description}
              onChange={handleNewResourceInputChange}
              sx={{ mb: 2 }}
            />

            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                p: 3,
                textAlign: "center",
                mb: 2,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
              onClick={() => resourceFileInputRef.current?.click()}
            >
              {newResourceData.file ? (
                <Box>
                  <Typography variant="body2" color="primary" gutterBottom>
                    {newResourceData.file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(newResourceData.file.size)}
                  </Typography>
                </Box>
              ) : (
                <>
                  <CloudUploadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    Click to select a file or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports documents, presentations, videos, PDFs, and images (max 50MB)
                  </Typography>
                </>
              )}
              <input
                type="file"
                hidden
                ref={resourceFileInputRef}
                onChange={handleResourceFileUpload}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mov"
              />
            </Box>

            <FormControlLabel
              control={
                <Switch checked={newResourceData.shared} onChange={handleNewResourceInputChange} name="shared" />
              }
              label="Share with students"
            />

            {isResourceUploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Uploading: {resourceUploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={resourceUploadProgress} />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResourceUploadDialogClose} disabled={isResourceUploading}>
            Cancel
          </Button>
          <GradientButton
            onClick={handleResourceUpload}
            disabled={
              isResourceUploading || !newResourceData.title || !newResourceData.subject || !newResourceData.file
            }
            startIcon={isResourceUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
          >
            {isResourceUploading ? "Uploading..." : "Upload Resource"}
            </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Resource Detail Dialog */}
      <Dialog open={showResourceDetailDialog} onClose={handleResourceDetailDialogClose} maxWidth="md" fullWidth>
        {selectedResource && (
          <>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ResourceTypeIcon type={selectedResource.type} size="large" sx={{ mr: 1 }} />
                {selectedResource.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedResource.description}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Type
                        </Typography>
                        <Typography variant="body1">
                          {selectedResource.type.charAt(0).toUpperCase() + selectedResource.type.slice(1)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Subject
                        </Typography>
                        <Typography variant="body1">{selectedResource.subject}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Date Added
                        </Typography>
                        <Typography variant="body1">{selectedResource.dateAdded}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Size
                        </Typography>
                        <Typography variant="body1">{selectedResource.size}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Downloads
                        </Typography>
                        <Typography variant="body1">{selectedResource.downloads}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Typography variant="body1">
                          {selectedResource.shared ? "Shared with students" : "Private"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Actions
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{ mb: 2 }}
                      onClick={() => handleResourceDownload(selectedResource)}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={selectedResource.shared ? <VisibilityOffIcon /> : <ShareIcon />}
                      fullWidth
                      sx={{ mb: 2 }}
                      onClick={() => handleResourceShareToggle(selectedResource.id)}
                    >
                      {selectedResource.shared ? "Unshare" : "Share"}
                    </Button>
                    <Button variant="outlined" startIcon={<EditIcon />} fullWidth sx={{ mb: 2 }}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      fullWidth
                      onClick={() => {
                        handleResourceDelete(selectedResource.id)
                        handleResourceDetailDialogClose()
                      }}
                    >
                      Delete
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleResourceDetailDialogClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )

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
                  "& .MuiOutlinedInput-root": {
                    transition: "all 0.3s ease",
                    "&.Mui-focused": {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
                    },
                  },
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
      case "resource-management":
        return renderResourceManagementView()
      case "settings":
        return renderSettingsView()
      default:
        return renderAIAssistantView()
    }
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
              <Typography paragraph>Go to{" "}
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
              <Typography paragraph>Then go to{" "}
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
        <Box sx={{ position: "relative", mb: 4 }}>
          <CircularProgress size={60} thickness={4} />
          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            GradeGood
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1 }}>
          Loading teacher dashboard...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we fetch your data.
        </Typography>
        <Box sx={{ width: "200px", mt: 3 }}>
          <LinearProgress color="primary" />
        </Box>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <Box sx={{ display: "flex" }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "rotate(180deg)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                background: "linear-gradient(45deg, #fff, #f0f0f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
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
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(255, 255, 255, 0.7)",
                      opacity: 1,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton size="small" onClick={toggleSearch} sx={{ color: "white" }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </Fade>
            )}

            <Tooltip title="Search">
              <IconButton color="inherit" onClick={toggleSearch} sx={{ display: showSearch ? "none" : "flex" }}>
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
                  cursor: "pointer",
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
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    handleViewChange("settings")
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem onClick={toggleDarkMode}>
                  <ListItemIcon>
                    {darkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                  </ListItemIcon>
                  {darkMode ? "Light Mode" : "Dark Mode"}
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
              boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              color: "white",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              GradeGood
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={activeView === "ai-assistant"}
                onClick={() => handleViewChange("ai-assistant")}
                sx={{
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
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
                selected={activeView === "classroom"}
                onClick={() => handleViewChange("classroom")}
                sx={{
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
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
                selected={activeView === "resource-management"}
                onClick={() => handleViewChange("resource-management")}
                sx={{
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemIcon>
                  <LibraryBooksIcon color={activeView === "resource-management" ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText primary="Resources" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={activeView === "settings"}
                onClick={() => handleViewChange("settings")}
                sx={{
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    borderRight: `3px solid ${theme.palette.primary.main}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemIcon>
                  <SettingsIcon color={activeView === "settings" ? "primary" : "inherit"} />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleChatHistoryToggle}
                sx={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
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
                        transition: "all 0.2s ease",
                        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                      }}
                    >
                      <ListItemText
                        primary={chat.title}
                        secondary={new Date(chat.time).toLocaleString()}
                        primaryTypographyProps={{ color: "text.secondary", fontSize: "0.875rem" }}
                        secondaryTypographyProps={{ color: "text.secondary", fontSize: "0.75rem" }}
                        style={{ maxWidth: "180px" }}
                        noWrap
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
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.05),
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.error.main,
                  },
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
              <Alert severity="warning" sx={{ mb: 3 }}>
                You are currently offline. Some features may be limited until you reconnect.
                <Button color="inherit" size="small">
                  Retry
                </Button>
              </Alert>
            </Fade>
          )}
          {error && (
            <Fade in={Boolean(error)}>
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Fade>
          )}
          {renderContent()}
        </Main>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
        
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
      </Box>
    </ThemeProvider>
  );
};

export default TeacherDashboard;