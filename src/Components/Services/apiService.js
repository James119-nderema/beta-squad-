// services/apiService.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Configure axios to include authentication token
const getAuthHeader = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      return { Authorization: `Bearer ${userData.token}` };
    }
  }
  return {};
};

const apiService = {
  // User registration
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/visitors/`, userData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { error: 'Registration failed. Please try again.' };
    }
  },

  // User login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, credentials);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw { error: 'Login failed. Please check your credentials.' };
    }
  },

  // Record time in
  recordTimeIn: async (visitorId) => {
    try {
      const headers = getAuthHeader();
      const response = await axios.post(`${API_URL}/time-in/`, {
        visitor: visitorId
      }, { headers });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized error - token expired or invalid
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
      }
      throw error.response?.data || { error: 'Failed to record time in' };
    }
  },

  // Record time out
  recordTimeOut: async (visitorId) => {
    try {
      const headers = getAuthHeader();
      const response = await axios.post(`${API_URL}/time-out/`, {
        visitor: visitorId
      }, { headers });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized error - token expired or invalid
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
      }
      throw error.response?.data || { error: 'Failed to record time out' };
    }
  },

  getUserInfo: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};

export default apiService;