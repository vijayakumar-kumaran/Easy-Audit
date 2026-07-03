import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/tax_assesment.css';
import { useAuth } from '../AuthContext';
const CustomersTaxAssessment = () => {
  const { user} = useAuth();
  useEffect(() => {
    }, [user]);

  return (
    <div className="create-tax-assessment-page">
      <h1>Tax Assessment</h1>
      <div className="options">
        {user&& user.userType === 'admin' && (
          <Link to="/customers_tax">
          <button className="option-button">Create Tax Assessment</button>
        </Link>
        )}
        <Link to="/update-assessments">
          <button className="option-button">{user && user.userType === 'audituser' ? "Update Assessments" : "Edit/Modify Assessments"}</button>
        </Link>
      </div>
    </div>
  );
};

export default CustomersTaxAssessment;
