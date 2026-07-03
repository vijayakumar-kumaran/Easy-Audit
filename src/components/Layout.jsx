import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  FiHome,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiBell,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiUser,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import '../css/Layout.css';


const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });
  
  React.useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to determine if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className={`layout-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Visual background ambient glows */}
      <div className="bg-glow-bubble bubble-1"></div>
      <div className="bg-glow-bubble bubble-2"></div>
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {!isCollapsed && <span className="brand-name">EASY AUDIT</span>}
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
          </button>
        </div>

        {/* User profile card in sidebar */}
        {user && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              {user.avatar ? 
              <img 
              style={{borderRadius: '50%', width: '40px', height: '40px'}}
              src={user.avatar} alt="User Avatar" 
              /> :
              <FiUser size={24} 
              />}
            </div>
            {!isCollapsed && (
              <div className="profile-info">
                <span className="profile-username">{user.username}</span>
                <span className="profile-badge">
                  {user.userType === 'admin' ? 'Admin' : 'Auditor'}
                </span>
              </div>
            )}
          </div>
        )}

        <nav className="sidebar-nav">
          <div className="nav-section-title">{isCollapsed ? '•' : 'Main'}</div>
          <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
            <FiHome className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">Dashboard</span>}
          </Link>

          <div className="nav-section-title">{isCollapsed ? '•' : 'Clients'}</div>
          <Link to="/customers" className={`nav-link ${isActive('/customers') ? 'active' : ''}`}>
            <FiUsers className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">Individual Clients</span>}
          </Link>
          <Link to="/business-list" className={`nav-link ${isActive('/business-list') ? 'active' : ''}`}>
            <FiBriefcase className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">Business Clients</span>}
          </Link>

          {user && user.userType === 'admin' && (
            <>
              <Link to="/customer-signup" className={`nav-link ${isActive('/customer-signup') ? 'active' : ''}`}>
                <FiUsers className="nav-icon" size={18} />
                {!isCollapsed && <span className="nav-text">Register Indiv.</span>}
              </Link>
              <Link to="/business-signup" className={`nav-link ${isActive('/business-signup') ? 'active' : ''}`}>
                <FiBriefcase className="nav-icon" size={18} />
                {!isCollapsed && <span className="nav-text">Register Business</span>}
              </Link>
            </>
          )}

          <div className="nav-section-title">{isCollapsed ? '•' : 'Individual Workflows'}</div>
          <Link to="/tax-assesment" className={`nav-link ${isActive('/tax-assesment') ? 'active' : ''}`}>
            <FiFileText className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">Tax Assessments</span>}
          </Link>
          <Link to="/notice-assesment" className={`nav-link ${isActive('/notice-assesment') ? 'active' : ''}`}>
            <FiBell className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">IT Notices</span>}
          </Link>

          <div className="nav-section-title">{isCollapsed ? '•' : 'Business Workflows'}</div>
          <Link to="/business-tax-assessments" className={`nav-link ${isActive('/business-tax-assessments') ? 'active' : ''}`}>
            <FiFileText className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">Tax Assessments</span>}
          </Link>
          <Link to="/business-notices" className={`nav-link ${isActive('/business-notices') ? 'active' : ''}`}>
            <FiBell className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">IT Notices</span>}
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut className="nav-icon" size={18} />
            {!isCollapsed && <span className="nav-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-area">
        {/* Top Header */}
        <header className="main-header">
          <div className="header-breadcrumbs">
            <span className="breadcrumb-parent">EasyAudit</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">
              {location.pathname.substring(1).replace('-', ' ') || 'Dashboard'}
            </span>
          </div>
          <div className="header-user-panel">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <div className="user-details">
              <span className="user-name">{user ? user.username : 'Guest'}</span>
              <span className="user-role">{user ? (user.userType === 'admin' ? 'Administrator' : 'Audit Staff') : ''}</span>
            </div>
            <div className="header-avatar">
              <FiUser size={22} />
            </div>
          </div>
        </header>

        {/* Content Page */}
        <main className="content-container">
          <div className="fade-in-page">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
