import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';

// Create theme context
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if dark mode was previously set in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Get the current theme based on dark mode state
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);