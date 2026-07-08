import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Download, Eye, Edit, AlertCircle, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import '../css/customer_list.css';
import '../css/workflows.css';

const ITNoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotices();
    }
  }, [user]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      let response;
      if (user.userType === 'audituser') {
        response = await axios.get('/api/it-notices', {
          params: { username: user.username }
        });
      } else {
        response = await axios.get("/api/it-notices-all");
      }
      setNotices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching IT notices:', error);
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(notice => {
    const clientName = notice.assesseeName?.toLowerCase() || '';
    const noticeType = notice.noticeType?.toLowerCase() || '';
    const assigned = notice.assignedTo?.toLowerCase() || '';
    const status = notice.status || 'pending';
    const matchesSearch = clientName.includes(searchTerm.toLowerCase()) || 
                          noticeType.includes(searchTerm.toLowerCase()) || 
                          assigned.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="customer-view-page fade-in">
      <div className="view-page-header">
        <div className="header-meta">
          <button className="back-button" onClick={() => navigate('/notice-list')}>
            <ArrowLeft size={16} />
            <span>Workflow Dashboard</span>
          </button>
          <h1>Individual IT Notice Tasks</h1>
          <p>Track compliance deadlines, review response uploads, and resolve notices.</p>
        </div>
      </div>

      <div className="search-filter-card glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrapper-custom" style={{ flexGrow: 1, minWidth: '250px' }}>
          <Search className="search-box-icon" size={18} />
          <input
            type="text"
            placeholder="Search by client name, notice type, or officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group-select" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="form-control-custom"
            style={{ width: '130px', padding: '0.5rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="list-loading-placeholder">
          <p>Loading IT notice tasks...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="no-records-card glass-card">
          <AlertCircle size={40} className="no-records-icon" />
          <h3>No Notices Found</h3>
          <p>No individual IT notice tasks match the selected search filters.</p>
        </div>
      ) : (
        <div className="custom-table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Notice Type</th>
                <th>Client Name</th>
                <th>Due Date</th>
                <th>Officer</th>
                <th>Notice File</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices.map((notice, index) => {
                const statusClass = notice.status === 'completed' 
                  ? 'status-completed' 
                  : notice.status === 'inprogress' 
                    ? 'status-inprogress' 
                    : 'status-pending';

                const dueDateObj = notice.dueDate ? new Date(notice.dueDate) : null;
                const formattedDueDate = dueDateObj && !isNaN(dueDateObj) 
                  ? dueDateObj.toLocaleDateString() 
                  : 'N/A';

                return (
                  <motion.tr 
                    key={notice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <td>
                      <span style={{ fontWeight: 600 }}>{notice.noticeType || 'N/A'}</span>
                    </td>
                    <td>
                      <span>{notice.assesseeName || 'N/A'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        <span>{formattedDueDate}</span>
                      </div>
                    </td>
                    <td>
                      <span>{notice.assignedTo || 'Unassigned'}</span>
                    </td>
                    <td>
                      {notice.document ? (
                        <a 
                          href={`/api/uploads/${notice.document}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="file-download-btn"
                          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                        >
                          <Download size={12} />
                          <span>Doc</span>
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>None</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass}`}>
                        {notice.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link 
                        to={`/edit-it-notice/${notice.id}`} 
                        className="table-action-link view-profile-link btn"
                        style={{ padding: '0.4rem 0.85rem' }}
                      >
                        {user && user.userType === 'audituser' ? (
                          <>
                            <span>Process</span>
                            <Eye size={13} style={{ color: 'var(--accent-blue)' }} />
                          </>
                        ) : (
                          <>
                            <span>Edit</span>
                            <Edit size={13} style={{ color: 'var(--accent-gold)' }} />
                          </>
                        )}
                      </Link>
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

export default ITNoticeList;
