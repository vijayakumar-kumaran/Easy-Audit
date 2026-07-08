import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, UserCheck } from "lucide-react";
import axios from 'axios';
import '../css/workflows.css';

const CreateBusItNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [business, setBusiness] = useState(null);
  const [noticeTypes, setNoticeTypes] = useState([]);
  const [noticeType, setNoticeType] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [auditUsers, setAuditUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`/api/business_list/${id}`);
        setBusiness(response.data);
      } catch (error) {
        console.error("Error fetching business data:", error);
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
    fetchBusinessData();
    fetchNoticeTypes();
  }, [id]);

  const handleNoticeTypeChange = (e) => {
    const selectedType = e.target.value;
    setNoticeType(selectedType);

    const selectedNotice = noticeTypes.find(notice => notice.noticetype === selectedType);
    if (selectedNotice) {
      setNoticeDescription(selectedNotice.noticedescription);
    }
  };

  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('businessID', id);
    formData.append('assesseeType', business?.assesseeType || '');
    formData.append('businessName', business?.businessName || '');
    formData.append('businessOwnerName', business?.businessOwnerName || '');
    formData.append('typeOfBusiness', business?.typeOfBusiness || '');
    formData.append('contactPersonName', business?.contactPersonName || '');
    formData.append('noticeType', noticeType);
    formData.append('noticeDescription', noticeDescription);
    formData.append('document', document);
    formData.append('dueDate', dueDate);
    formData.append('assignedTo', assignedTo);
    formData.append('status', "pending");
    formData.append('notes', notes); // FIXED: Appending the correct entered 'notes' state

    try {
      await axios.post('/api/bus-it-notices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      alert('Business IT Notice registered successfully');
      navigate('/busITNoticeList');
    } catch (error) {
      setLoading(false);
      console.error("Error creating business IT Notice:", error);
      alert('Failed to register IT notice.');
    }
  };

  if (!business) {
    return (
      <div className="list-loading-placeholder">
        <p>Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="workflow-form-page fade-in">
      <div className="workflow-form-title">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h1>Register Business IT Notice</h1>
        <p>Log a newly received compliance notice for the business client below.</p>
      </div>

      <div className="workflow-layout-grid">
        {/* Left Side: Business Profile Summary */}
        <div className="form-client-read-only-section glass-card">
          <h3>Company Profile Details</h3>
          <div className="read-only-info-list">
            <div className="read-only-item">
              <span className="read-only-label">Company Name</span>
              <span className="read-only-value">{business.businessName}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Constitution Type</span>
              <span className="read-only-value">{business.assesseeType || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Director / Owner</span>
              <span className="read-only-value">{business.businessOwnerName || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Authorized Liaison</span>
              <span className="read-only-value">{business.contactPersonName || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Company PAN</span>
              <span className="read-only-value" style={{ fontFamily: 'monospace' }}>{business.panOfBusiness || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Notice Form Inputs */}
        <form onSubmit={handleSubmit} className="form-edit-section glass-card">
          <div className="step-form-section">
            <div className="form-group-custom">
              <label>Notice Type *</label>
              <select value={noticeType} onChange={handleNoticeTypeChange} required className="form-control-custom">
                <option value="" disabled>Select a notice type</option>
                {noticeTypes.map(notice => (
                  <option key={notice.item_id || notice._id} value={notice.noticetype}>
                    {notice.noticetype}
                  </option>
                ))}
              </select>
            </div>

            {noticeDescription && (
              <div className="form-group-custom">
                <label>Notice Scope / Description</label>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', background: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  {noticeDescription}
                </div>
              </div>
            )}

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

            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Notice Copy *</label>
              <input type="file" onChange={handleDocumentUpload} required />
              {document && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {document.name}</span>}
            </div>

            <div className="form-group-custom">
              <label>Assign to Compliance Officer *</label>
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
                  {auditUsers.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group-custom">
              <label>Remarks / Notes *</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Filing issues, tax notices instructions, templates..."
                required 
                className="form-control-custom"
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="save-btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              <Save size={16} />
              <span>{loading ? 'Submitting...' : 'Register Notice Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBusItNotice;
