import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './Authcontext.module.css';
const AuthContext = createContext();
axios.defaults.withCredentials = true; // Add this globally in your frontend
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  
  // References for timers
  const refreshTimerRef = useRef(null);
  const expirationTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  // Set up axios interceptor for automatic token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and specifically token expired and we haven't tried to refresh yet
        if (
          error.response?.status === 401 && 
          error.response?.data?.code === 'TOKEN_EXPIRED' && 
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          
          try {
            // Call the refresh token endpoint
            const refreshResponse = await axios.post('https://knightsfinestates-backend-1.onrender.com/api/auth/refresh');
            
            if (refreshResponse.data.success) {
              // Setup the session timers again with the new expiration
              setupSessionTimers(refreshResponse.data.expiresIn);
              
              // Retry the original request
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // If refresh failed, redirect to login
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        // If error is 401 but not token expired or refresh failed
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
          logout();
        }
        
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initial authentication check
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check user authentication status by trying to access a protected endpoint
        const response = await axios.get('https://knightsfinestates-backend-1.onrender.com/api/auth/verify');
        
        if (response.data.success) {
          setIsAuthenticated(true);
          setUserData(response.data.user);
          
          // Setup session timers
          setupSessionTimers(response.data.expiresIn);
        }
      } catch (error) {
        // Handle case where user is not authenticated
        console.log('Not authenticated');
        setIsAuthenticated(false);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Cleanup function to clear all timers when component unmounts
    return () => {
      clearAllTimers();
    };
  }, []);

  // Setup session timers based on token expiration
  const setupSessionTimers = (expiresInSeconds) => {
    // Clear any existing timers
    clearAllTimers();
    
    const expiresInMs = expiresInSeconds * 1000;
    const warningTime = 5 * 60 * 1000; // 5 minutes before expiration
    
    // Set timer to refresh token 1 minute before expiration
    refreshTimerRef.current = setTimeout(() => {
      refreshToken();
    }, expiresInMs - (60 * 1000));
    
    // Set timer to show warning before session expires
    warningTimerRef.current = setTimeout(() => {
      setSessionExpiring(true);
      
      // Start countdown timer
      const intervalId = setInterval(() => {
        const remaining = Math.round((expiresInMs - 
          (Date.now() - (new Date().getTime() - warningTime))) / 1000);
        
        setTimeRemaining(remaining > 0 ? remaining : 0);
        
        if (remaining <= 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    }, expiresInMs - warningTime);
    
    // Set timer for actual expiration (as a fallback)
    expirationTimerRef.current = setTimeout(() => {
      logout();
    }, expiresInMs);
  };

  // Clear all session timers
  const clearAllTimers = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (expirationTimerRef.current) clearTimeout(expirationTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    setSessionExpiring(false);
    setTimeRemaining(null);
  };

  // Function to refresh the access token
  const refreshToken = async () => {
    try {
      const response = await axios.post('https://knightsfinestates-backend-1.onrender.com/api/auth/refresh');
      
      if (response.data.success) {
        // Setup timers again with new expiration
        setupSessionTimers(response.data.expiresIn);
        setSessionExpiring(false);
      } else {
        // If refresh fails for some reason, log out
        logout();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  // Extend session in response to user activity
  const extendSession = () => {
    refreshToken();
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint to clear cookies
      await axios.post('https://knightsfinestates-backend-1.onrender.com/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      clearAllTimers();
      setIsAuthenticated(false);
      setUserData(null);
      
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      userData, 
      setUserData,
      logout,
      isLoading,
      sessionExpiring,
      timeRemaining,
      extendSession,
      refreshToken
    }}>
      {sessionExpiring && (
        <div className={styles.sessionTimeoutOverlay}>
          <div className={styles.timeoutModal}>
            <h3 className={styles.timeoutTitle}>Session About to Expire</h3>
            <p className={styles.timeoutMessage}>
              Your session will expire in{' '}
              <span className={styles.timeDisplay}>
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, '0')}
              </span>
            </p>
            <p className={styles.timeoutInfo}>
              Would you like to stay logged in?
            </p>
            <div className={styles.timeoutActions}>
              <button 
                onClick={extendSession} 
                className={`${styles.button} ${styles.stayButton}`}
              >
                Stay Logged In
              </button>
              <button 
                onClick={logout} 
                className={`${styles.button} ${styles.logoutButton}`}
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Verifying Authentication...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;