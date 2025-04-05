import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Base URL for all API requests - update for production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-url.com'  // Replace with your deployed backend URL
  : 'http://localhost:8000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Auth token interceptor ensures authenticated API requests
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
  }
  
  return config;
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - no response received');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        originalError: error
      });
    }
    
    // Handle authentication errors
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          // Force token refresh
          await user.getIdToken(true);
          
          // Retry the request with new token
          const token = await user.getIdToken();
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing auth token:', refreshError);
        // Force logout on auth refresh failure
        getAuth().signOut();
      }
    }
    
    // Format error message for UI display
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response && error.response.data) {
      errorMessage = error.response.data.detail || 
                    error.response.data.message || 
                    `Error ${error.response.status}: ${error.response.statusText}`;
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response ? error.response.status : null,
      originalError: error
    });
  }
);

// Authentication Services
export const authService = {
  // Login with Google token
  loginWithGoogle: async (userData) => {
    try {
      // Check if we're online first
      if (!navigator.onLine) {
        console.log("Device is offline, skipping backend login");
        
        // First ensure the user exists in Firestore
        try {
          const userRef = doc(db, "users", userData.uid);
          await setDoc(userRef, {
            email: userData.email,
            name: userData.name || userData.email.split('@')[0],
            role: userData.role,
            lastLogin: new Date(),
            updatedOffline: true
          }, { merge: true });
          console.log("Updated user data in Firestore while offline");
        } catch (firestoreError) {
          console.warn("Could not update Firestore while offline:", firestoreError);
        }
        
        return { 
          success: true, 
          message: "Logged in offline mode",
          offline: true,
          userData: userData
        };
      }
      
      // Send login request to backend
      const response = await api.post('/auth/login', {
        id_token: userData.idToken,
        user_type: userData.role
      });
      
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      
      // Still try to update Firestore directly as a last resort
      try {
        const userRef = doc(db, "users", userData.uid);
        await setDoc(userRef, {
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          role: userData.role,
          lastLoginError: new Date(),
          error: error.message
        }, { merge: true });
        console.log("Stored user data in Firestore despite errors");
        
        return { 
          success: true, 
          message: "Logged in with limited functionality",
          error: error.message,
          userData: userData
        };
      } catch (firestoreError) {
        console.error("Fatal error - could not communicate with any backend:", firestoreError);
      }
      
      throw error;
    }
  },
  
  // Get current user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      await getAuth().signOut();
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
};

// Class/Course Services
export const classService = {
  // Get all classes for a user
  getClasses: async (userId) => {
    try {
      const response = await api.get(`/api/classes/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  },
  
  // Get a specific class
  getClass: async (classId) => {
    try {
      const response = await api.get(`/api/class/${classId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching class ${classId}:`, error);
      throw error;
    }
  },
  
  // Create a new class (teacher only)
  createClass: async (classData) => {
    try {
      const response = await api.post('/api/class', classData);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },
  
  // Update a class (teacher only)
  updateClass: async (classId, classData) => {
    try {
      const response = await api.put(`/api/class/${classId}`, classData);
      return response.data;
    } catch (error) {
      console.error(`Error updating class ${classId}:`, error);
      throw error;
    }
  },
  
  // Delete a class (teacher only)
  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/api/class/${classId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting class ${classId}:`, error);
      throw error;
    }
  }
};

// Assignment Services
export const assignmentService = {
  // Get all assignments for a user
  getAssignments: async (userId) => {
    try {
      const response = await api.get(`/api/assignments/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  },
  
  // Get a specific assignment
  getAssignment: async (assignmentId) => {
    try {
      const response = await api.get(`/api/assignment/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${assignmentId}:`, error);
      throw error;
    }
  },
  
  // Create a new assignment (teacher only)
  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post('/api/assignment', assignmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },
  
  // Update an assignment (teacher only)
  updateAssignment: async (assignmentId, assignmentData) => {
    try {
      const response = await api.put(`/api/assignment/${assignmentId}`, assignmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating assignment ${assignmentId}:`, error);
      throw error;
    }
  },
  
  // Delete an assignment (teacher only)
  deleteAssignment: async (assignmentId) => {
    try {
      const response = await api.delete(`/api/assignment/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting assignment ${assignmentId}:`, error);
      throw error;
    }
  },
  
  // Submit an assignment (student only)
  submitAssignment: async (userId, classId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignment_id', classId);
      formData.append('student_id', userId);
      
      const response = await axios.post(`${API_BASE_URL}/upload/answer_sheet`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  },
  
  // Grade an assignment (teacher only)
  gradeAssignment: async (assignmentId, studentId, gradeData) => {
    try {
      const response = await api.post(`/api/grade/${assignmentId}/${studentId}`, gradeData);
      return response.data;
    } catch (error) {
      console.error('Error grading assignment:', error);
      throw error;
    }
  }
};

// File Upload Services
export const fileService = {
  // Upload question paper
  uploadQuestionPaper: async (file, assignmentId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignment_id', assignmentId);
      formData.append('category', 'question_papers');
      
      const response = await axios.post(`${API_BASE_URL}/upload/question_paper`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading question paper:', error);
      throw error;
    }
  },
  
  // Upload solution set
  uploadSolutionSet: async (file, assignmentId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assignment_id', assignmentId);
      formData.append('category', 'solutions');
      
      const response = await axios.post(`${API_BASE_URL}/upload/solution`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading solution set:', error);
      throw error;
    }
  },
  
  // Upload book/reference material
  uploadBook: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'books');
      
      const response = await axios.post(`${API_BASE_URL}/upload/book`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading book:', error);
      throw error;
    }
  }
};

// AI Chat Services
export const chatService = {
  // Send a chat message
  sendChatMessage: async (userId, message) => {
    try {
      const response = await api.post('/api/chat', {
        user_id: userId,
        message: message
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
  
  // Get chat history
  getChatHistory: async (userId) => {
    try {
      const response = await api.get(`/api/chat/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }
};

// Analytics Services
export const analyticsService = {
  // Get student performance analytics
  getStudentAnalytics: async (studentId) => {
    try {
      const response = await api.get(`/api/analytics/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      throw error;
    }
  },
  
  // Get class performance analytics (teacher only)
  getClassAnalytics: async (classId) => {
    try {
      const response = await api.get(`/api/analytics/class/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching class analytics:', error);
      throw error;
    }
  }
};

// Export all services
export default {
  auth: authService,
  classes: classService,
  assignments: assignmentService,
  files: fileService,
  chat: chatService,
  analytics: analyticsService
};