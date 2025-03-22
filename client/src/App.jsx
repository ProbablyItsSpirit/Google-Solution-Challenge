import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import LoadingPage from './pages/LoadingPage';
import EnhancedFirebaseRulesGuide from './components/EnhancedFirebaseRulesGuide';
import { useUser } from './contexts/UserContext';

// Protected route component with permission checking
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole, loading, hasPermissions } = useUser();
  
  if (loading) {
    return <LoadingPage message="Checking authentication..." />;
  }
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // If permissions error, show the rules guide
  if (!hasPermissions) {
    return <EnhancedFirebaseRulesGuide />; 
  }
  
  // If an allowed role is specified and doesn't match the user's role
  if (allowedRole && userRole !== allowedRole) {
    // Redirect to the appropriate dashboard
    const redirectPath = userRole === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

// Routes with UserContext
const AppRoutes = () => {
  const { currentUser, userRole, loading, hasPermissions } = useUser();
  
  if (loading) {
    return <LoadingPage message="Initializing application..." />;
  }
  
  // If not logged in, or permissions issue with no user, show login page
  if (!currentUser && !hasPermissions) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/rules-guide" element={<EnhancedFirebaseRulesGuide />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  
  // If logged in but permissions issue, show rules guide
  if (currentUser && !hasPermissions) {
    return (
      <Routes>
        <Route path="/" element={<EnhancedFirebaseRulesGuide />} />
        <Route path="/rules-guide" element={<EnhancedFirebaseRulesGuide />} />
        <Route path="*" element={<Navigate to="/rules-guide" />} />
      </Routes>
    );
  }
  
  // Regular application routing
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          currentUser ? (
            <Navigate to={`/${userRole === "teacher" ? "teacher" : "student"}-dashboard`} replace />
          ) : (
            <Login />
          )
        } 
      />
      
      <Route path="/rules-guide" element={<EnhancedFirebaseRulesGuide />} />
      
      <Route 
        path="/teacher-dashboard" 
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/student-dashboard" 
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
};

export default App;