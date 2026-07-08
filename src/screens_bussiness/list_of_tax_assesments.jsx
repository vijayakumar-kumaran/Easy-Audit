import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Download, Eye, Edit, AlertCircle, Calendar } from "lucide-react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import '../css/customer_list.css';
import '../css/workflows.css';

const BusinessListOfTaxAssessments = () => {
  const [businesstaxAssessments, setBusinessTaxAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBusinessTaxAssessments();
    }
  }, [user]);

  const fetchBusinessTaxAssessments = async () => {
    try {
      setLoading(true);
      let response;
      if (user.userType === 'audituser') {
        response = await axios.get("/api/list-of-tax-assessments", {
          params: { username: user.username }
        });
      } else {
        response = await axios.get("/api/list-of-tax-assessments-all");
      }
      setBusinessTaxAssessments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching business tax assessments:", error);
      setLoading(false);
    }
  };

  const filteredAssessments = businesstaxAssessments.filter(assessment => {
    const clientName = assessment.businessName?.toLowerCase() || '';
    const assigned = assessment.assignedTo?.toLowerCase() || '';
    const status = assessment.status || 'pending';
    const matchesSearch = clientName.includes(searchTerm.toLowerCase()) || 
                          assigned.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="customer-view-page fade-in">
      <div className="view-page-header">
        <div className="header-meta">
          <button className="back-button" onClick={() => navigate('/business-tax-assessments')}>
            <ArrowLeft size={16} />
            <span>Workflow Dashboard</span>
          </button>
          <h1>Business Tax Assessments</h1>
          <p>Track audit assignments, compliance timelines, and filing statuses for corporate clients.</p>
        </div>
      </div>

      <div className="search-filter-card glass-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-wrapper-custom" style={{ flexGrow: 1, minWidth: '250px' }}>
          <Search className="search-box-icon" size={18} />
          <input
            type="text"
            placeholder="Search by company name or assigned officer..."
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
          <p>Loading corporate assessments...</p>
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="no-records-card glass-card">
          <AlertCircle size={40} className="no-records-icon" />
          <h3>No Assessments Found</h3>
          <p>No business tax assessments match the selected search filters.</p>
        </div>
      ) : (
        <div className="custom-table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Constitution</th>
                <th>Year</th>
                <th>Assigned Officer</th>
                <th>Ref Doc</th>
                <th>Filing Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssessments.map((assessment, index) => {
                const statusClass = assessment.status === 'completed' 
                  ? 'status-completed' 
                  : assessment.status === 'inprogress' 
                    ? 'status-inprogress' 
                    : 'status-pending';

                return (
                  <motion.tr 
                    key={assessment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <td>
                      <span style={{ fontWeight: 600 }}>{assessment.businessName}</span>
                    </td>
                    <td>
                      <span>{assessment.assesseeType || 'Corporate'}</span>
                    </td>
                    <td>
                      <span className="assessee-badge" style={{ marginTop: 0 }}>{assessment.assessmentYear}</span>
                    </td>
                    <td>
                      <span>{assessment.assignedTo || 'Unassigned'}</span>
                    </td>
                    <td>
                      {assessment.document ? (
                        <a 
                          href={`/api/uploads/${assessment.document}`} 
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
                        {assessment.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link 
                        to={`/update-bus-tax-assessment/${assessment.id}`} 
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

export default BusinessListOfTaxAssessments;
