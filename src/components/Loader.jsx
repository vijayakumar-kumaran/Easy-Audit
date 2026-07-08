import React from 'react';
import './Loader.css';

const Loader = ({ message = "Loading EasyAudit..." }) => {
  return (
    <div className="loader-container">
      <div className="loader-glass">
        <div className="spinner">
          <div className="spinner-inner"></div>
        </div>
        <p className="loader-text">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
