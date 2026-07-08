import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, PlusCircle, List, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import '../css/workflows.css';

const BusinessNotices = () => {
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
          <h1>Business IT Notice Tasks</h1>
          <p>Register new notices or manage pending compliance responses for businesses.</p>
        </div>
      </div>

      <div className="dispatch-grid">
        {isAdmin && (
          <div className="dispatch-card glass-card">
            <div className="dispatch-icon-wrap notice-bg">
              <PlusCircle size={28} />
            </div>
            <h2>Register Corporate Notice</h2>
            <p>Upload a new Income Tax or GST notice received for a business client and assign to an officer.</p>
            <Link to="/business-list-for-notice" className="dispatch-btn btn-primary">
              <span>Create IT Notice</span>
            </Link>
          </div>
        )}

        <div className="dispatch-card glass-card" style={{ gridColumn: !isAdmin ? 'span 2' : 'auto' }}>
          <div className="dispatch-icon-wrap ind-bg">
            <List size={28} />
          </div>
          <h2>{isAdmin ? 'Manage Corporate Notices' : 'My Active Notices'}</h2>
          <p>
            {isAdmin 
              ? 'Review, modify, assign, and track compliance response statuses for all business notices.'
              : 'View notices assigned to your queue, update compliance actions, and mark completed.'}
          </p>
          <Link to="/busITNoticeList" className="dispatch-btn view-act">
            <span>{isAdmin ? 'View Active Notices' : 'Start Notice Tasks'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessNotices;
