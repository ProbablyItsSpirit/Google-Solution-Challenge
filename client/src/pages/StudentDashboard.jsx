import React, { useState, useEffect } from "react";
import { getUserData, getClasses, getAssignments, submitAssignment, sendChatMessage, getChatHistory } from '../services/api';

<<<<<<< Updated upstream
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  Box,
  ListItemButton,
  Container,
=======
import React, { useState, useEffect } from "react"
import { getClasses, getAssignments, submitAssignment, sendChatMessage, getChatHistory } from "../services/api"

import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import {
  Box,
  ListItemButton,
>>>>>>> Stashed changes
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
<<<<<<< Updated upstream
} from "@mui/material";
=======
  CircularProgress,
  Tabs,
  Tab,
  Tooltip,
  Collapse,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  useMediaQuery,
  Menu,
} from "@mui/material"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
} from "@mui/icons-material";
=======
  CalendarToday,
  TrendingUp,
  Person,
  MoreVert,
  Search,
  FilterList,
  Sort,
  Refresh,
  BarChart,
  Timeline,
  BookmarkBorder,
  InsertDriveFile,
  Close,
  ExpandMore,
  ExpandLess,
  Help,
  Settings,
  Visibility,
  AccessTime,
  NotificationsActive,
  NotificationsOff,
  FilterAlt,
  Download,
  Add,
  Description,
  Folder,
  FolderOpen,
  Event,
  Group,
  CommentBank,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { motion, AnimatePresence } from "framer-motion"

// Styled components for enhanced UI
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))

const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
}))

const AnimatedListItem = styled(ListItem)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    transform: "scale(1.02)",
  },
}))

// Add new styled components for enhanced UI
const ClassBanner = styled(Box)(({ theme }) => ({
  height: 120,
  borderRadius: theme.shape.borderRadius,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
  },
}))
>>>>>>> Stashed changes

const StudentDashboard = () => {
  const [user, setUser] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

<<<<<<< Updated upstream


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
=======
  const [uploadsLoading, setUploadsLoading] = useState(false)
  const [uploadsError, setUploadsError] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [viewMode, setViewMode] = useState("overview")
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [fileToUpload, setFileToUpload] = useState(null)
  const [selectedClassId, setSelectedClassId] = useState("")
  const [classes, setClasses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false)
  const [submittedFileName, setSubmittedFileName] = useState("")
  const [submittedClassName, setSubmittedClassName] = useState("")
  const [aiResponding, setAiResponding] = useState(false)
  const [calendarView, setCalendarView] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [darkMode, setDarkMode] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null)
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null)
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Assignment Graded",
      message: "Your Math 101 assignment has been graded.",
      time: "2 hours ago",
      read: false,
    },
    { id: 2, title: "New Assignment", message: "New assignment added to Physics 202.", time: "1 day ago", read: false },
    {
      id: 3,
      title: "Deadline Reminder",
      message: "Computer Science 301 assignment due tomorrow.",
      time: "3 days ago",
      read: true,
    },
  ])

  // New state variables for enhanced features
  const [classFilterValue, setClassFilterValue] = useState("all")
  const [assignmentSortValue, setAssignmentSortValue] = useState("dueDate")
  const [assignmentFilterValue, setAssignmentFilterValue] = useState("all")
  const [classView, setClassView] = useState("grid") // grid or list
  const [classDetailsTab, setClassDetailsTab] = useState(0)
  const [classmates, setClassmates] = useState([])
  const [classAnnouncements, setClassAnnouncements] = useState([])
  const [classResources, setClassResources] = useState([])
  const [assignmentComments, setAssignmentComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [showPastAssignments, setShowPastAssignments] = useState(false)
  const [createAssignmentDialogOpen, setCreateAssignmentDialogOpen] = useState(false)
  const [newAssignmentData, setNewAssignmentData] = useState({
    title: "",
    description: "",
    dueDate: "",
    classId: "",
  })

  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
>>>>>>> Stashed changes

  // Load user data and fetch all required data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || "Student User",
          photoURL: currentUser.photoURL || "https://placekitten.com/64/64",
        })

        fetchAllData(currentUser.uid)
      } else {
        navigate("/")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  // Function to fetch all data from backend
  const fetchAllData = async (userId) => {
    try {
      setLoading(true)
      setError(null)
      setUploadsLoading(true)
      setUploadsError(null)

      // Fetch all data in parallel for better performance
      const promises = [
        getClasses(userId).catch((err) => {
          console.error("Error fetching classes:", err)
          return []
        }),
        getAssignments(userId).catch((err) => {
          console.error("Error fetching assignments:", err)
          return []
        }),
        getChatHistory(userId).catch((err) => {
          console.error("Error fetching chat history:", err)
          return []
        }),
      ]

      const [classesData, assignmentsData, chatHistory] = await Promise.all(promises)

      // Set the data states
      setClasses(Array.isArray(classesData) ? classesData : [])
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : [])
      setChatMessages(Array.isArray(chatHistory) ? chatHistory : [])

      // Mock data for new features
      setClassmates([
        {
          id: 1,
          name: "Alex Johnson",
          photoURL: "https://placekitten.com/100/100",
          email: "alex@example.com",
          role: "Student",
        },
        {
          id: 2,
          name: "Jamie Smith",
          photoURL: "https://placekitten.com/101/101",
          email: "jamie@example.com",
          role: "Student",
        },
        {
          id: 3,
          name: "Taylor Brown",
          photoURL: "https://placekitten.com/102/102",
          email: "taylor@example.com",
          role: "Student",
        },
        {
          id: 4,
          name: "Morgan Davis",
          photoURL: "https://placekitten.com/103/103",
          email: "morgan@example.com",
          role: "Student",
        },
      ])

      setClassAnnouncements([
        {
          id: 1,
          title: "Midterm Exam Date",
          content: "The midterm exam will be held on October 15th. Please prepare chapters 1-5.",
          date: "2023-09-30",
          author: "Dr. Williams",
        },
        {
          id: 2,
          title: "Group Project Teams",
          content: "Group project teams have been assigned. Check the resources section for your team assignment.",
          date: "2023-09-25",
          author: "Dr. Williams",
        },
        {
          id: 3,
          title: "Office Hours Change",
          content: "Office hours will be moved to Thursdays 2-4pm starting next week.",
          date: "2023-09-20",
          author: "Dr. Williams",
        },
      ])

      setClassResources([
        { id: 1, title: "Course Syllabus", type: "pdf", size: "245 KB", uploadDate: "2023-08-30", url: "#" },
        { id: 2, title: "Lecture Slides Week 1", type: "pptx", size: "1.2 MB", uploadDate: "2023-09-05", url: "#" },
        { id: 3, title: "Textbook Chapter 1", type: "pdf", size: "3.5 MB", uploadDate: "2023-09-05", url: "#" },
        { id: 4, title: "Lab Assignment Guidelines", type: "docx", size: "350 KB", uploadDate: "2023-09-10", url: "#" },
        { id: 5, title: "Group Project Requirements", type: "pdf", size: "420 KB", uploadDate: "2023-09-25", url: "#" },
      ])

      setAssignmentComments([
        {
          id: 1,
          author: "Dr. Williams",
          authorRole: "Teacher",
          photoURL: "https://placekitten.com/64/64",
          content: "Great work on the first part, but please review your approach to question 3.",
          timestamp: "2023-10-01T14:30:00",
        },
        {
          id: 2,
          author: "You",
          authorRole: "Student",
          photoURL: user?.photoURL || "https://placekitten.com/64/64",
          content: "Thank you for the feedback. I'll revise question 3 and resubmit.",
          timestamp: "2023-10-01T15:45:00",
        },
      ])

      // Show success message
      showSnackbar("Data loaded successfully", "success")
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to fetch data. Please try again.")
      showSnackbar("Failed to load data", "error")
    } finally {
      setLoading(false)
      setUploadsLoading(false)
    }
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setSelectedAssignment(null)
    setSelectedClass(null)
    setViewMode("overview")

    // Close drawer on mobile after tab change
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment)
    setViewMode("assignment")
  }

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem)
    setViewMode("class")
    setClassDetailsTab(0) // Reset to first tab when selecting a class
  }

  const handleBackToOverview = () => {
    setViewMode("overview")
    setSelectedAssignment(null)
    setSelectedClass(null)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        // Add user's message to the chat
        const newMsg = {
          id: chatMessages.length + 1,
          sender: "user",
          message: newMessage,
          timestamp: new Date().toISOString(),
        }
        setChatMessages([...chatMessages, newMsg])
        setNewMessage("")

        // Show AI is responding
        setAiResponding(true)

        // Send message to the backend
        const aiResponse = await sendChatMessage(user.uid, newMessage)

        // Add AI response to chat
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "ai",
            message: aiResponse?.message || "I'm processing your request. How can I help with your studies?",
            timestamp: new Date().toISOString(),
          },
        ])
      } catch (error) {
        console.error("Error sending message:", error)

        // Add error message to chat
        setChatMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "ai",
            message: "Sorry, I'm having trouble connecting. Please try again later.",
            timestamp: new Date().toISOString(),
          },
        ])

        showSnackbar("Failed to send message", "error")
      } finally {
        setAiResponding(false)
      }
    }
  }

  const handleFileChange = (event) => {
    setFileToUpload(event.target.files[0])
    showSnackbar(`File "${event.target.files[0].name}" selected`, "info")
  }

  const handleFileUpload = async () => {
    if (fileToUpload && selectedClassId) {
      try {
        setUploadsLoading(true)
        // Find the class name for the dialog
        const selectedClass = classes.find((c) => c.id === selectedClassId)
        const className = selectedClass ? selectedClass.name : "Selected Class"

        // Upload the file to the backend
        await submitAssignment(user.uid, selectedClassId, fileToUpload)

        // Show confirmation dialog
        setSubmittedFileName(fileToUpload.name)
        setSubmittedClassName(className)
        setConfirmDialogOpen(true)

        // Clear the file input
        setFileToUpload(null)
        setSelectedClassId("")

        // Refresh assignments
        const updatedAssignments = await getAssignments(user.uid)
        setAssignments(updatedAssignments)

        showSnackbar(`Assignment submitted to ${className} successfully`, "success")
      } catch (error) {
        console.error("Error uploading file:", error)
        setUploadsError("Failed to upload file. Please try again.")
        showSnackbar("Failed to upload assignment", "error")
      } finally {
        setUploadsLoading(false)
      }
    } else {
      showSnackbar("Please select a file and a class", "warning")
    }
  }

  const handleCloseSubmissionDialog = () => {
    setSubmissionDialogOpen(false)
  }

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/")
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAllData(user?.uid)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you would apply the theme change here
    showSnackbar(`${darkMode ? "Light" : "Dark"} mode enabled`, "info")
  }

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null)
  }

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null)
  }

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortClose = () => {
    setSortAnchorEl(null)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleExpandAssignment = (assignmentId) => {
    setExpandedAssignmentId(expandedAssignmentId === assignmentId ? null : assignmentId)
  }

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setNotificationCount(0)
    handleNotificationsClose()
    showSnackbar("All notifications marked as read", "success")
  }

  const handleClearNotifications = () => {
    setNotifications([])
    setNotificationCount(0)
    handleNotificationsClose()
    showSnackbar("All notifications cleared", "info")
  }

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "graded":
        return theme.palette.success.main
      case "pending":
        return theme.palette.warning.main
      case "not_submitted":
        return theme.palette.error.main
      default:
        return theme.palette.text.secondary
    }
  }

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
            sx={{
              transition: "all 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        )
      case "pending":
        return (
          <Chip
            icon={<PendingActions />}
            label="Pending"
            size="small"
            color="warning"
            variant="outlined"
            sx={{
              transition: "all 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        )
      case "not_submitted":
        return (
          <Chip
            icon={<Cancel />}
            label="Not Submitted"
            size="small"
            color="error"
            variant="outlined"
            sx={{
              transition: "all 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        )
      default:
        return null
    }
  }

  // Filter assignments based on search query and filter value
  const filteredAssignments = assignments.filter((assignment) => {
    // First apply search filter
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.className.toLowerCase().includes(searchQuery.toLowerCase())

    // Then apply status filter
    const matchesFilter =
      assignmentFilterValue === "all" ||
      (assignmentFilterValue === "graded" && assignment.status === "graded") ||
      (assignmentFilterValue === "pending" && assignment.status === "pending") ||
      (assignmentFilterValue === "not_submitted" && assignment.status === "not_submitted")

    // Apply past assignments filter
    const isPastDue = new Date(assignment.dueDate) < new Date()
    if (!showPastAssignments && isPastDue && assignment.status !== "not_submitted") {
      return false
    }

    return matchesSearch && matchesFilter
  })

  // Sort assignments based on sort value
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (assignmentSortValue) {
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate)
      case "dueDateDesc":
        return new Date(b.dueDate) - new Date(a.dueDate)
      case "gradeDesc":
        if (a.status !== "graded") return 1
        if (b.status !== "graded") return -1
        return b.grade - a.grade
      case "gradeAsc":
        if (a.status !== "graded") return 1
        if (b.status !== "graded") return -1
        return a.grade - b.grade
      case "title":
        return a.title.localeCompare(b.title)
      case "class":
        return a.className.localeCompare(b.className)
      default:
        return new Date(a.dueDate) - new Date(b.dueDate)
    }
  })

  // Filter classes based on search query
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  // Check if a deadline is approaching (within 3 days)
  const isDeadlineSoon = (dueDate) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 3
  }

  // Handle adding a comment to an assignment
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: assignmentComments.length + 1,
        author: user?.displayName || "You",
        authorRole: "Student",
        photoURL: user?.photoURL || "https://placekitten.com/64/64",
        content: newComment,
        timestamp: new Date().toISOString(),
      }

      setAssignmentComments([...assignmentComments, comment])
      setNewComment("")
      showSnackbar("Comment added successfully", "success")
    }
  }

  // Handle creating a new assignment request
  const handleCreateAssignment = () => {
    // In a real app, this would send the data to the backend
    showSnackbar("Assignment request submitted", "success")
    setCreateAssignmentDialogOpen(false)
    setNewAssignmentData({
      title: "",
      description: "",
      dueDate: "",
      classId: "",
    })
  }

  const drawer = (
    <Box
      sx={{
        width: 250,
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#fff",
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          GradeGood
        </Typography>
      </Box>
      <Divider />
      <List>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton selected={activeTab === 0} onClick={() => handleTabChange(null, 0)}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton selected={activeTab === 1} onClick={() => handleTabChange(null, 1)}>
            <ListItemIcon>
              <School />
            </ListItemIcon>
            <ListItemText primary="Classes" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton selected={activeTab === 2} onClick={() => handleTabChange(null, 2)}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Assignments" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton selected={activeTab === 3} onClick={() => handleTabChange(null, 3)}>
            <ListItemIcon>
              <Grade />
            </ListItemIcon>
            <ListItemText primary="Grades" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton selected={activeTab === 4} onClick={() => handleTabChange(null, 4)}>
            <ListItemIcon>
              <Chat />
            </ListItemIcon>
            <ListItemText primary="AI Assistant" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton selected={activeTab === 5} onClick={() => handleTabChange(null, 5)}>
            <ListItemIcon>
              <CloudUpload />
            </ListItemIcon>
            <ListItemText primary="Upload Work" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton selected={activeTab === 6} onClick={() => handleTabChange(null, 6)}>
            <ListItemIcon>
              <Event />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItemButton>
        </motion.div>
      </List>
      <Divider />
      <List>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton onClick={() => setSettingsDialogOpen(true)}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton onClick={() => setHelpDialogOpen(true)}>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </motion.div>
        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </motion.div>
      </List>
    </Box>
  )

  const renderAssignmentDetail = () => {
    if (!selectedAssignment) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={handleBackToOverview}
          sx={{
            mb: 2,
            transition: "all 0.2s ease-in-out",
            "&:hover": { transform: "translateX(-5px)" },
          }}
        >
          Back to All Assignments
        </Button>

        <Card
          sx={{
            mb: 3,
            boxShadow: 3,
            transition: "all 0.3s ease-in-out",
            "&:hover": { boxShadow: 6 },
          }}
        >
          <CardHeader
            title={
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {selectedAssignment.title}
              </Typography>
            }
            subheader={
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {selectedAssignment.className} • Due: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
                </Typography>
                <Box sx={{ ml: 2 }}>{getStatusChip(selectedAssignment.status)}</Box>
              </Box>
            }
            action={
              <Box sx={{ display: "flex" }}>
                <Tooltip title="Download Assignment">
                  <IconButton>
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Bookmark">
                  <IconButton>
                    <BookmarkBorder />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Submitted on: {new Date(selectedAssignment.submittedOn).toLocaleDateString()}
                </Typography>
                {selectedAssignment.status === "graded" && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                      Graded on: {new Date(selectedAssignment.gradedOn).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                      >
                        <Avatar src={selectedAssignment.teacherPfp} sx={{ width: 32, height: 32, mr: 1 }} />
                      </StyledBadge>
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Graded by: {selectedAssignment.teacherName}
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>
              {selectedAssignment.status === "graded" && (
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      position: "relative",
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Typography
                        variant="h2"
                        color="primary"
                        sx={{
                          fontWeight: 700,
                          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {selectedAssignment.grade}
                      </Typography>
                    </motion.div>
                    <Typography variant="h5" color="text.secondary" sx={{ ml: 1 }}>
                      / 100
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Chip
                      label={`Class Average: ${selectedAssignment.classAverage}/100`}
                      variant="outlined"
                      color={selectedAssignment.grade > selectedAssignment.classAverage ? "success" : "default"}
                      icon={selectedAssignment.grade > selectedAssignment.classAverage ? <TrendingUp /> : null}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Assignment Description
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
              <Typography variant="body1" paragraph>
                {selectedAssignment.description ||
                  "Complete the assigned problems and submit your work by the due date. Make sure to show all your steps and reasoning."}
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                <Chip
                  icon={<Description />}
                  label="Assignment PDF"
                  variant="outlined"
                  onClick={() => {}}
                  sx={{ cursor: "pointer" }}
                />
                <Chip
                  icon={<InsertDriveFile />}
                  label="Submission Template"
                  variant="outlined"
                  onClick={() => {}}
                  sx={{ cursor: "pointer" }}
                />
              </Box>
            </Paper>

            {selectedAssignment.status === "graded" && (
              <>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Teacher Feedback
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
                  <Typography variant="body1" paragraph>
                    {selectedAssignment.feedback}
                  </Typography>
                </Paper>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  Detailed Breakdown
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 2 }}>
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
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                            transition: "background-color 0.2s ease-in-out",
                            "&:hover": { bgcolor: "action.selected" },
                          }}
                        >
                          <TableCell>{item.question}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body2" sx={{ mr: 1, fontWeight: "medium" }}>
                                {item.score}/{item.maxScore}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={(item.score / item.maxScore) * 100}
                                sx={{
                                  width: 100,
                                  borderRadius: 5,
                                  height: 8,
                                  bgcolor: "background.paper",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                  },
                                }}
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

            {/* New section: Assignment Discussion */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
              Discussion
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
              {assignmentComments.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  {assignmentComments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{
                        display: "flex",
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: comment.authorRole === "Teacher" ? "primary.lighter" : "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Avatar src={comment.photoURL} sx={{ mr: 2, width: 40, height: 40 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                              {comment.author}
                            </Typography>
                            <Chip
                              label={comment.authorRole}
                              size="small"
                              color={comment.authorRole === "Teacher" ? "primary" : "default"}
                              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{comment.content}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <CommentBank sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                  <Typography color="text.secondary">No comments yet</Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Add a comment or question..."
                  variant="outlined"
                  size="small"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  multiline
                  rows={2}
                />
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Post
                </Button>
              </Box>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => {
                  setActiveTab(5)
                  setSelectedClassId(selectedAssignment.classId)
                }}
              >
                Upload Revision
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Chat />}
                onClick={() => {
                  setActiveTab(4)
                  setNewMessage(`Help me with my ${selectedAssignment.title} assignment`)
                }}
              >
                Ask AI for Help
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderClassDetail = () => {
    if (!selectedClass) return null

    // Filter assignments for the selected class
    const classAssignments = assignments.filter((a) => a.classId === selectedClass.id)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={handleBackToOverview}
          sx={{
            mb: 2,
            transition: "all 0.2s ease-in-out",
            "&:hover": { transform: "translateX(-5px)" },
          }}
        >
          Back to All Classes
        </Button>

        <Card
          sx={{
            mb: 3,
            boxShadow: 3,
            transition: "all 0.3s ease-in-out",
            "&:hover": { boxShadow: 6 },
            overflow: "hidden",
          }}
        >
          <ClassBanner
            sx={{
              backgroundImage: `url(https://source.unsplash.com/random/1200x400?${selectedClass.name.split(" ").join(",")})`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                color: "white",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}>
                {selectedClass.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}>
                Teacher: {selectedClass.teacher} • Class Code: {selectedClass.code}
              </Typography>
            </Box>
          </ClassBanner>

          <Box sx={{ p: 0 }}>
            <Tabs
              value={classDetailsTab}
              onChange={(e, newValue) => setClassDetailsTab(newValue)}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  py: 2,
                },
              }}
            >
              <Tab label="Assignments" icon={<Assignment />} iconPosition="start" />
              <Tab label="Announcements" icon={<NotificationsActive />} iconPosition="start" />
              <Tab label="Resources" icon={<Folder />} iconPosition="start" />
              <Tab label="Classmates" icon={<Group />} iconPosition="start" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Assignments Tab */}
              {classDetailsTab === 0 && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
                      <Assignment sx={{ mr: 1 }} /> Class Assignments
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showPastAssignments}
                            onChange={() => setShowPastAssignments(!showPastAssignments)}
                            size="small"
                          />
                        }
                        label="Show Past"
                        sx={{ mr: 1 }}
                      />

                      <Button variant="outlined" startIcon={<FilterAlt />} size="small" onClick={handleFilterClick}>
                        Filter
                      </Button>

                      <Button variant="outlined" startIcon={<Sort />} size="small" onClick={handleSortClick}>
                        Sort
                      </Button>

                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        size="small"
                        onClick={() => setCreateAssignmentDialogOpen(true)}
                      >
                        Request
                      </Button>
                    </Box>
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ my: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {loading ? (
                    <Box sx={{ width: "100%", mt: 2, mb: 4 }}>
                      <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
                    </Box>
                  ) : (
                    <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 2, mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Class Average</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {classAssignments.length > 0 ? (
                            classAssignments
                              .filter((assignment) => {
                                // Filter past assignments if toggle is off
                                if (!showPastAssignments) {
                                  const isPastDue = new Date(assignment.dueDate) < new Date()
                                  if (isPastDue && assignment.status !== "not_submitted") {
                                    return false
                                  }
                                }
                                return true
                              })
                              .map((assignment) => (
                                <TableRow
                                  key={assignment.id}
                                  sx={{
                                    "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                                    transition: "background-color 0.2s ease-in-out",
                                    "&:hover": { bgcolor: "action.selected" },
                                  }}
                                >
                                  <TableCell>{assignment.title}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                      {new Date(assignment.dueDate).toLocaleDateString()}
                                      {isDeadlineSoon(assignment.dueDate) && (
                                        <Chip
                                          size="small"
                                          label="Soon"
                                          color="error"
                                          icon={<AccessTime />}
                                          sx={{ ml: 1, height: 24 }}
                                        />
                                      )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>{getStatusChip(assignment.status)}</TableCell>
                                  <TableCell>
                                    {assignment.status === "graded" ? `${assignment.grade}/100` : "-"}
                                  </TableCell>
                                  <TableCell>
                                    {assignment.status === "graded" ? `${assignment.classAverage}/100` : "-"}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleAssignmentSelect(assignment)}
                                        sx={{
                                          transition: "all 0.2s ease-in-out",
                                          "&:hover": { transform: "scale(1.05)" },
                                        }}
                                      >
                                        View
                                      </Button>

                                      {assignment.status === "not_submitted" && (
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          color="primary"
                                          onClick={() => {
                                            setActiveTab(5)
                                            setSelectedClassId(selectedClass.id)
                                          }}
                                          startIcon={<CloudUpload />}
                                        >
                                          Submit
                                        </Button>
                                      )}
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} align="center">
                                No assignments for this class
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CloudUpload />}
                      onClick={() => {
                        setActiveTab(5)
                        setSelectedClassId(selectedClass.id)
                      }}
                      sx={{
                        transition: "all 0.2s ease-in-out",
                        "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                      }}
                    >
                      Upload Assignment
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<BarChart />}
                      sx={{
                        transition: "all 0.2s ease-in-out",
                        "&:hover": { transform: "translateY(-3px)" },
                      }}
                    >
                      View Class Analytics
                    </Button>
                  </Box>
                </>
              )}

              {/* Announcements Tab */}
              {classDetailsTab === 1 && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
                      <NotificationsActive sx={{ mr: 1 }} /> Class Announcements
                    </Typography>
                  </Box>

                  {classAnnouncements.length > 0 ? (
                    <Box>
                      {classAnnouncements.map((announcement) => (
                        <Card
                          key={announcement.id}
                          variant="outlined"
                          sx={{
                            mb: 2,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { boxShadow: 3 },
                          }}
                        >
                          <CardHeader
                            title={announcement.title}
                            subheader={`Posted by ${announcement.author} on ${new Date(announcement.date).toLocaleDateString()}`}
                          />
                          <CardContent>
                            <Typography variant="body1">{announcement.content}</Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <NotificationsOff sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No announcements yet
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* Resources Tab */}
              {classDetailsTab === 2 && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
                      <Folder sx={{ mr: 1 }} /> Class Resources
                    </Typography>

                    <TextField
                      placeholder="Search resources..."
                      size="small"
                      InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                      }}
                      sx={{ width: 200 }}
                    />
                  </Box>

                  {classResources.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Uploaded</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {classResources.map((resource) => (
                            <TableRow
                              key={resource.id}
                              sx={{
                                "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                                transition: "background-color 0.2s ease-in-out",
                                "&:hover": { bgcolor: "action.selected" },
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  {resource.type === "pdf" && <Description sx={{ mr: 1, color: "error.main" }} />}
                                  {resource.type === "docx" && <Description sx={{ mr: 1, color: "primary.main" }} />}
                                  {resource.type === "pptx" && <Description sx={{ mr: 1, color: "warning.main" }} />}
                                  {resource.title}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={resource.type.toUpperCase()}
                                  size="small"
                                  color={
                                    resource.type === "pdf" ? "error" : resource.type === "docx" ? "primary" : "warning"
                                  }
                                />
                              </TableCell>
                              <TableCell>{resource.size}</TableCell>
                              <TableCell>{new Date(resource.uploadDate).toLocaleDateString()}</TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                  <Button variant="contained" size="small" startIcon={<Download />}>
                                    Download
                                  </Button>
                                  <IconButton size="small">
                                    <MoreVert />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <FolderOpen sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No resources available
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* Classmates Tab */}
              {classDetailsTab === 3 && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}>
                      <Group sx={{ mr: 1 }} /> Classmates
                    </Typography>

                    <TextField
                      placeholder="Search classmates..."
                      size="small"
                      InputProps={{
                        startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                      }}
                      sx={{ width: 200 }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    {classmates.map((classmate) => (
                      <Grid item xs={12} sm={6} md={3} key={classmate.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            transition: "all 0.2s ease-in-out",
                            "&:hover": { boxShadow: 3 },
                          }}
                        >
                          <CardContent sx={{ textAlign: "center", p: 2 }}>
                            <Avatar
                              src={classmate.photoURL}
                              sx={{
                                width: 80,
                                height: 80,
                                mx: "auto",
                                mb: 2,
                                border: "2px solid",
                                borderColor: "primary.main",
                              }}
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                              {classmate.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {classmate.email}
                            </Typography>
                            <Chip label={classmate.role} size="small" color="primary" sx={{ mt: 1 }} />
                            <Box sx={{ mt: 2 }}>
                              <Button variant="outlined" size="small" fullWidth startIcon={<Chat />}>
                                Message
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Box>
          </Box>
        </Card>
      </motion.div>
    )
  }

  const renderDashboardTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Dashboard
            </Typography>
            <Box>
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} sx={{ mr: 1 }}>
                  <Refresh sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                startIcon={calendarView ? <Timeline /> : <CalendarToday />}
                onClick={() => setCalendarView(!calendarView)}
                size="small"
              >
                {calendarView ? "List View" : "Calendar View"}
              </Button>
            </Box>
          </Box>
        </Grid>

        {loading ? (
          <Grid item xs={12}>
            <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <GradientCard>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <School sx={{ fontSize: 40, mr: 2, color: "rgba(255,255,255,0.8)" }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: "#fff" }}>
                        My Classes
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#fff" }}>
                      {classes.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      {classes.length > 0 ? `${classes[0].name} and ${classes.length - 1} more` : "No classes enrolled"}
                    </Typography>
                  </CardContent>
                </GradientCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Assignment sx={{ fontSize: 40, mr: 2, color: "rgba(0,0,0,0.6)" }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: "rgba(0,0,0,0.8)" }}>
                        Pending Assignments
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "rgba(0,0,0,0.8)" }}>
                      {assignments.filter((a) => a.status !== "graded").length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)" }}>
                      {assignments.filter((a) => a.status === "not_submitted").length} not submitted
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Card sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Grade sx={{ fontSize: 40, mr: 2, color: "rgba(0,0,0,0.6)" }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: "rgba(0,0,0,0.8)" }}>
                        Average Grade
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "rgba(0,0,0,0.8)" }}>
                      {assignments.filter((a) => a.status === "graded").length > 0
                        ? (
                            assignments.filter((a) => a.status === "graded").reduce((sum, a) => sum + a.grade, 0) /
                            assignments.filter((a) => a.status === "graded").length
                          ).toFixed(1)
                        : "N/A"}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        assignments.filter((a) => a.status === "graded").length > 0
                          ? assignments.filter((a) => a.status === "graded").reduce((sum, a) => sum + a.grade, 0) /
                            assignments.filter((a) => a.status === "graded").length
                          : 0
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(0,0,0,0.1)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "rgba(0,0,0,0.6)",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", boxShadow: 3 }}>
                <CardHeader
                  title="My Classes"
                  action={
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleTabChange(null, 1)}
                      endIcon={<ArrowBack sx={{ transform: "rotate(180deg)" }} />}
                    >
                      View All
                    </Button>
                  }
                />
                <CardContent>
                  <List>
                    {classes.slice(0, 3).map((classItem) => (
                      <AnimatedListItem
                        key={classItem.id}
                        button
                        onClick={() => handleClassSelect(classItem)}
                        sx={{
                          mb: 1,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Avatar src={classItem.teacherPfp} sx={{ mr: 2 }} />
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {classItem.name}
                            </Typography>
                          }
                          secondary={`Teacher: ${classItem.teacher}`}
                        />
                        <ArrowBack sx={{ transform: "rotate(180deg)" }} />
                      </AnimatedListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", boxShadow: 3 }}>
                <CardHeader
                  title="Recent Assignments"
                  action={
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleTabChange(null, 2)}
                      endIcon={<ArrowBack sx={{ transform: "rotate(180deg)" }} />}
                    >
                      View All
                    </Button>
                  }
                />
                <CardContent>
                  <List>
                    {assignments.slice(0, 3).map((assignment) => (
                      <AnimatedListItem
                        key={assignment.id}
                        button
                        onClick={() => handleAssignmentSelect(assignment)}
                        sx={{
                          borderLeft: `4px solid ${getStatusColor(assignment.status)}`,
                          mb: 1,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {assignment.title}
                            </Typography>
                          }
                          secondary={`${assignment.className} • Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                        />
                        {getStatusChip(assignment.status)}
                      </AnimatedListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTime sx={{ mr: 1 }} />
                      <Typography variant="h6">Upcoming Deadlines</Typography>
                    </Box>
                  }
                  action={
                    <FormControlLabel
                      control={
                        <Switch
                          checked={calendarView}
                          onChange={() => setCalendarView(!calendarView)}
                          color="primary"
                        />
                      }
                      label={calendarView ? "Calendar" : "List"}
                    />
                  }
                />
                <CardContent>
                  {calendarView ? (
                    <Box sx={{ height: 400, overflowY: "auto" }}>
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <Grid item xs={12 / 7} key={day}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                textAlign: "center",
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                fontWeight: "bold",
                              }}
                            >
                              {day}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>

                      <Grid container spacing={1}>
                        {Array.from({ length: 35 }, (_, i) => {
                          const date = new Date()
                          date.setDate(date.getDate() - date.getDay() + i)

                          const assignmentsForDay = assignments.filter((a) => {
                            const dueDate = new Date(a.dueDate)
                            return (
                              dueDate.getDate() === date.getDate() &&
                              dueDate.getMonth() === date.getMonth() &&
                              dueDate.getFullYear() === date.getFullYear()
                            )
                          })

                          const isToday = new Date().toDateString() === date.toDateString()

                          return (
                            <Grid item xs={12 / 7} key={i}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 1,
                                  height: 100,
                                  border: "1px solid",
                                  borderColor: isToday ? "primary.main" : "divider",
                                  bgcolor: isToday ? "primary.lighter" : "background.paper",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: isToday ? "bold" : "normal",
                                    color: isToday ? "primary.main" : "text.primary",
                                  }}
                                >
                                  {date.getDate()}
                                </Typography>

                                {assignmentsForDay.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    {assignmentsForDay.map((a, idx) => (
                                      <Chip
                                        key={idx}
                                        label={a.title}
                                        size="small"
                                        color={a.status === "not_submitted" ? "error" : "primary"}
                                        sx={{
                                          mb: 0.5,
                                          maxWidth: "100%",
                                          fontSize: "0.7rem",
                                          height: 20,
                                        }}
                                        onClick={() => handleAssignmentSelect(a)}
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Paper>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </Box>
                  ) : (
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
                            .filter((a) => a.status !== "graded")
                            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                            .map((assignment) => (
                              <TableRow
                                key={assignment.id}
                                sx={{
                                  cursor: "pointer",
                                  transition: "background-color 0.2s ease-in-out",
                                  "&:hover": { bgcolor: "action.hover" },
                                }}
                                onClick={() => handleAssignmentSelect(assignment)}
                              >
                                <TableCell sx={{ fontWeight: "medium" }}>{assignment.title}</TableCell>
                                <TableCell>{assignment.className}</TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                    {isDeadlineSoon(assignment.dueDate) && (
                                      <Chip
                                        size="small"
                                        label="Soon"
                                        color="error"
                                        icon={<AccessTime />}
                                        sx={{ ml: 1, height: 24 }}
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>{getStatusChip(assignment.status)}</TableCell>
                              </TableRow>
                            ))}
                          {assignments.filter((a) => a.status !== "graded").length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                No upcoming deadlines
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </motion.div>
  )

  const renderClassesTab = () => {
    if (viewMode === "class") {
      return renderClassDetail()
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Classes
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              placeholder="Search classes..."
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{ width: 200 }}
              onChange={handleSearchChange}
            />
            <Tooltip title="View Mode">
              <IconButton onClick={() => setClassView(classView === "grid" ? "list" : "grid")}>
                {classView === "grid" ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <Refresh sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            {loading ? (
              <Box sx={{ width: "100%", py: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            ) : (
              <>
                {classView === "grid" ? (
                  <Grid container spacing={3}>
                    {filteredClasses.map((classItem) => (
                      <Grid item xs={12} sm={6} md={4} key={classItem.id}>
                        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                          <Card
                            variant="outlined"
                            sx={{
                              cursor: "pointer",
                              height: "100%",
                              boxShadow: 2,
                              transition: "all 0.3s ease-in-out",
                              "&:hover": { boxShadow: 6 },
                              overflow: "hidden",
                            }}
                            onClick={() => handleClassSelect(classItem)}
                          >
                            <ClassBanner
                              sx={{
                                height: 80,
                                backgroundImage: `url(https://source.unsplash.com/random/400x80?${classItem.name.split(" ").join(",")})`,
                              }}
                            />
                            <CardHeader
                              avatar={
                                <Avatar
                                  src={classItem.teacherPfp}
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    transition: "transform 0.3s ease-in-out",
                                    "&:hover": { transform: "scale(1.1)" },
                                    mt: -4,
                                    border: "2px solid white",
                                    boxShadow: 2,
                                  }}
                                />
                              }
                              title={
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {classItem.name}
                                </Typography>
                              }
                              subheader={`Teacher: ${classItem.teacher}`}
                              action={
                                <IconButton>
                                  <MoreVert />
                                </IconButton>
                              }
                            />
                            <CardContent>
                              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <School sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Class Code: {classItem.code}
                                </Typography>
                              </Box>

                              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Assignment sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {assignments.filter((a) => a.classId === classItem.id).length} Assignments
                                </Typography>
                              </Box>

                              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleClassSelect(classItem)
                                  }}
                                  sx={{
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": { transform: "scale(1.05)" },
                                  }}
                                >
                                  View Class
                                </Button>

                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveTab(5)
                                    setSelectedClassId(classItem.id)
                                  }}
                                  startIcon={<CloudUpload />}
                                  sx={{
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": { transform: "scale(1.05)" },
                                  }}
                                >
                                  Upload
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Class Name</TableCell>
                          <TableCell>Teacher</TableCell>
                          <TableCell>Code</TableCell>
                          <TableCell>Assignments</TableCell>
                          <TableCell>Average Grade</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredClasses.map((classItem) => {
                          const classAssignments = assignments.filter((a) => a.classId === classItem.id)
                          const gradedAssignments = classAssignments.filter((a) => a.status === "graded")
                          const avgGrade =
                            gradedAssignments.length > 0
                              ? gradedAssignments.reduce((sum, a) => sum + a.grade, 0) / gradedAssignments.length
                              : null

                          return (
                            <TableRow
                              key={classItem.id}
                              sx={{
                                cursor: "pointer",
                                "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                                transition: "background-color 0.2s ease-in-out",
                                "&:hover": { bgcolor: "action.selected" },
                              }}
                              onClick={() => handleClassSelect(classItem)}
                            >
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Avatar src={classItem.teacherPfp} sx={{ mr: 2, width: 32, height: 32 }} />
                                  <Typography variant="subtitle2" sx={{ fontWeight: "medium" }}>
                                    {classItem.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{classItem.teacher}</TableCell>
                              <TableCell>{classItem.code}</TableCell>
                              <TableCell>{classAssignments.length}</TableCell>
                              <TableCell>
                                {avgGrade !== null ? (
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                      {avgGrade.toFixed(1)}
                                    </Typography>
                                    <LinearProgress
                                      variant="determinate"
                                      value={avgGrade}
                                      sx={{
                                        width: 60,
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: "background.paper",
                                        "& .MuiLinearProgress-bar": {
                                          borderRadius: 3,
                                          bgcolor:
                                            avgGrade >= 90
                                              ? "success.main"
                                              : avgGrade >= 70
                                                ? "warning.main"
                                                : "error.main",
                                        },
                                      }}
                                    />
                                  </Box>
                                ) : (
                                  "No grades"
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleClassSelect(classItem)
                                    }}
                                  >
                                    View
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<CloudUpload />}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveTab(5)
                                      setSelectedClassId(classItem.id)
                                    }}
                                  >
                                    Upload
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {filteredClasses.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <School sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No classes found
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderAssignmentsTab = () => {
    if (viewMode === "assignment") {
      return renderAssignmentDetail()
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            All Assignments
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              placeholder="Search assignments..."
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{ width: 200 }}
            />
            <Tooltip title="Filter">
              <IconButton onClick={handleFilterClick}>
                <FilterList />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
              <MenuItem
                onClick={() => {
                  setAssignmentFilterValue("all")
                  handleFilterClose()
                }}
                selected={assignmentFilterValue === "all"}
              >
                All Assignments
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentFilterValue("graded")
                  handleFilterClose()
                }}
                selected={assignmentFilterValue === "graded"}
              >
                Graded
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentFilterValue("pending")
                  handleFilterClose()
                }}
                selected={assignmentFilterValue === "pending"}
              >
                Pending
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentFilterValue("not_submitted")
                  handleFilterClose()
                }}
                selected={assignmentFilterValue === "not_submitted"}
              >
                Not Submitted
              </MenuItem>
              <Divider />
              <MenuItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showPastAssignments}
                      onChange={() => setShowPastAssignments(!showPastAssignments)}
                      size="small"
                    />
                  }
                  label="Show Past Assignments"
                />
              </MenuItem>
            </Menu>

            <Tooltip title="Sort">
              <IconButton onClick={handleSortClick}>
                <Sort />
              </IconButton>
            </Tooltip>
            <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleSortClose}>
              <MenuItem
                onClick={() => {
                  setAssignmentSortValue("dueDate")
                  handleSortClose()
                }}
                selected={assignmentSortValue === "dueDate"}
              >
                Due Date (Ascending)
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentSortValue("dueDateDesc")
                  handleSortClose()
                }}
                selected={assignmentSortValue === "dueDateDesc"}
              >
                Due Date (Descending)
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentSortValue("gradeDesc")
                  handleSortClose()
                }}
                selected={assignmentSortValue === "gradeDesc"}
              >
                Grade (High to Low)
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentSortValue("gradeAsc")
                  handleSortClose()
                }}
                selected={assignmentSortValue === "gradeAsc"}
              >
                Grade (Low to High)
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentSortValue("title")
                  handleSortClose()
                }}
                selected={assignmentSortValue === "title"}
              >
                Title (A-Z)
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAssignmentSortValue("class")
                  handleSortClose()
                }}
                selected={assignmentSortValue === "class"}
              >
                Class (A-Z)
              </MenuItem>
            </Menu>

            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <Refresh sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            {loading ? (
              <Box sx={{ width: "100%", py: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle1">
                    Showing {sortedAssignments.length} assignments
                    {assignmentFilterValue !== "all" && ` • Filtered by: ${assignmentFilterValue}`}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showPastAssignments}
                        onChange={() => setShowPastAssignments(!showPastAssignments)}
                        size="small"
                      />
                    }
                    label="Show Past Assignments"
                  />
                </Box>

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
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedAssignments.length > 0 ? (
                        sortedAssignments.map((assignment) => (
                          <React.Fragment key={assignment.id}>
                            <TableRow
                              sx={{
                                "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                                transition: "background-color 0.2s ease-in-out",
                                "&:hover": { bgcolor: "action.selected" },
                                cursor: "pointer",
                              }}
                              onClick={() => handleExpandAssignment(assignment.id)}
                            >
                              <TableCell sx={{ fontWeight: "medium" }}>{assignment.title}</TableCell>
                              <TableCell>{assignment.className}</TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  {new Date(assignment.dueDate).toLocaleDateString()}
                                  {isDeadlineSoon(assignment.dueDate) && (
                                    <Chip
                                      size="small"
                                      label="Soon"
                                      color="error"
                                      icon={<AccessTime />}
                                      sx={{ ml: 1, height: 24 }}
                                    />
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>{getStatusChip(assignment.status)}</TableCell>
                              <TableCell>{assignment.status === "graded" ? `${assignment.grade}/100` : "-"}</TableCell>
                              <TableCell>
                                {assignment.status === "graded" ? `${assignment.classAverage}/100` : "-"}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAssignmentSelect(assignment)
                                    }}
                                    sx={{
                                      transition: "all 0.2s ease-in-out",
                                      "&:hover": { transform: "scale(1.05)" },
                                    }}
                                  >
                                    View
                                  </Button>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleExpandAssignment(assignment.id)
                                    }}
                                  >
                                    {expandedAssignmentId === assignment.id ? <ExpandLess /> : <ExpandMore />}
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                                <Collapse in={expandedAssignmentId === assignment.id} timeout="auto" unmountOnExit>
                                  <Box sx={{ p: 3, bgcolor: "background.default" }}>
                                    <Typography variant="h6" gutterBottom>
                                      Assignment Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={6}>
                                        <Typography variant="body2">
                                          <strong>Submitted:</strong>{" "}
                                          {assignment.submittedOn
                                            ? new Date(assignment.submittedOn).toLocaleDateString()
                                            : "Not submitted"}
                                        </Typography>
                                        {assignment.status === "graded" && (
                                          <Typography variant="body2">
                                            <strong>Graded on:</strong>{" "}
                                            {new Date(assignment.gradedOn).toLocaleDateString()}
                                          </Typography>
                                        )}
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                          <strong>Description:</strong>{" "}
                                          {assignment.description ||
                                            "Complete the assigned problems and submit your work by the due date."}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                                      >
                                        <Button
                                          variant="outlined"
                                          startIcon={<CloudUpload />}
                                          onClick={() => {
                                            setActiveTab(5)
                                            setSelectedClassId(assignment.classId)
                                          }}
                                        >
                                          Upload Submission
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          startIcon={<Chat />}
                                          onClick={() => {
                                            setActiveTab(4)
                                            setNewMessage(`Help me with my ${assignment.title} assignment`)
                                          }}
                                        >
                                          Ask AI
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No assignments found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderGradesTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Grade Summary
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <Refresh sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card
              sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Overall Average
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {assignments.filter((a) => a.status === "graded").length > 0
                    ? (
                        assignments.filter((a) => a.status === "graded").reduce((sum, a) => sum + a.grade, 0) /
                        assignments.filter((a) => a.status === "graded").length
                      ).toFixed(1)
                    : "N/A"}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    assignments.filter((a) => a.status === "graded").length > 0
                      ? assignments.filter((a) => a.status === "graded").reduce((sum, a) => sum + a.grade, 0) /
                        assignments.filter((a) => a.status === "graded").length
                      : 0
                  }
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "white",
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card
              sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.contrastText, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Highest Grade
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {assignments.filter((a) => a.status === "graded").length > 0
                    ? Math.max(...assignments.filter((a) => a.status === "graded").map((a) => a.grade))
                    : "N/A"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {assignments.filter((a) => a.status === "graded").length > 0
                    ? assignments.filter((a) => a.status === "graded").sort((a, b) => b.grade - a.grade)[0]?.title
                    : "No graded assignments"}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card
              sx={{ bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Graded Assignments
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {assignments.filter((a) => a.status === "graded").length}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  out of {assignments.length} total
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card sx={{ bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Pending Submissions
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {assignments.filter((a) => a.status !== "graded").length}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {assignments.filter((a) => a.status === "not_submitted").length} not started
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Grade sx={{ mr: 1 }} />
              <Typography variant="h6">Grade Details</Typography>
            </Box>
          }
        />
        <CardContent>
          {loading ? (
            <Box sx={{ width: "100%", py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
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
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.filter((a) => a.status === "graded").length > 0 ? (
                    assignments
                      .filter((a) => a.status === "graded")
                      .map((assignment) => (
                        <TableRow
                          key={assignment.id}
                          sx={{
                            "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                            transition: "background-color 0.2s ease-in-out",
                            "&:hover": { bgcolor: "action.selected" },
                            cursor: "pointer",
                          }}
                          onClick={() => handleAssignmentSelect(assignment)}
                        >
                          <TableCell>{assignment.className}</TableCell>
                          <TableCell sx={{ fontWeight: "medium" }}>{assignment.title}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body2" sx={{ mr: 1, fontWeight: "medium" }}>
                                {assignment.grade}/100
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={assignment.grade}
                                sx={{
                                  width: 100,
                                  borderRadius: 5,
                                  height: 8,
                                  bgcolor: "background.paper",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                    bgcolor:
                                      assignment.grade >= 90
                                        ? "success.main"
                                        : assignment.grade >= 70
                                          ? "warning.main"
                                          : "error.main",
                                  },
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>{assignment.classAverage}/100</TableCell>
                          <TableCell>{new Date(assignment.gradedOn).toLocaleDateString()}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAssignmentSelect(assignment)
                              }}
                              sx={{
                                transition: "all 0.2s ease-in-out",
                                "&:hover": { transform: "scale(1.05)" },
                              }}
                            >
                              View Feedback
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No graded assignments yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
<<<<<<< Updated upstream
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
=======

      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BarChart sx={{ mr: 1 }} />
              <Typography variant="h6">Performance by Class</Typography>
            </Box>
          }
        />
        <CardContent>
          {classes.map((classItem) => {
            const classAssignments = assignments.filter((a) => a.classId === classItem.id && a.status === "graded")
            const avgGrade =
              classAssignments.length > 0
                ? classAssignments.reduce((sum, a) => sum + a.grade, 0) / classAssignments.length
                : 0

            return (
              <Box key={classItem.id} sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {classItem.name}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {avgGrade > 0 ? `${avgGrade.toFixed(1)}/100` : "No grades"}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={avgGrade}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: "background.paper",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      bgcolor: avgGrade >= 90 ? "success.main" : avgGrade >= 70 ? "warning.main" : "error.main",
                    },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {classAssignments.length} graded assignments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {classAssignments.length > 0 ? `Highest: ${Math.max(...classAssignments.map((a) => a.grade))}` : ""}
                  </Typography>
                </Box>
              </Box>
            )
          })}
>>>>>>> Stashed changes
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderAIAssistantTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Box sx={{ height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}>
        <Card
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Chat sx={{ mr: 1 }} />
                <Typography variant="h6">AI Study Assistant</Typography>
              </Box>
            }
            action={
              <Tooltip title="Clear Chat">
                <IconButton>
                  <Close />
                </IconButton>
              </Tooltip>
            }
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          />
          <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 0 }}>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 3,
                bgcolor: theme.palette.background.default,
              }}
            >
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
                    {msg.sender === "ai" && (
                      <Avatar
                        sx={{
                          mr: 1,
                          bgcolor: theme.palette.primary.main,
                          width: 32,
                          height: 32,
                        }}
                      >
                        <School sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          maxWidth: "75%",
                          p: 2,
                          borderRadius: 2,
                          bgcolor: msg.sender === "user" ? theme.palette.primary.main : theme.palette.background.paper,
                          color: msg.sender === "user" ? "white" : "text.primary",
                        }}
                      >
                        <Typography variant="body1">{msg.message}</Typography>
                        <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </motion.div>
                    {msg.sender === "user" && (
                      <Avatar
                        src={user?.photoURL}
                        sx={{
                          ml: 1,
                          width: 32,
                          height: 32,
                        }}
                      />
                    )}
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Chat sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    AI Study Assistant
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Ask me anything about your studies!
                  </Typography>
                  <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
                    <Chip
                      label="Help with my math homework"
                      onClick={() => setNewMessage("Help with my math homework")}
                      sx={{ cursor: "pointer" }}
                    />
                    <Chip
                      label="When is my next deadline?"
                      onClick={() => setNewMessage("When is my next deadline?")}
                      sx={{ cursor: "pointer" }}
                    />
                    <Chip
                      label="Explain quantum mechanics"
                      onClick={() => setNewMessage("Explain quantum mechanics")}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                </Box>
              )}
              {aiResponding && (
                <Box sx={{ display: "flex", alignItems: "center", ml: 5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        animation: "pulse 1s infinite",
                        animationDelay: "0s",
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        animation: "pulse 1s infinite",
                        animationDelay: "0.2s",
                      }}
                    />
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        animation: "pulse 1s infinite",
                        animationDelay: "0.4s",
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                    AI is thinking...
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: theme.palette.background.paper,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask me anything about your studies..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setNewMessage("")}
                      sx={{ visibility: newMessage ? "visible" : "hidden" }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  ),
                }}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                endIcon={<Send />}
                disabled={aiResponding || !newMessage.trim()}
                sx={{
                  transition: "all 0.2s ease-in-out",
                  "&:hover": { transform: "translateY(-3px)" },
                }}
              >
                {aiResponding ? "Sending..." : "Send"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  )

  const renderUploadTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Upload Assignment
        </Typography>
      </Box>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CloudUpload sx={{ mr: 1 }} />
              <Typography variant="h6">Submit Your Work</Typography>
            </Box>
          }
        />
        <CardContent>
          {loading ? (
            <Box sx={{ width: "100%", py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
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
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <input
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    style={{ display: "none" }}
                    id="upload-assignment-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-assignment-file">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: "primary.lighter",
                            color: "primary.main",
                            margin: "0 auto",
                            mb: 2,
                          }}
                        >
                          <CloudUpload sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Drag & Drop or Click to Upload
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Supports PDF, DOC, DOCX, images, and more
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        sx={{
                          transition: "all 0.2s ease-in-out",
                          "&:hover": { transform: "translateY(-3px)" },
                        }}
                      >
                        Select File
                      </Button>
                    </motion.div>
                  </label>
                  {fileToUpload && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <InsertDriveFile sx={{ mr: 1, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {fileToUpload.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(fileToUpload.size / 1024).toFixed(2)} KB
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={() => setFileToUpload(null)} color="error">
                        <Close />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFileUpload}
                  disabled={!fileToUpload || !selectedClassId || uploadsLoading}
                  fullWidth
                  size="large"
                  startIcon={uploadsLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                  sx={{
                    py: 1.5,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
                  }}
                >
                  {uploadsLoading ? "Uploading..." : "Upload Assignment"}
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <History sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Uploads</Typography>
            </Box>
          }
        />
        <CardContent>
          {uploadsLoading ? (
            <Box sx={{ width: "100%", py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : uploadsError ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {uploadsError}
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Assignment</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Uploaded Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments
                    .filter((a) => a.status === "pending" || a.status === "graded")
                    .sort((a, b) => new Date(b.submittedOn) - new Date(a.submittedOn))
                    .map((assignment) => (
                      <TableRow
                        key={assignment.id}
                        sx={{
                          "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                          transition: "background-color 0.2s ease-in-out",
                          "&:hover": { bgcolor: "action.selected" },
                          cursor: "pointer",
                        }}
                        onClick={() => handleAssignmentSelect(assignment)}
                      >
                        <TableCell sx={{ fontWeight: "medium" }}>{assignment.title}</TableCell>
                        <TableCell>{assignment.className}</TableCell>
                        <TableCell>{new Date(assignment.submittedOn).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusChip(assignment.status)}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAssignmentSelect(assignment)
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CloudUpload />}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedClassId(assignment.classId)
                              }}
                            >
                              Resubmit
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  {assignments.filter((a) => a.status === "pending" || a.status === "graded").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No assignments uploaded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderMainContent = () => {
    switch (activeTab) {
      case 0:
        return renderDashboardTab()
      case 1:
        return renderClassesTab()
      case 2:
        return renderAssignmentsTab()
      case 3:
        return renderGradesTab()
      case 4:
        return renderAIAssistantTab()
      case 5:
        return renderUploadTab()
      default:
        return renderDashboardTab()
    }
<<<<<<< Updated upstream
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
=======
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 0.5,
              textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            GradeGood
          </Typography>

          <Tooltip title="Refresh Data">
            <IconButton color="inherit" onClick={handleRefresh}>
              <Refresh sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: { width: 320, maxHeight: 500, mt: 1.5 },
            }}
          >
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Notifications</Typography>
              <Box>
                <Button size="small" onClick={handleMarkAllNotificationsAsRead} sx={{ mr: 1 }}>
                  Mark all read
                </Button>
                <IconButton size="small" onClick={handleClearNotifications}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Divider />
            {notifications.length > 0 ? (
              <List sx={{ p: 0 }}>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: notification.read ? "transparent" : "action.hover",
                      borderLeft: notification.read ? "none" : "3px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <ListItemText
                      primary={<Typography variant="subtitle2">{notification.title}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notification.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <NotificationsOff sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                <Typography color="text.secondary">No notifications</Typography>
              </Box>
            )}
          </Menu>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <IconButton color="inherit" onClick={handleUserMenuClick} sx={{ p: 0 }}>
              <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
                <Avatar
                  src={user?.photoURL}
                  sx={{
                    width: 36,
                    height: 36,
                    border: "2px solid white",
                  }}
                />
              </StyledBadge>
            </IconButton>
            <Typography variant="body1" sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
              {user?.displayName}
            </Typography>
          </Box>
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
            PaperProps={{
              sx: { width: 220, mt: 1.5 },
            }}
          >
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Avatar
                src={user?.photoURL}
                sx={{
                  width: 60,
                  height: 60,
                  margin: "0 auto",
                  mb: 1,
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                {user?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => {
                handleUserMenuClose()
                setProfileDialogOpen(true)
              }}
            >
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleUserMenuClose()
                setSettingsDialogOpen(true)
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleUserMenuClose()
                setHelpDialogOpen(true)
              }}
            >
              <ListItemIcon>
                <Help fontSize="small" />
              </ListItemIcon>
              <ListItemText>Help & Support</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
>>>>>>> Stashed changes
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 250,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
<<<<<<< Updated upstream
=======
          display: { xs: "block", sm: "block", md: "none" },
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          display: { xs: "none", sm: "block" },
=======
          display: { xs: "none", sm: "none", md: "block" },
>>>>>>> Stashed changes
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
          transition: "all 0.3s ease-in-out",
        }}
      >
        <AnimatePresence mode="wait">{renderMainContent()}</AnimatePresence>
      </Box>

      {/* Submission Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CheckCircle sx={{ color: "success.main", mr: 1 }} />
            Submission Successful
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your file "{submittedFileName}" has been successfully uploaded to {submittedClassName}. You will be notified
            when your submission is graded.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              src={user?.photoURL}
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto",
                mb: 2,
                border: "3px solid",
                borderColor: "primary.main",
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: "medium" }}>
              {user?.displayName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Academic Summary
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Overall Average
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "medium", color: "primary.main" }}>
                    {assignments.filter((a) => a.status === "graded").length > 0
                      ? (
                          assignments.filter((a) => a.status === "graded").reduce((sum, a) => sum + a.grade, 0) /
                          assignments.filter((a) => a.status === "graded").length
                        ).toFixed(1)
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Completed Assignments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "medium", color: "success.main" }}>
                    {assignments.filter((a) => a.status === "graded").length}/{assignments.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Enrolled Classes
          </Typography>
          <List>
            {classes.map((classItem) => (
              <ListItem key={classItem.id} sx={{ px: 0 }}>
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary={classItem.name} secondary={`Teacher: ${classItem.teacher}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <Visibility />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" secondary="Switch between light and dark theme" />
              <Switch checked={darkMode} onChange={handleToggleDarkMode} color="primary" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <NotificationsActive />
              </ListItemIcon>
              <ListItemText primary="Notifications" secondary="Enable or disable notifications" />
              <Switch defaultChecked color="primary" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText primary="Calendar View" secondary="Set default view for deadlines" />
              <Switch checked={calendarView} onChange={() => setCalendarView(!calendarView)} color="primary" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Help & Support</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>How do I submit an assignment?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Go to the "Upload Work" tab, select your class, choose your file, and click "Upload Assignment".
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>How can I check my grades?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Navigate to the "Grades" tab to see all your graded assignments and overall performance.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>How do I use the AI Assistant?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Go to the "AI Assistant" tab and type your question in the chat box. The AI will respond with helpful
                information related to your studies.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Contact Support
            </Typography>
            <Typography variant="body2" paragraph>
              If you need additional help, please contact our support team:
            </Typography>
            <Typography variant="body2">Email: support@gradegood.com</Typography>
            <Typography variant="body2">Phone: (555) 123-4567</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Assignment Request Dialog */}
      <Dialog
        open={createAssignmentDialogOpen}
        onClose={() => setCreateAssignmentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Assignment Creation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill out this form to request your teacher to create a new assignment.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Assignment Title"
                fullWidth
                value={newAssignmentData.title}
                onChange={(e) => setNewAssignmentData({ ...newAssignmentData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Class</InputLabel>
                <Select
                  value={newAssignmentData.classId}
                  label="Class"
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, classId: e.target.value })}
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
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newAssignmentData.dueDate}
                onChange={(e) => setNewAssignmentData({ ...newAssignmentData, dueDate: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={newAssignmentData.description}
                onChange={(e) => setNewAssignmentData({ ...newAssignmentData, description: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateAssignmentDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAssignment}
            disabled={!newAssignmentData.title || !newAssignmentData.classId || !newAssignmentData.dueDate}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

// Accordion component for Help Dialog
const Accordion = ({ children, ...props }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        mb: 1,
        overflow: "hidden",
      }}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type === AccordionSummary) {
          return React.cloneElement(child, {
            onClick: () => setExpanded(!expanded),
          })
        }
        if (child.type === AccordionDetails) {
          return <Collapse in={expanded}>{child}</Collapse>
        }
        return child
      })}
    </Paper>
  )
}

const AccordionSummary = ({ children, expandIcon, onClick }) => {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
      {expandIcon}
    </Box>
  )
}

const AccordionDetails = ({ children }) => {
  return <Box sx={{ p: 2, pt: 0, pb: 2, borderTop: "1px solid", borderColor: "divider" }}>{children}</Box>
}

// Missing ViewList and ViewModule components
const ViewList = () => <Assignment />
const ViewModule = () => <Dashboard />

export default StudentDashboard

