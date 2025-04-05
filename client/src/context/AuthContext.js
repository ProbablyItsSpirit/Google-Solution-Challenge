import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken, isAuthenticated } from '../utils/authStorage';

// Create auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for token when app loads or refreshes
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // Get user data if needed from token or make an API call
        // const userData = await fetchUserData(); // Implement as needed
        setIsLoggedIn(true);
        // setUser(userData);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = (token, userData) => {
    setAuthToken(token);
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    removeAuthToken();
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook for using auth context
export const useAuth = () => useContext(AuthContext);
