import API_BASE_URL from './config';
// src/Logout.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`${API_BASE_URL}/logout`)
      .then(response => {
        
        navigate('/login'); // Redirect to login page after successful logout
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
