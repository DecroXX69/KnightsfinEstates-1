import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext.jsx';
import styles from './Login.module.css';
import axios from 'axios';
axios.defaults.withCredentials = true; // Add this globally in your frontend
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsAuthenticated, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        'https://knightsfinestates-backend-1.onrender.com/api/login',
        { email, password, rememberMe },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsAuthenticated(true);
        setUserData({
          ...response.data.user,
          sessionDuration: rememberMe ? '30 days' : '7 days'
        });
        navigate('/admin');
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2 className={styles.loginHeading}>Admin Login</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter your email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter your password"
            />
          </div>
          <div className={styles.rememberMeContainer}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="rememberMe" className={styles.rememberMeLabel}>
              Remember me 
            </label>
          </div>
          <button 
            type="submit" 
            className={`${styles.loginButton} ${isSubmitting ? styles.disabledButton : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.loadingSpinner}>
                <span className={styles.spinnerDot}></span>
                <span className={styles.spinnerDot}></span>
                <span className={styles.spinnerDot}></span>
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;