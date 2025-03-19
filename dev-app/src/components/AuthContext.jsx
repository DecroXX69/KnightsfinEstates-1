import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Here you would call your refresh token endpoint if available
          // For now, we'll just redirect to login
          if (window.location.pathname !== '/login') {
            logout();
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Check for token on app start and on token change
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          
          if (decoded.exp * 1000 > Date.now()) {
            // Valid token
            setIsAuthenticated(true);
            setUserData(decoded);
            setToken(storedToken);
            
            // Set axios default header with the token
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
            // Expired token
            logout();
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [token]);

  // Logout function that can be used throughout the app
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      userData, 
      setUserData,
      token,
      setToken,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;