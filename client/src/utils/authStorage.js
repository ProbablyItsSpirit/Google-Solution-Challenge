/**
 * Utilities for storing and retrieving authentication tokens
 */

// Set the token in localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

// Get the token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Remove token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};
