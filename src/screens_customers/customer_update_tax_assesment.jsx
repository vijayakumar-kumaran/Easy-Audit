import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, ShieldAlert } from "lucide-react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "../css/workflows.css";

const UpdateTaxAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auditUsers, setAuditUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assessmentData, setAssessmentData] = useState({
    customerId: '',
    assesseeType: '',
    assesseName: '',
    fatherName: '',
    dob: '',
    panNumber: '',
    adharNumber: '',
    phoneNumber: '',
    assessmentYear: '',
    notes: '',
    document: null,
    assignedTo: '',
    status: '',
    comments: ''
  });

  const fetchAuditUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/audit-users');
      setAuditUsers(response.data);
    } catch (error) {
      console.error("Error fetching audit users:", error);
    }
  }, []);

  const fetchAssessment = useCallback(async () => {
    try {
      const response = await axios.get(`/api/customer-tax-assessments/${id}`);
      setAssessmentData(response.data);
    } catch (error) {
      console.error("Error fetching tax assessment:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAuditUsers();
    fetchAssessment();
  }, [user, fetchAuditUsers, fetchAssessment]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setAssessmentData({ ...assessmentData, [name]: files[0] });
    } else {
      setAssessmentData({ ...assessmentData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (assessmentData.status === 'completed' && user && user.userType === 'admin') {
      alert('This task is marked as completed and cannot be modified by admins.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('customerId', assessmentData.customerId);
      formData.append('assesseeType', assessmentData.assesseeType);
      formData.append('assesseName', assessmentData.assesseName);
      formData.append('fatherName', assessmentData.fatherName);
      formData.append('dob', assessmentData.dob);
      formData.append('panNumber', assessmentData.panNumber);
      formData.append('adharNumber', assessmentData.adharNumber);
      formData.append('phoneNumber', assessmentData.phoneNumber);
      formData.append('assessmentYear', assessmentData.assessmentYear);
      formData.append('notes', assessmentData.notes || '');
      if (assessmentData.document instanceof File) {
        formData.append('document', assessmentData.document);
      }
      formData.append('assignedTo', assessmentData.assignedTo);
      formData.append('status', assessmentData.status);
      formData.append('comments', assessmentData.comments || '');

      await axios.put(`/api/customer-tax-assessments/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      alert('Tax assessment updated successfully');
      navigate('/update-assessments');
    } catch (error) {
      setLoading(false);
      console.error("Error updating tax assessment:", error);
      alert('Failed to update assessment.');
    }
  };

  if (!assessmentData.customerId) {
    return (
      <div className="list-loading-placeholder">
        <p>Loading assessment details...</p>
      </div>
    );
  }

  const isAdmin = user && user.userType === 'admin';
  const isSupervisor = user && user.userType === 'superuser';
  const isCompleted = assessmentData.status === 'completed';
  const isAssignedAuditor = user && user.userType === 'audituser' && assessmentData.assignedTo === user.username;
  const canUpdate = (isAdmin && !isCompleted) || (isAssignedAuditor && !isCompleted);

  return (
    <div className="workflow-form-page fade-in">
      <div className="workflow-form-title">
        <button className="back-button" onClick={() => navigate('/update-assessments')}>
          <ArrowLeft size={16} />
          <span>Assessments List</span>
        </button>
        <h1>Update Individual Tax Assessment</h1>
        <p>Process filings, log compliance logs, and assign audit workloads.</p>
        {assessmentData.transactionId && (
          <span className="assessee-badge" style={{ marginTop: '0.5rem', background: 'var(--accent-soft-blue)', color: 'var(--accent-blue)', display: 'inline-block' }}>
            Filing Ref ID: {assessmentData.transactionId}
          </span>
        )}
      </div>

      <div className="workflow-layout-grid">
        {/* Left Side: Client profile metadata read-only */}
        <div className="form-client-read-only-section glass-card">
          <h3>Filing Profile Metadata</h3>
          <div className="read-only-info-list">
            <div className="read-only-item">
              <span className="read-only-label">Client Name</span>
              <span className="read-only-value">{assessmentData.assesseName}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Constitution Type</span>
              <span className="read-only-value">{assessmentData.assesseeType || 'Individual'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">PAN Number</span>
              <span className="read-only-value" style={{ fontFamily: 'monospace' }}>{assessmentData.panNumber || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Assessment Year</span>
              <span className="read-only-value">{assessmentData.assessmentYear}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Assigned Officer</span>
              <span className="read-only-value">{assessmentData.assignedTo || 'Unassigned'}</span>
            </div>
            {assessmentData.comments && (
              <div className="read-only-item" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span className="read-only-label">Auditor Comments</span>
                <span className="read-only-value" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{assessmentData.comments}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Update Action Fields */}
        <form onSubmit={handleSubmit} className="form-edit-section glass-card">
          <div className="step-form-section">
            <div className="form-group-custom">
              <label>Special Notes (Admin Only)</label>
              <textarea 
                name="notes" 
                value={assessmentData.notes || ''} 
                onChange={handleChange} 
                readOnly={!isAdmin || isCompleted}
                className="form-control-custom"
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            {isAdmin && !isCompleted && (
              <div className="form-group-custom">
                <label>Assigned Audit Officer *</label>
                <select 
                  name="assignedTo" 
                  value={assessmentData.assignedTo} 
                  onChange={handleChange} 
                  required 
                  className="form-control-custom"
                >
                  <option value="">Select Assignee</option>
                  {auditUsers.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            )}

            {isAssignedAuditor && !isCompleted && (
              <>
                <div className="form-group-custom">
                  <label>Filing Progress Status *</label>
                  <select 
                    name="status" 
                    value={assessmentData.status} 
                    onChange={handleChange} 
                    required 
                    className="form-control-custom"
                  >
                    <option value="" disabled>-Select Status-</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group-custom">
                  <label>Audit Officer Comments *</label>
                  <textarea 
                    name="comments" 
                    value={assessmentData.comments || ''} 
                    onChange={handleChange} 
                    required 
                    placeholder="Audit findings, queries raised, file status updates..."
                    className="form-control-custom"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
                </div>
              </>
            )}

            {isCompleted && (
              <div className="no-records-card" style={{ padding: '1rem', border: '1px solid var(--border-glass)', background: 'rgba(16, 185, 129, 0.1)' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-green)', marginBottom: '0.25rem' }} />
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Task Completed</h4>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                  This tax audit assessment is resolved. Reference details: "{assessmentData.comments || 'No comments left.'}"
                </p>
              </div>
            )}

            {isSupervisor && (
              <div className="no-records-card" style={{ padding: '1rem', border: '1px solid var(--border-glass)', background: 'rgba(99, 102, 241, 0.1)' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-blue)', marginBottom: '0.25rem' }} />
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Supervisor View Only</h4>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                  As a supervisor, you can monitor this tax audit task but cannot make modifications.
                </p>
              </div>
            )}

            {user && user.userType === 'audituser' && !isAssignedAuditor && !isCompleted && (
              <div className="no-records-card" style={{ padding: '1rem', border: '1px solid var(--border-glass)', background: 'rgba(239, 68, 68, 0.1)' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-red)', marginBottom: '0.25rem' }} />
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Assigned to Another Auditor</h4>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                  This task is assigned to auditor "{assessmentData.assignedTo}". You do not have permission to modify it.
                </p>
              </div>
            )}

            {canUpdate && (
              <button type="submit" className="save-btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                <span>{loading ? 'Applying...' : 'Update Assessment Task'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaxAssessment;
