import API_BASE_URL from './config';
// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './css/LoginPage.css'; // Ensure you have this CSS file created
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/login`, { username, password })
      .then(response => {
        if (response.data.success) {
          const userType = response.data.usertype;
          const avatar = response.data.avatar;
          login(userType, username, avatar);

          navigate('/home');
          
        } else {
          setErrorMessage('Unauthorized to login. Please check username and password.');
        }
      })
      .catch(error => {
        if (error.response) {
          // Server responded with a status other than 2xx
          if (error.response.status === 401) {
            setErrorMessage('Unauthorized: Incorrect username or password.');
          } else if (error.response.status === 500) {
            setErrorMessage('Server error: Please try again later.');
          } else {
            setErrorMessage('An unexpected error occurred.');
          }
        } else {
          // No response from server or other issues
          setErrorMessage('Network error: Please check your connection.');
        }
        console.error(error);
      });
  };


  return (
    <div className="login-container">
     <div className="login-content-container">
      <div className="login-box">
        <div className="login-header">
          <h1>EASY AUDIT</h1>
          <p>Tracking Audit Workflow.</p>
        </div>
        <div className="login-form">
          <h2>Account Login</h2>
          <p>Welcome to your audit workflow, where making a change begins at the click of a button.</p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <div className="login-footer">
            <a href="/signup">Create User</a>
            <a href="/forgotpassword">Forgot Password?</a>
          </div>
        </div>
        <div className="footer-links">
          <a href="#">Security Policy</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Legal</a>
          <a href="#">Technical Support</a>
        </div>
      </div>
    </div>  
    </div>
  );
};

export default LoginPage;
