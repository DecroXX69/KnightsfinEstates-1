import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use the correct import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Check for token on app start
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
            setUserData(decoded);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      userData, 
      setUserData,
      token,
      setToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;