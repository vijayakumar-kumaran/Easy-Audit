import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, User, Lock, Eye, EyeOff, Sun, Moon, ArrowRight, ShieldAlert, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './css/LoginPage.css'; // Reuses login panel styles

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [usertype, setUsertype] = useState('audituser');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== retypePassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/signup', { username, password, usertype });
      setLoading(false);
      alert('User registered successfully');
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.error || 'Registration failed. Username may already exist.'
      );
      console.error(error);
    }
  };

  return (
    <div className="login-root-container">
      {/* Floating Theme Toggle */}
      <button className="login-theme-btn" onClick={toggleTheme}>
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="login-split-layout">
        {/* Left Brand Panel */}
        <div className="login-brand-panel">
          <div className="gradient-glow-orb"></div>
          <div className="brand-panel-content">
            <div className="brand-logo-badge">
              <Award className="brand-logo-icon-large" />
            </div>
            <h1 className="brand-title">EASY AUDIT</h1>
            <p className="brand-tagline">
              Join our compliance network to track tax filings, audit workflows, and securely manage client records.
            </p>
            <div className="brand-features-list">
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span>Role-based access controls</span>
              </div>
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span>Structured audit routing</span>
              </div>
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span>Encrypted credentials protection</span>
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
              <h2>Create Account</h2>
              <p>Sign up to start managing your audits</p>
            </div>

            {errorMessage && (
              <div className="login-error-banner">
                {errorMessage}
              </div>
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
                    placeholder="Create username"
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
                    placeholder="Create password"
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="retypePassword">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="retypePassword"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    placeholder="Re-type password"
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

              <div className="login-input-group">
                <label htmlFor="usertype">User Type / Access Role</label>
                <div className="input-with-icon">
                  <ShieldAlert size={18} className="field-icon" />
                  <select
                    id="usertype"
                    value={usertype}
                    onChange={(e) => setUsertype(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.75rem',
                      borderRadius: '10px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--input-color)',
                      fontFamily: 'var(--font-family)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                    required
                  >
                    <option value="admin">Admin (System Manager)</option>
                    <option value="audituser">Audit User (Work Officer)</option>
                    <option value="superuser">Super User (Auditor Head)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading} style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue-hover) 100%)', color: 'white', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)' }}>
                {loading ? 'Registering...' : 'Create Account'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="login-card-footer">
              <Link to="/login" className="signup-redirect-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;