import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, UserCheck, ShieldAlert } from "lucide-react";
import axios from 'axios';
import { useAuth } from '../AuthContext';
import '../css/workflows.css';

const UpdateBusITNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [noticeTypes, setNoticeTypes] = useState([]);
  const [noticeType, setNoticeType] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useAuth();
  const [auditUsers, setAuditUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const response = await axios.get(`/api/bus-it-notice/${id}`);
        setNotice(response.data);
        setNoticeType(response.data.noticeType);
        setNoticeDescription(response.data.noticeDescription);
        setDocument(null);
        setDueDate(response.data.dueDate.split('T')[0]);
        setAssignedTo(response.data.assignedTo);
        setStatus(response.data.status);
        setComments(response.data.comments || '');
        setNotes(response.data.notes || '');
      } catch (error) {
        console.error("Error fetching notice data:", error);
      }
    };

    const fetchNoticeTypes = async () => {
      try {
        const response = await axios.get('/api/bus-notice-types');
        setNoticeTypes(response.data);
      } catch (error) {
        console.error("Error fetching notice types:", error);
      }
    };

    const fetchAuditUsers = async () => {
      try {
        const response = await axios.get('/api/audit-users');
        setAuditUsers(response.data);
      } catch (error) {
        console.error("Error fetching audit users:", error);
      }
    };

    fetchAuditUsers();
    fetchNoticeData();
    fetchNoticeTypes();
  }, [id]);

  const handleNoticeTypeChange = (e) => {
    const selectedType = e.target.value;
    setNoticeType(selectedType);

    const selectedNotice = noticeTypes.find(n => n.noticetype === selectedType);
    if (selectedNotice) {
      setNoticeDescription(selectedNotice.noticedescription);
    }
  };

  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === 'completed' && user && user.userType === 'admin') {
      alert('The Notice task is completed and cannot be modified.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('businessID', notice.businessID);
    formData.append('assesseeType', notice.assesseeType || '');
    formData.append('businessName', notice.businessName || '');
    formData.append('businessOwnerName', notice.businessOwnerName || '');
    formData.append('typeOfBusiness', notice.typeOfBusiness || '');
    formData.append('contactPersonName', notice.contactPersonName || '');
    formData.append('notes', notes);
    formData.append('noticeType', noticeType);
    formData.append('noticeDescription', noticeDescription);
    if (document) {
      formData.append('document', document);
    }
    formData.append('dueDate', new Date(dueDate).toISOString().split('T')[0]);
    formData.append('assignedTo', assignedTo);
    formData.append('status', status);
    formData.append('comments', comments);

    try {
      await axios.put(`/api/business-it-notices/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      alert('IT Notice updated successfully');
      navigate('/busITNoticeList');
    } catch (error) {
      setLoading(false);
      console.error("Error updating IT Notice:", error);
      alert('Failed to update IT Notice.');
    }
  };

  if (!notice) {
    return (
      <div className="list-loading-placeholder">
        <p>Loading IT Notice data...</p>
      </div>
    );
  }

  const isAdmin = user && user.userType === 'admin';
  const isSupervisor = user && user.userType === 'superuser';
  const isCompleted = notice.status === 'completed';
  const isAssignedAuditor = user && user.userType === 'audituser' && notice.assignedTo === user.username;
  const canUpdate = (isAdmin && !isCompleted) || (isAssignedAuditor && !isCompleted);

  return (
    <div className="workflow-form-page fade-in">
      <div className="workflow-form-title">
        <button className="back-button" onClick={() => navigate('/busITNoticeList')}>
          <ArrowLeft size={16} />
          <span>Notices List</span>
        </button>
        <h1>Update Business IT Notice Task</h1>
        <p>Track compliance status, file compliance papers, and resolve notices.</p>
        {notice.transactionId && (
          <span className="assessee-badge" style={{ marginTop: '0.5rem', background: 'var(--accent-soft-blue)', color: 'var(--accent-blue)', display: 'inline-block' }}>
            Notice Case ID: {notice.transactionId}
          </span>
        )}
      </div>

      <div className="workflow-layout-grid">
        {/* Left Side: Notice & Business Info Summary */}
        <div className="form-client-read-only-section glass-card">
          <h3>Notice Metadata</h3>
          <div className="read-only-info-list">
            <div className="read-only-item">
              <span className="read-only-label">Company Name</span>
              <span className="read-only-value">{notice.businessName}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Notice Category</span>
              <span className="read-only-value">{notice.noticeType}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Liaison Officer</span>
              <span className="read-only-value">{notice.contactPersonName || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Constitution Type</span>
              <span className="read-only-value">{notice.assesseeType || 'Corporate'}</span>
            </div>
            {notice.comments && (
              <div className="read-only-item" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span className="read-only-label">Compliance Comments</span>
                <span className="read-only-value" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{notice.comments}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <form onSubmit={handleSubmit} className="form-edit-section glass-card">
          <div className="step-form-section">
            {isAdmin && !isCompleted ? (
              <>
                <div className="form-group-custom">
                  <label>Notice Type *</label>
                  <select value={noticeType} onChange={handleNoticeTypeChange} required className="form-control-custom">
                    <option value="" disabled>Select a notice type</option>
                    {noticeTypes.map((n) => (
                      <option key={n.item_id || n._id} value={n.noticetype}>
                        {n.noticetype}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-custom">
                  <label>Compliance Due Date *</label>
                  <div className="input-with-icon">
                    <Calendar size={18} className="field-icon" />
                    <input 
                      type="date" 
                      value={dueDate} 
                      onChange={(e) => setDueDate(e.target.value)} 
                      required 
                      className="form-control-custom"
                      style={{ paddingLeft: '2.75rem' }}
                    />
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Assigned Compliance Officer *</label>
                  <div className="input-with-icon">
                    <UserCheck size={18} className="field-icon" />
                    <select 
                      name="assignedTo" 
                      value={assignedTo} 
                      onChange={(e) => setAssignedTo(e.target.value)} 
                      required 
                      className="form-control-custom"
                      style={{ paddingLeft: '2.75rem' }}
                    >
                      <option value="">Select Assignee</option>
                      {auditUsers.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group-custom">
                  <label>Special Instructions / Notes</label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    className="form-control-custom"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
                </div>
              </>
            ) : (
              /* Non-admin view or read-only view */
              <>
                <div className="read-only-info-list" style={{ marginBottom: '1rem' }}>
                  <div className="read-only-item">
                    <span className="read-only-label">Compliance Due Date</span>
                    <span className="read-only-value">{dueDate}</span>
                  </div>
                  <div className="read-only-item">
                    <span className="read-only-label">Officer Instruction Notes</span>
                    <span className="read-only-value" style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>{notes || 'No custom instruction notes.'}</span>
                  </div>
                </div>
              </>
            )}

            {isAssignedAuditor && !isCompleted && (
              <>
                <div className="form-group-custom">
                  <label>Filing Compliance Status *</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    required 
                    className="form-control-custom"
                  >
                    <option value="" disabled>-Select Status-</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Response Draft / Document</label>
                  <input type="file" onChange={handleDocumentUpload} />
                </div>

                <div className="form-group-custom">
                  <label>Officer Activity Comments *</label>
                  <textarea 
                    value={comments} 
                    onChange={(e) => setComments(e.target.value)} 
                    required 
                    placeholder="Filing submissions, queries resolved, compliance logs..."
                    className="form-control-custom"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                  />
                </div>
              </>
            )}

            {isCompleted && (
              <div className="no-records-card" style={{ padding: '1rem', border: '1px solid var(--border-glass)', background: 'rgba(16, 185, 129, 0.1)' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-green)', marginBottom: '0.25rem' }} />
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Notice Task Completed</h4>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                  This notice compliance task is fully closed. Reference logs: "{comments || 'No comments registered.'}"
                </p>
              </div>
            )}

            {isSupervisor && (
              <div className="no-records-card" style={{ padding: '1rem', border: '1px solid var(--border-glass)', background: 'rgba(99, 102, 241, 0.1)' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-blue)', marginBottom: '0.25rem' }} />
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Supervisor View Only</h4>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                  As a supervisor, you can monitor this notice compliance task but cannot make modifications.
                </p>
              </div>
            )}

            {user && user.userType === 'audituser' && !isAssignedAuditor && !isCompleted && (
              <div className="no-records-card" style={{ padding: '1rem', border: '1px solid var(--border-glass)', background: 'rgba(239, 68, 68, 0.1)' }}>
                <ShieldAlert size={20} style={{ color: 'var(--accent-red)', marginBottom: '0.25rem' }} />
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Assigned to Another Auditor</h4>
                <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-secondary)' }}>
                  This task is assigned to auditor "{notice.assignedTo}". You do not have permission to modify it.
                </p>
              </div>
            )}

            {canUpdate && (
              <button type="submit" className="save-btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                <span>{loading ? 'Applying...' : 'Update Notice Task'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBusITNotice;
