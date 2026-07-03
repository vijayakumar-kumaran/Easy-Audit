import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/tax_assesment.css';
import { useAuth } from '../AuthContext';

const BusinessNotices = () => {
  const { user } = useAuth();

  useEffect(() =>{

  },[user]);

  return (
    <div className="create-tax-assessment-page">
      <h1>Business IT Notices</h1>
      <div className="options">
        {user&& user.userType === 'admin' && (
          <Link to="/business-list-for-notice">
            <button className="option-button">Create IT Notice</button>
          </Link>
        )}
        <Link to="/busITNoticeList">
          <button className="option-button">{user&& user.userType === 'audituser' ? "Update IT Notice": "Edit/Modify IT Notices"}</button>
        </Link>
      </div>
    </div>
  );
};

export default BusinessNotices;
