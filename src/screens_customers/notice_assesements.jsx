import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, PlusCircle, List, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import '../css/workflows.css';

const CustomersNoticeAssessment = () => {
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
          <h1>Individual IT Notice Tasks</h1>
          <p>Issue new IT notices or review responses to outstanding queries.</p>
        </div>
      </div>

      <div className="dispatch-grid">
        {isAdmin && (
          <div className="dispatch-card glass-card">
            <div className="dispatch-icon-wrap notice-bg">
              <PlusCircle size={28} />
            </div>
            <h2>Register New IT Notice</h2>
            <p>Upload a new Income Tax notice received for an individual client and assign it to an officer.</p>
            <Link to="/customers-notice" className="dispatch-btn btn-primary">
              <span>Create IT Notice</span>
            </Link>
          </div>
        )}

        <div className="dispatch-card glass-card" style={{ gridColumn: !isAdmin ? 'span 2' : 'auto' }}>
          <div className="dispatch-icon-wrap ind-bg">
            <List size={28} />
          </div>
          <h2>{isAdmin ? 'Manage Notice Tasks' : 'My Active Notices'}</h2>
          <p>
            {isAdmin 
              ? 'Review, modify, assign, and track compliance response statuses for all individual notices.'
              : 'View notices assigned to your queue, update compliance actions, and mark completed.'}
          </p>
          <Link to="/notice-list" className="dispatch-btn view-act">
            <span>{isAdmin ? 'View Active Notices' : 'Start Notice Tasks'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomersNoticeAssessment;
