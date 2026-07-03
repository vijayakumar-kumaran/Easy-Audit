import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiBell,
  FiPlusCircle
} from 'react-icons/fi';
import './css/HomePage.css';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="home-dashboard">
      <div className="welcome-banner">
        <h2>Welcome back, {user ? user.username : 'Guest'}!</h2>
        <p>Manage, track, and process your auditing workflow tasks seamlessly.</p>
      </div>

      <div className="dashboard-grid">
        {/* Section 1: Client Directory */}
        <div className="dashboard-card">
          <div className="card-header-icon color-blue">
            <FiUsers size={24} />
          </div>
          <h3>Individual Directory</h3>
          <p>Search, view details, and manage individual clients.</p>
          <div className="card-actions">
            {user && user.userType === 'admin' && (
              <Link to="/customer-signup" className="card-btn secondary-btn">
                <FiPlusCircle /> Register Client
              </Link>
            )}
            <Link to="/customers" className="card-btn primary-btn">
              {user && user.userType === 'audituser' ? 'My Clients' : 'Search Directory'}
            </Link>
          </div>
        </div>

        {/* Section 2: Business Directory */}
        <div className="dashboard-card">
          <div className="card-header-icon color-indigo">
            <FiBriefcase size={24} />
          </div>
          <h3>Business Directory</h3>
          <p>Search, view details, and manage corporate clients.</p>
          <div className="card-actions">
            {user && user.userType === 'admin' && (
              <Link to="/business-signup" className="card-btn secondary-btn">
                <FiPlusCircle /> Register Corporate
              </Link>
            )}
            <Link to="/business-list" className="card-btn primary-btn">
              {user && user.userType === 'audituser' ? 'My Clients' : 'Search Directory'}
            </Link>
          </div>
        </div>

        {/* Section 3: Tax Assessments */}
        <div className="dashboard-card">
          <div className="card-header-icon color-purple">
            <FiFileText size={24} />
          </div>
          <h3>Tax Assessments</h3>
          <p>Create, update, and review active tax assessments.</p>
          <div className="card-actions">
            <Link to="/tax-assesment" className="card-btn primary-btn">
              Individual Workflow
            </Link>
            <Link to="/business-tax-assessments" className="card-btn primary-btn">
              Business Workflow
            </Link>
          </div>
        </div>

        {/* Section 4: IT Notices */}
        <div className="dashboard-card">
          <div className="card-header-icon color-pink">
            <FiBell size={24} />
          </div>
          <h3>IT Notices</h3>
          <p>Process official notices, upload documents, and track response due dates.</p>
          <div className="card-actions">
            <Link to="/notice-assesment" className="card-btn primary-btn">
              Individual Notices
            </Link>
            <Link to="/business-notices" className="card-btn primary-btn">
              Business Notices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
