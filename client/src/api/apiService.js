import axios from 'axios';
import { getAuthToken } from '../utils/authStorage';

const api = axios.create({
  baseURL: 'your-api-endpoint',
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
