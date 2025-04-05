import axios from 'axios';

// Backend API URL (replace with your actual backend URL)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Service for handling document grading API requests
 */
const gradeService = {
  /**
   * Submit documents for grading
   * @param {Object} fileData Object containing file URLs and metadata
   * @param {string} userId User ID
   * @returns {Promise} Grading results
   */
  gradeDocuments: async (fileData, userId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/grade`, {
        userId,
        files: fileData
      });
      
      return response.data;
    } catch (error) {
      console.error("Error grading documents:", error);
      throw error;
    }
  },
  
  /**
   * Get previous grading history
   * @param {string} userId User ID
   * @returns {Promise} History of grading results
   */
  getGradingHistory: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/grade/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grading history:", error);
      throw error;
    }
  },
  
  /**
   * Get detailed analysis of a specific grading
   * @param {string} gradingId Grading ID
   * @returns {Promise} Detailed grading analysis
   */
  getGradingAnalysis: async (gradingId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/grade/analysis/${gradingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grading analysis:", error);
      throw error;
    }
  }
};

export default gradeService;
