import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, User, Lock, Eye, EyeOff, Sun, Moon, ArrowRight } from 'lucide-react';

import axios from 'axios';
import { useAuth } from './AuthContext';
import './css/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [showWakeupModal, setShowWakeupModal] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const { login, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setLoading(true);

    let modalTimeout;
    let progressInterval;

    // Show wake-up modal only if login takes longer than 3 seconds
    modalTimeout = setTimeout(() => {
      setShowWakeupModal(true);
      setProgressStep(0);

      progressInterval = setInterval(() => {
        setProgressStep((prev) => {
          if (prev >= 3) return prev;
          return prev + 1;
        });
      }, 2500);

    }, 3000);

    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      clearTimeout(modalTimeout);
      clearInterval(progressInterval);

      setShowWakeupModal(false);
      setProgressStep(0);
      setLoading(false);

      if (response.data.success) {
        const userType = response.data.usertype;

        login(userType, username);

        if (userType === 'audituser') {
          navigate(`/home-audit?username=${username}`);
        } else {
          navigate('/home');
        }
      } else {
        setErrorMessage(
          'Unauthorized to login. Please check username and password.'
        );
      }

    } catch (error) {

      clearTimeout(modalTimeout);
      clearInterval(progressInterval);

      setShowWakeupModal(false);
      setProgressStep(0);
      setLoading(false);

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Incorrect username or password.');
        } else if (error.response.status === 500) {
          setErrorMessage('Server error: Please try again later.');
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      } else {
        setErrorMessage('Network error: Please check your connection.');
      }

      console.error(error);
    }
  };

  return (
    <div className="login-root-container">
      {/* Theme Switcher on Login Page */}


      <div className="login-split-layout">
        {/* Left Info Panel */}
        <div className="login-brand-panel">
          <div className="gradient-glow-orb"></div>
          <div className="brand-panel-content">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="brand-logo-badge"
            >
              <Award className="brand-logo-icon-large" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="brand-title"
            >
              EASY AUDIT
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="brand-tagline"
            >
              Enterprise-grade workflow tracking, document auditing, and regulatory compliance.
            </motion.p>
            <div className="brand-features-list">
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span>Individual & Business Workflows</span>
              </div>
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span>IT Notice Deadline Tracking</span>
              </div>
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span>Secure Document Vault</span>
              </div>
            </div>
          </div>
          <div className="brand-footer-text">
            © 2026 EasyAudit Inc. All rights reserved.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-form-panel">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="login-card-container glass-card"
          >
            <div className="login-card-header">
              <h2>Account Sign In</h2>
              <p>Enter your credentials to access your audit workspace</p>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="login-error-banner"
              >
                {errorMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="login-form-body">
              <div className="login-input-group">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                  <User size={18} className="field-icon" />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="forgot-password-link">
                <a href="#forgot">Forgot Password?</a>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="login-card-footer">
              <span>Don't have an account?</span>
              <Link to="/signup" className="signup-redirect-link">Create Account</Link>
            </div>
          </motion.div>
        </div>
      </div>

      {showWakeupModal && (
        <div className="login-loading-modal">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="loading-modal-card"
          >
            <div className="loading-spinner" />

            <h3>Signing in...</h3>

            <div className="login-progress-list">
              <div className={progressStep >= 0 ? "done" : ""}>
                ✓ Connecting...
              </div>

              <div className={progressStep >= 1 ? "done" : ""}>
                ✓ Waking up server...
              </div>

              <div className={progressStep >= 2 ? "done" : ""}>
                ✓ Preparing workspace...
              </div>

              <div className={progressStep >= 3 ? "done" : ""}>
                ✓ Almost there...
              </div>
            </div>

            <p className="loading-note">
              Our backend is hosted on a free service.
              The first login after inactivity may take around
              <strong> 10–15 seconds.</strong>
            </p>

          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
