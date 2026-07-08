import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, List, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import '../css/workflows.css';

const CustomersTaxAssessment = () => {
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
          <h1>Individual Tax Assessments</h1>
          <p>Create new filings or track progress of existing tax audits.</p>
        </div>
      </div>

      <div className="dispatch-grid">
        {isAdmin && (
          <div className="dispatch-card glass-card">
            <div className="dispatch-icon-wrap ind-bg">
              <PlusCircle size={28} />
            </div>
            <h2>Register New Assessment</h2>
            <p>Initialize a new income tax assessment workflow for an individual client profile.</p>
            <Link to="/customers_tax" className="dispatch-btn btn-primary">
              <span>Create Assessment</span>
            </Link>
          </div>
        )}

        <div className="dispatch-card glass-card" style={{ gridColumn: !isAdmin ? 'span 2' : 'auto' }}>
          <div className="dispatch-icon-wrap tax-bg">
            <List size={28} />
          </div>
          <h2>{isAdmin ? 'Manage Audits' : 'My Assigned Audits'}</h2>
          <p>
            {isAdmin 
              ? 'Review, modify, assign, and track all outstanding individual tax assessments.'
              : 'View tax assessments assigned to your queue, leave comments, and update status.'}
          </p>
          <Link to="/update-assessments" className="dispatch-btn view-act">
            <span>{isAdmin ? 'View Assessments List' : 'Start Audit Queue'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomersTaxAssessment;
