import React, { useEffect, useState } from 'react';
import { Search, Calendar, History, ShieldAlert, Award, FileText } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';
import './css/customer_list.css'; // Reuses directory table styles

const TransactionHistory = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions');
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const txnId = log.transactionId?.toLowerCase() || '';
    const client = log.clientName?.toLowerCase() || '';
    const desc = log.description?.toLowerCase() || '';
    const operator = log.performedBy?.toLowerCase() || '';
    const matchesSearch = txnId.includes(searchTerm.toLowerCase()) ||
                          client.includes(searchTerm.toLowerCase()) ||
                          desc.includes(searchTerm.toLowerCase()) ||
                          operator.includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get list of unique transaction types for filter
  const uniqueTypes = Array.from(new Set(logs.map(log => log.type)));

  if (loading) {
    return (
      <div className="home-loading">
        <p>Loading Transaction History Audit Trail...</p>
      </div>
    );
  }

  return (
    <div className="customer-view-page fade-in" style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <div className="view-page-header">
        <div className="header-meta">
          <h1>Transaction Trail & Audit Logs</h1>
          <p>Monitor security operations, client registrations, task assignments, and compliance status updates.</p>
        </div>
      </div>

      <div className="search-filter-card glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrapper-custom" style={{ flexGrow: 1, minWidth: '250px' }}>
          <Search className="search-box-icon" size={18} />
          <input
            type="text"
            placeholder="Search by Transaction ID, client name, operator, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group-select" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Log Type:</label>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)} 
            className="form-control-custom"
            style={{ width: '180px', padding: '0.5rem' }}
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="no-records-card glass-card">
          <History size={40} className="no-records-icon" style={{ color: 'var(--text-secondary)' }} />
          <h3>No Transactions Logged</h3>
          <p>No system activity matching your filters was found in the secure audit trail log.</p>
        </div>
      ) : (
        <div className="custom-table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Client Name</th>
                <th>Operator</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                let badgeClass = 'status-pending';
                if (log.type.includes('Register') || log.type.includes('Created')) {
                  badgeClass = 'status-inprogress'; // Blue
                } else if (log.type.includes('Update') || log.type.includes('Status')) {
                  badgeClass = 'status-completed'; // Green
                } else if (log.type.includes('Delete')) {
                  badgeClass = 'status-pending'; // Red
                }

                // Operator badge
                let opStyle = { background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 };
                if (log.role === 'admin') {
                  opStyle = { background: 'rgba(248, 180, 0, 0.1)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 };
                } else if (log.role === 'superuser') {
                  opStyle = { background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 };
                }

                return (
                  <motion.tr 
                    key={log._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.015, 0.5) }}
                  >
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: '0.85rem' }}>{log.transactionId}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatDate(log.createdAt)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${badgeClass}`} style={{ textTransform: 'none', fontSize: '0.7rem' }}>
                        {log.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{log.clientName}</span>
                      <span className="assessee-badge" style={{ display: 'block', fontSize: '0.65rem', padding: '1px 6px', marginTop: '2px', width: 'fit-content' }}>
                        {log.category}
                      </span>
                    </td>
                    <td>
                      <span style={opStyle}>{log.performedBy}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.description}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
