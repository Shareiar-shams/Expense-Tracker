import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'An error occurred',
    };
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'An error occurred',
    };
  }
};