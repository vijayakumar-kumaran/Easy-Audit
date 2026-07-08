import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, PlusCircle, List, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import '../css/workflows.css';

const BusinessTaxAssessment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user && user.userType === 'admin';

  return (
    <div className="workflow-dispatch-page fade-in">
      <div className="view-page-header">
        <div className="header-meta">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1>Business Tax Assessments</h1>
          <p>Initialize tax audit procedures or review corporate tax filings.</p>
        </div>
      </div>

      <div className="dispatch-grid">
        {isAdmin && (
          <div className="dispatch-card glass-card">
            <div className="dispatch-icon-wrap bus-bg">
              <PlusCircle size={28} />
            </div>
            <h2>Register Corporate Audit</h2>
            <p>Initialize a new corporate tax audit or GST assessment for a registered business client.</p>
            <Link to="/business-list-for-tax" className="dispatch-btn btn-primary">
              <span>Create Assessment</span>
            </Link>
          </div>
        )}

        <div className="dispatch-card glass-card" style={{ gridColumn: !isAdmin ? 'span 2' : 'auto' }}>
          <div className="dispatch-icon-wrap ind-bg">
            <List size={28} />
          </div>
          <h2>{isAdmin ? 'Manage Corporate Audits' : 'My Assigned Audits'}</h2>
          <p>
            {isAdmin 
              ? 'Review, modify, assign, and track status for all registered corporate tax assessments.'
              : 'View company tax audits assigned to your queue, leave logs, and update status.'}
          </p>
          <Link to="/business-list-of-tax-assessments" className="dispatch-btn view-act">
            <span>{isAdmin ? 'View Audits List' : 'Start Audit Queue'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessTaxAssessment;
