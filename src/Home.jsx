import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Users, Building2, FileText, Bell, PlusCircle, Search, 
  LogOut, PieChart as ChartIcon, ShieldAlert, Award
} from 'lucide-react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './css/HomePage.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBusinesses: 0,
    taxStats: { pending: 0, inProgress: 0, completed: 0, total: 0 },
    noticeStats: { pending: 0, inProgress: 0, completed: 0, total: 0 }
  });
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.userType === 'audituser') {
      navigate(`/home-audit?username=${user.username}`);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsRes = await axios.get('/api/dashboard-stats');
        setStats(statsRes.data);
        
        const txnsRes = await axios.get('/api/transactions');
        setRecentTxns(txnsRes.data.slice(0, 5));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="home-loading">
        <p>Loading Dashboard Analytics...</p>
      </div>
    );
  }

  // Data for Recharts
  const clientData = [
    { name: 'Individuals', value: stats?.totalCustomers || 0, color: '#6366f1' },
    { name: 'Businesses', value: stats?.totalBusinesses || 0, color: '#f8b400' }
  ];

  const taxData = [
    { name: 'Pending', value: stats?.taxStats?.pending || 0, color: '#ef4444' },
    { name: 'In Progress', value: stats?.taxStats?.inProgress || 0, color: '#3b82f6' },
    { name: 'Completed', value: stats?.taxStats?.completed || 0, color: '#10b981' }
  ];

  const noticeData = [
    { name: 'Pending', value: stats?.noticeStats?.pending || 0, color: '#ef4444' },
    { name: 'In Progress', value: stats?.noticeStats?.inProgress || 0, color: '#3b82f6' },
    { name: 'Completed', value: stats?.noticeStats?.completed || 0, color: '#10b981' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="home-dashboard">
      {/* Top Navigation */}
      <header className="dashboard-header glass-card">
        <div className="header-brand">
          <Award className="brand-icon" />
          <h1>EASY AUDIT</h1>
        </div>
        <div className="user-profile">
          <div className="profile-details">
            <span className="welcome-tag">Welcome,</span>
            <span className="username-tag">{user ? user.username : 'Guest'}</span>
            <span className="role-tag">{user ? user.userType : 'Visitor'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogoutClick}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <motion.div 
        className="dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Metric Cards Row */}
        <div className="metrics-row">
          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap ind-bg">
              <Users size={24} />
            </div>
            <div className="metric-info">
              <h3>Individual Clients</h3>
              <p className="metric-value">{stats.totalCustomers}</p>
            </div>
          </motion.div>

          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap bus-bg">
              <Building2 size={24} />
            </div>
            <div className="metric-info">
              <h3>Business Clients</h3>
              <p className="metric-value">{stats.totalBusinesses}</p>
            </div>
          </motion.div>

          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap tax-bg">
              <FileText size={24} />
            </div>
            <div className="metric-info">
              <h3>Tax Assessments</h3>
              <p className="metric-value">{stats.taxStats.total}</p>
              <div className="metric-sub">
                <span className="sub-completed">{stats.taxStats.completed} Done</span>
                <span className="sub-pending">{stats.taxStats.pending} Pending</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap notice-bg">
              <Bell size={24} />
            </div>
            <div className="metric-info">
              <h3>IT Notice Tasks</h3>
              <p className="metric-value">{stats.noticeStats.total}</p>
              <div className="metric-sub">
                <span className="sub-completed">{stats.noticeStats.completed} Done</span>
                <span className="sub-pending">{stats.noticeStats.pending} Pending</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts and Action Sections */}
        <div className="dashboard-content-grid">
          {/* Charts panel */}
          <motion.div className="charts-panel glass-card" variants={itemVariants}>
            <div className="panel-header">
              <ChartIcon size={18} />
              <h2>Audit Status Overview</h2>
            </div>
            <div className="charts-flex">
              <div className="chart-item">
                <h4>Tax Assessments Status</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={taxData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {taxData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-item">
                <h4>Notice Task Status</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={noticeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {noticeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div className="actions-panel glass-card" variants={itemVariants}>
            <div className="panel-header">
              <Search size={18} />
              <h2>Client Management</h2>
            </div>
            <div className="action-groups">
              <div className="action-category">
                <h3>Individuals</h3>
                <div className="actions-grid">
                  {user && user.userType === 'admin' && (
                    <Link to="/customer-signup" className="action-link add-act">
                      <PlusCircle size={16} />
                      <span>Register Client</span>
                    </Link>
                  )}
                  <Link to="/customers" className="action-link view-act">
                    <Search size={16} />
                    <span>Search Clients</span>
                  </Link>
                </div>
              </div>

              <div className="action-category">
                <h3>Businesses</h3>
                <div className="actions-grid">
                  {user && user.userType === 'admin' && (
                    <Link to="/business-signup" className="action-link add-act">
                      <PlusCircle size={16} />
                      <span>Register Business</span>
                    </Link>
                  )}
                  <Link to="/business-list" className="action-link view-act">
                    <Search size={16} />
                    <span>Search Businesses</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Workflow Actions Section */}
        <div className="workflow-section-title">
          <h2>Workflow Management</h2>
          <p>Assign tasks, review filings, and update tax notices.</p>
        </div>

        <div className="workflow-content-grid">
          <motion.div className="workflow-card glass-card" variants={itemVariants} whileHover={{ scale: 1.01 }}>
            <div className="card-top">
              <div className="workflow-badge ind-badge">Individual Audits</div>
            </div>
            <div className="workflow-actions-list">
              <Link to="/tax-assesment" className="workflow-button">
                <FileText size={16} />
                <span>{user && user.userType === 'audituser' ? 'My Tax Assessments Tasks' : 'Manage Tax Assessments'}</span>
              </Link>
              <Link to="/notice-assesment" className="workflow-button">
                <ShieldAlert size={16} />
                <span>{user && user.userType === 'audituser' ? 'My IT Notice Tasks' : 'Manage IT Notices'}</span>
              </Link>
            </div>
          </motion.div>

          <motion.div className="workflow-card glass-card" variants={itemVariants} whileHover={{ scale: 1.01 }}>
            <div className="card-top">
              <div className="workflow-badge bus-badge">Business Audits</div>
            </div>
            <div className="workflow-actions-list">
              <Link to="/business-tax-assessments" className="workflow-button">
                <Building2 size={16} />
                <span>{user && user.userType === 'audituser' ? 'My Tax Assessments Tasks' : 'Manage Tax Assessments'}</span>
              </Link>
              <Link to="/business-notices" className="workflow-button">
                <Bell size={16} />
                <span>{user && user.userType === 'audituser' ? 'My IT Notice Tasks' : 'Manage IT Notices'}</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {user && (user.userType === 'admin' || user.userType === 'superuser') && (
          <>
            <div className="workflow-section-title" style={{ marginTop: '2rem' }}>
              <h2>Recent Office Audit Activity</h2>
              <p>Real-time security logs of client registrations, task updates, and notice compliance. (Supervisor Watch Enabled)</p>
            </div>
            <motion.div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid var(--border-glass)' }} variants={itemVariants}>
              {recentTxns.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>No recent activity has been logged in the audit trail.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentTxns.map(tx => (
                    <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                      <div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-gold)', marginRight: '1rem' }}>{tx.transactionId}</span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{tx.type}</span> - <span style={{ color: 'var(--text-secondary)' }}>{tx.description}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '2px 8px', background: 'var(--bg-glass-hover)', borderRadius: '4px' }}>by {tx.performedBy}</span>
                    </div>
                  ))}
                  <Link to="/transactions" style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600, marginTop: '0.5rem', alignSelf: 'flex-start' }}>View All Audit Logs →</Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
