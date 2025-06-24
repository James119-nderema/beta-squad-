// src/services/employeeService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/employees/';

export const employeeService = {
  // Create a new employee record
  createEmployee: async (employeeData) => {
    try {
      const response = await axios.post(API_URL, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Get all employees with optional filtering
  getAllEmployees: async (params = {}) => {
    try {
      const response = await axios.get(API_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  
  // Get a specific employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Update an employee record
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await axios.put(`${API_URL}${id}/`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete an employee record
  deleteEmployee: async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      return true;
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Get attendance statistics (could be implemented on backend)
  getAttendanceStats: async () => {
    try {
      const response = await axios.get(`${API_URL}stats/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      throw error;
    }
  },
  
  // Search employees by various criteria
  searchEmployees: async (query) => {
    try {
      const response = await axios.get(`${API_URL}search/`, { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Error searching employees:', error);
      throw error;
    }
  }
};