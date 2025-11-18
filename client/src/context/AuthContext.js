import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  
  // Safely parse user data from localStorage
  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  };
  
  const [user, setUser] = useState(getUserFromStorage());
  
  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Validate token by making a test API call
  const validateToken = async () => {
    if (!token) return false;
    
    try {
      const response = await api.get('/auth/verify');
      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // Auto-logout and redirect when token is invalid
  const handleInvalidToken = () => {
    console.warn('Token is invalid or expired. Redirecting to login...');
    logout();
    
    // Use window.location for redirect if navigate is not available
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
      window.location.href = '/login';
    }
  };

  // Set up API response interceptor for token validation
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          handleInvalidToken();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Validate token on component mount and periodically
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        const isValid = await validateToken();
        if (!isValid) {
          handleInvalidToken();
        }
      }
    };

    // Check token validity on mount
    checkTokenValidity();

    // Set up periodic token validation (every 5 minutes)
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};