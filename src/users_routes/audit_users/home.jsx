import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from 'recharts';
import { 
  Users, Building2, FileText, Bell, PlusCircle, Search, LogOut, CheckCircle, Clock
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import '../../css/HomePage.css'; // Reuses dashboard core layout styles

const AuditHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const params = new URLSearchParams(location.search);
  const queryUsername = params.get('username');
  const username = queryUsername || (user ? user.username : 'Audit User');

  const [assignedTaxes, setAssignedTaxes] = useState([]);
  const [assignedNotices, setAssignedNotices] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedData = async () => {
      try {
        setLoading(true);
        // Fetch assigned tax assessments
        const taxRes = await axios.get(`/api/customer-tax-assessments?username=${username}`);
        const busTaxRes = await axios.get(`/api/list-of-tax-assessments?username=${username}`);
        const allTaxes = [
          ...(Array.isArray(taxRes.data) ? taxRes.data : []),
          ...(Array.isArray(busTaxRes.data) ? busTaxRes.data : [])
        ];
        setAssignedTaxes(allTaxes);

        // Fetch assigned notices
        const noticeRes = await axios.get(`/api/it-notices?username=${username}`);
        const busNoticeRes = await axios.get(`/api/bus-it-notices?username=${username}`);
        const allNotices = [
          ...(Array.isArray(noticeRes.data) ? noticeRes.data : []),
          ...(Array.isArray(busNoticeRes.data) ? busNoticeRes.data : [])
        ];
        setAssignedNotices(allNotices);

        // Fetch user relevant transactions
        const txRes = await axios.get('/api/transactions');
        setRecentTxns(txRes.data.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching assigned audit data:', error);
        setLoading(false);
      }
    };

    if (username) {
      fetchAssignedData();
    }
  }, [username]);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const getStatusCount = (list, status) => {
    return list.filter(item => item.status && item.status.toLowerCase() === status.toLowerCase()).length;
  };

  // Chart data
  const taxStatsData = [
    { name: 'Pending', value: getStatusCount(assignedTaxes, 'Pending'), color: '#ef4444' },
    { name: 'In Progress', value: getStatusCount(assignedTaxes, 'In Progress') + getStatusCount(assignedTaxes, 'In-Progress'), color: '#3b82f6' },
    { name: 'Completed', value: getStatusCount(assignedTaxes, 'Completed'), color: '#10b981' }
  ];

  const noticeStatsData = [
    { name: 'Pending', value: getStatusCount(assignedNotices, 'Pending'), color: '#ef4444' },
    { name: 'In Progress', value: getStatusCount(assignedNotices, 'In Progress') + getStatusCount(assignedNotices, 'In-Progress'), color: '#3b82f6' },
    { name: 'Completed', value: getStatusCount(assignedNotices, 'Completed'), color: '#10b981' }
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

  if (loading) {
    return (
      <div className="home-loading">
        <p>Loading Audit Workspace...</p>
      </div>
    );
  }

  return (
    <div className="home-dashboard">
      {/* Header */}
      <header className="dashboard-header glass-card">
        <div className="header-brand">
          <CheckCircle className="brand-icon" style={{ color: '#10b981' }} />
          <h1>AUDIT WORKSPACE</h1>
        </div>
        <div className="user-profile">
          <div className="profile-details">
            <span className="welcome-tag">Logged in as,</span>
            <span className="username-tag">{username}</span>
            <span className="role-tag" style={{ background: 'rgba(16, 185, 129, 0.61)', color: '#000000', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              Audit Officer
            </span>
          </div>
          
        </div>
      </header>

      <motion.div 
        className="dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Stats Row */}
        <div className="metrics-row">
          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap ind-bg">
              <FileText size={24} />
            </div>
            <div className="metric-info">
              <h3>Assigned Tax Assessments</h3>
              <p className="metric-value">{assignedTaxes.length}</p>
              <div className="metric-sub">
                <span className="sub-completed">{getStatusCount(assignedTaxes, 'Completed')} Completed</span>
                <span className="sub-pending">{getStatusCount(assignedTaxes, 'Pending')} Pending</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap notice-bg">
              <Bell size={24} />
            </div>
            <div className="metric-info">
              <h3>Assigned IT Notices</h3>
              <p className="metric-value">{assignedNotices.length}</p>
              <div className="metric-sub">
                <span className="sub-completed">{getStatusCount(assignedNotices, 'Completed')} Resolved</span>
                <span className="sub-pending">{getStatusCount(assignedNotices, 'Pending')} Active</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap tax-bg">
              <CheckCircle size={24} />
            </div>
            <div className="metric-info">
              <h3>Completed Tasks</h3>
              <p className="metric-value">
                {getStatusCount(assignedTaxes, 'Completed') + getStatusCount(assignedNotices, 'Completed')}
              </p>
            </div>
          </motion.div>

          <motion.div className="metric-card glass-card" variants={itemVariants} whileHover={{ y: -5 }}>
            <div className="metric-icon-wrap bus-bg">
              <Clock size={24} />
            </div>
            <div className="metric-info">
              <h3>Tasks In-Progress</h3>
              <p className="metric-value">
                {getStatusCount(assignedTaxes, 'In Progress') + getStatusCount(assignedTaxes, 'In-Progress') + 
                 getStatusCount(assignedNotices, 'In Progress') + getStatusCount(assignedNotices, 'In-Progress')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="dashboard-content-grid">
          {/* Recharts Bar Chart */}
          <motion.div className="charts-panel glass-card" variants={itemVariants}>
            <div className="panel-header">
              <Clock size={18} />
              <h2>My Work Status Aggregates</h2>
            </div>
            <div className="charts-flex">
              <div className="chart-item">
                <h4>My Tax Assessments</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={taxStatsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {taxStatsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-item">
                <h4>My IT Notices</h4>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={noticeStatsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {noticeStatsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Client Search */}
          <motion.div className="actions-panel glass-card" variants={itemVariants}>
            <div className="panel-header">
              <Search size={18} />
              <h2>Client Verification</h2>
            </div>
            <div className="action-groups">
              <div className="action-category">
                <h3>View Client Directory</h3>
                <div className="actions-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <Link to="/customers" className="action-link view-act" style={{ padding: '1rem' }}>
                    <Users size={16} />
                    <span>Search Individual Clients</span>
                  </Link>
                  <Link to="/business-list" className="action-link view-act" style={{ padding: '1rem', marginTop: '0.5rem' }}>
                    <Building2 size={16} />
                    <span>Search Business Clients</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Audit Workflows */}
        <div className="workflow-section-title">
          <h2>Assigned Workflows</h2>
          <p>View, update, and resolve audit tasks assigned specifically to you.</p>
        </div>

        <div className="workflow-content-grid">
          <motion.div className="workflow-card glass-card" variants={itemVariants} whileHover={{ scale: 1.01 }}>
            <div className="card-top">
              <div className="workflow-badge ind-badge">Assigned Individual Audits</div>
            </div>
            <div className="workflow-actions-list">
              <Link to="/tax-assesment" className="workflow-button">
                <FileText size={16} />
                <span>My Tax Assessments Tasks ({assignedTaxes.filter(t => t.customerId).length})</span>
              </Link>
              <Link to="/notice-assesment" className="workflow-button">
                <Bell size={16} />
                <span>My IT Notice Tasks ({assignedNotices.filter(n => n.customerId).length})</span>
              </Link>
            </div>
          </motion.div>

          <motion.div className="workflow-card glass-card" variants={itemVariants} whileHover={{ scale: 1.01 }}>
            <div className="card-top">
              <div className="workflow-badge bus-badge">Assigned Business Audits</div>
            </div>
            <div className="workflow-actions-list">
              <Link to="/business-tax-assessments" className="workflow-button">
                <Building2 size={16} />
                <span>My Tax Assessments Tasks ({assignedTaxes.filter(t => t.business_listID).length})</span>
              </Link>
              <Link to="/business-notices" className="workflow-button">
                <Bell size={16} />
                <span>My IT Notice Tasks ({assignedNotices.filter(n => n.businessID).length})</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="workflow-section-title" style={{ marginTop: '2.5rem' }}>
          <h2>Recent Office Audit Activity</h2>
          <p>Real-time security logs of task updates and registrations concerning your assigned clients.</p>
        </div>
        <motion.div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid var(--border-glass)' }} variants={itemVariants}>
          {recentTxns.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>No recent activity related to your clients has been logged.</p>
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
      </motion.div>

      <footer className="footer-links" style={{display: 'flex', justifyContent: 'space-around', marginTop: '3rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
        <a href="#">Security Policy</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Legal</a>
        <a href="#">Technical Support</a>
      </footer>
    </div>
  );
};

export default AuditHome;
