// src/services/api.js
import axios from 'axios';
import { getDatabase, ref, get, set } from "firebase/database";
import { db } from "../firebase"; //

const API_BASE_URL = 'https://solutionchallenge-e876c-default-rtdb.firebaseio.com'; 

// Fetch user data
export const getUserData = async (uid) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Fetch classes for a student
export const getClasses = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classroom/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

// Fetch assignments for a student
export const getAssignments = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

// Submit an assignment
export const submitAssignment = async (studentId, classId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('student_id', studentId);
    formData.append('classroom_id', classId);

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
};

// Send a chat message
export const sendChatMessage = async (studentId, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      student_id: studentId,
      message: message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// Fetch chat history
export const getChatHistory = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat_history/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};