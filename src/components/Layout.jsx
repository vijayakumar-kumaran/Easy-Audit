import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Building2, FileText, Bell, LogOut, LayoutDashboard, 
  Menu, ChevronLeft, ChevronRight, Sun, Moon, ShieldAlert, Award,
  Mail, History
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkNotifRead = async (id, link) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
      setNotifOpen(false);
      if (link) {
        navigate(link);
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleClearNotif = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.userType || 'audituser';
  const isAuditUser = userRole === 'audituser';

  // Determine dashboard link based on user type
  const dashboardLink = isAuditUser 
    ? `/home-audit?username=${user.username}` 
    : '/home';

  // Breadcrumbs resolver
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/messages') return ['Workspace', 'Message Centre'];
    if (path === '/transactions') return ['Workspace', 'Transaction Trail'];
    if (path.startsWith('/home-audit') || path === '/home') {
      return ['Workspace', 'Dashboard'];
    }
    if (path === '/customer-signup') return ['Directory', 'Individual Register'];
    if (path === '/customers') return ['Directory', 'Individual Clients'];
    if (path.startsWith('/customer/')) return ['Directory', 'Individual Clients', 'Profile Details'];
    if (path === '/tax-assesment') return ['Workflows', 'Individual Tax Assessments'];
    if (path.startsWith('/create-tax-assessment/')) return ['Workflows', 'Individual Tax', 'Create Assessment'];
    if (path === '/customers_tax') return ['Workflows', 'Individual Tax', 'Select Client'];
    if (path === '/update-assessments') return ['Workflows', 'Individual Tax', 'List Tasks'];
    if (path.startsWith('/update-tax-assessment/')) return ['Workflows', 'Individual Tax', 'Update Assessment'];
    if (path === '/notice-assesment') return ['Workflows', 'Individual IT Notices'];
    if (path === '/customers-notice') return ['Workflows', 'Individual Notices', 'Select Client'];
    if (path.startsWith('/create-it-notice/')) return ['Workflows', 'Individual Notices', 'Create Notice'];
    if (path === '/notice-list') return ['Workflows', 'Individual Notices', 'List Tasks'];
    if (path.startsWith('/edit-it-notice/')) return ['Workflows', 'Individual Notices', 'Edit Notice'];

    if (path === '/business-signup') return ['Directory', 'Business Register'];
    if (path === '/business-list') return ['Directory', 'Business Clients'];
    if (path.startsWith('/business-Details/')) return ['Directory', 'Business Clients', 'Profile Details'];
    if (path === '/business-tax-assessments') return ['Workflows', 'Business Tax Assessments'];
    if (path === '/business-list-for-tax') return ['Workflows', 'Business Tax', 'Select Client'];
    if (path.startsWith('/create-tax-business/')) return ['Workflows', 'Business Tax', 'Create Assessment'];
    if (path === '/business-list-of-tax-assessments') return ['Workflows', 'Business Tax', 'List Tasks'];
    if (path.startsWith('/update-bus-tax-assessment/')) return ['Workflows', 'Business Tax', 'Update Assessment'];
    if (path === '/business-notices') return ['Workflows', 'Business IT Notices'];
    if (path === '/business-list-for-notice') return ['Workflows', 'Business Notices', 'Select Client'];
    if (path.startsWith('/create-bus-it-notice/')) return ['Workflows', 'Business Notices', 'Create Notice'];
    if (path === '/busITNoticeList') return ['Workflows', 'Business Notices', 'List Tasks'];
    if (path.startsWith('/update-bus-it-notice/')) return ['Workflows', 'Business Notices', 'Update Notice'];

    return ['Workspace', 'View'];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      category: 'Main',
      items: [
        { label: 'Dashboard', path: dashboardLink, icon: LayoutDashboard },
        { label: 'Message Centre', path: '/messages', icon: Mail }
      ]
    },
    { 
      category: 'Directory',
      items: [
        { label: 'Individual Clients', path: '/customers', icon: Users },
        { label: 'Business Clients', path: '/business-list', icon: Building2 }
      ]
    },
    { 
      category: 'Workflows',
      items: [
        { 
          label: 'Individual Tax', 
          path: '/tax-assesment', 
          icon: FileText 
        },
        { 
          label: 'Individual Notices', 
          path: '/notice-list', 
          icon: Bell 
        },
        { 
          label: 'Business Tax', 
          path: '/business-tax-assessments', 
          icon: FileText 
        },
        { 
          label: 'Business Notices', 
          path: '/busITNoticeList', 
          icon: Bell 
        }
      ]
    },
    {
      category: 'Audit Log',
      items: [
        { label: 'Transaction Trail', path: '/transactions', icon: History }
      ]
    }
  ];

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobileOpen = () => setMobileOpen(!mobileOpen);

  return (
    <div className={`layout-root ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Panel */}
      <aside className={`sidebar-container glass-card ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Award className="sidebar-logo-icon" />
          {!collapsed && <span className="logo-text">EASY AUDIT</span>}
          <button className="collapse-btn" onClick={toggleCollapsed}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((cat, idx) => (
            <div key={idx} className="nav-category-group">
              {!collapsed && <span className="nav-category-title">{cat.category}</span>}
              <div className="nav-items-list">
                {cat.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  // Handle loose active route match
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/' && location.pathname.startsWith(item.path.split('?')[0]));
                  return (
                    <Link 
                      key={itemIdx} 
                      to={item.path} 
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={18} className="nav-icon" />
                      {!collapsed && <span className="nav-label">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-nav-btn nav-item" onClick={handleLogoutClick}>
            <LogOut size={18} className="nav-icon" />
            {!collapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main workspace section */}
      <div className="workspace-main">
        {/* Topbar navigation header */}
        <header className="workspace-topbar glass-card">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={toggleMobileOpen}>
              <Menu size={20} />
            </button>
            <div className="breadcrumbs">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="crumb-separator">/</span>}
                  <span className={`crumb-item ${idx === breadcrumbs.length - 1 ? 'active' : ''}`}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="topbar-right">
            {/* Notification Bell */}
            <div className="notifications-wrapper" style={{ position: 'relative' }}>
              <button 
                className={`theme-toggle-btn ${notifOpen ? 'active' : ''}`}
                onClick={() => setNotifOpen(!notifOpen)} 
                title="View Notifications"
              >
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                  <span className="notif-badge-counter">{unreadNotifCount}</span>
                )}
              </button>

              {notifOpen && (
                <div className="notif-dropdown-panel glass-card">
                  <div className="notif-dropdown-header">
                    <span>Notifications ({unreadNotifCount} unread)</span>
                    <button onClick={async () => {
                      for (const n of notifications.filter(x => !x.isRead)) {
                        await axios.put(`http://localhost:5000/api/notifications/${n._id}/read`);
                      }
                      fetchNotifications();
                    }}>Mark all read</button>
                  </div>
                  <div className="notif-dropdown-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty-state">
                        <span>No notifications yet.</span>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif._id} 
                          className={`notif-dropdown-item ${!notif.isRead ? 'unread' : ''}`}
                          onClick={() => handleMarkNotifRead(notif._id, notif.link)}
                        >
                          <div className="notif-item-title">{notif.title}</div>
                          <div className="notif-item-msg">{notif.message}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                            <span className="notif-item-time">
                              {new Date(notif.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button 
                              style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', fontSize: '0.65rem', cursor: 'pointer' }}
                              onClick={(e) => handleClearNotif(e, notif._id)}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Light/Dark Toggle */}
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme} 
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Profile widget */}
            <div className="user-profile-widget">
              <div className="avatar-letter">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user.username}</span>
                <span className="profile-role">{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content canvas */}
        <main className="workspace-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="content-inner"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile sidebar overlay backdrop */}
      {mobileOpen && <div className="sidebar-overlay" onClick={toggleMobileOpen}></div>}
    </div>
  );
};

export default Layout;
