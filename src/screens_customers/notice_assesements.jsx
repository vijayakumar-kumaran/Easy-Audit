import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/tax_assesment.css';
import { useAuth } from '../AuthContext';

const CustomersNoticeAssessment = () => {
  const {user} = useAuth();
  
  useEffect(() =>{

  },[user]);

  return (
    <div className="create-tax-assessment-page">
      <h1>Tax Notices</h1>
      <div className="options">
        {user&& user.userType === 'admin' && (
          <Link to="/customers-notice">
          <button className="option-button">Create IT Notice</button>
        </Link>
        )}
        
        <Link to="/notice-list">
          <button className="option-button">{user&& user.userType === 'audituser' ? "Update Notice": "Edit/Modify Notices"}</button>
        </Link>
      </div>
    </div>
  );
};

export default CustomersNoticeAssessment;
