import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileText, User, UserCheck } from "lucide-react";
import axios from "axios";
import "../css/workflows.css";

const CreateTaxAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [auditUsers, setAuditUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assessmentData, setAssessmentData] = useState({
    assessmentYear: '',
    notes: '',
    document: null,
    assignedTo: ''
  });

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await axios.get(`/api/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  }, [id]);

  const fetchAuditUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/audit-users');
      setAuditUsers(response.data);
    } catch (error) {
      console.error("Error fetching audit users:", error);
    }
  }, []);

  useEffect(() => {
    fetchCustomer();
    fetchAuditUsers();
  }, [fetchCustomer, fetchAuditUsers]);

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
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('customerId', id);
      formData.append('assesseeType', customer.assesseeType);
      formData.append('assesseName', `${customer.assesseefirstName} ${customer.assesseelastName}`);
      formData.append('fatherName', customer.fatherHusbandName);
      formData.append('dob', `${customer.day}/${customer.month}/${customer.year}`);
      formData.append('panNumber', customer.panNumber);
      formData.append('adharNumber', customer.aadharNumber);
      formData.append('phoneNumber', customer.phoneNumber);
      formData.append('assessmentYear', assessmentData.assessmentYear);
      formData.append('notes', assessmentData.notes);
      formData.append('document', assessmentData.document);
      formData.append('assignedTo', assessmentData.assignedTo);
      formData.append('status', 'pending');

      await axios.post('/api/customer-tax-assessments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      alert('Tax assessment created successfully');
      navigate('/update-assessments');
    } catch (error) {
      setLoading(false);
      console.error("Error creating tax assessment:", error);
      alert('Error creating tax assessment. Please check inputs.');
    }
  };

  if (!customer) {
    return (
      <div className="list-loading-placeholder">
        <p>Loading client info...</p>
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
        <h1>Initialize Tax Assessment</h1>
        <p>Set up a tax filing assessment process for the client profile below.</p>
      </div>

      <div className="workflow-layout-grid">
        {/* Left Side: Client profile read-only */}
        <div className="form-client-read-only-section glass-card">
          <h3>Client Profile Summary</h3>
          <div className="read-only-info-list">
            <div className="read-only-item">
              <span className="read-only-label">Assessee Name</span>
              <span className="read-only-value">{customer.assesseefirstName} {customer.assesseelastName}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Constitution Type</span>
              <span className="read-only-value">{customer.assesseeType || 'Individual'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Guardian / Spouse</span>
              <span className="read-only-value">{customer.fatherHusbandName || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">PAN Card Number</span>
              <span className="read-only-value" style={{ fontFamily: 'monospace' }}>{customer.panNumber || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Aadhar Number</span>
              <span className="read-only-value">{customer.aadharNumber || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Phone Connection</span>
              <span className="read-only-value">{customer.phoneNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <form onSubmit={handleSubmit} className="form-edit-section glass-card">
          <div className="step-form-section">
            <div className="form-group-custom">
              <label>Assessment Year *</label>
              <select name="assessmentYear" value={assessmentData.assessmentYear} onChange={handleChange} required className="form-control-custom">
                <option value="">Select Year</option>
                <option value="AY 2026-27 (FY 2025-26)">AY 2026-27 (FY 2025-26)</option>
                <option value="AY 2025-26 (FY 2024-25)">AY 2025-26 (FY 2024-25)</option>
                <option value="AY 2024-25 (FY 2023-24)">AY 2024-25 (FY 2023-24)</option>
                <option value="AY 2023-24 (FY 2022-23)">AY 2023-24 (FY 2022-23)</option>
                <option value="AY 2022-23 (FY 2021-22)">AY 2022-23 (FY 2021-22)</option>
                <option value="AY 2021-22 (FY 2020-21)">AY 2021-22 (FY 2020-21)</option>
                <option value="AY 2020-21 (FY 2019-20)">AY 2020-21 (FY 2019-20)</option>
                <option value="AY 2019-20 (FY 2018-19)">AY 2019-20 (FY 2018-19)</option>
                <option value="AY 2018-19 (FY 2017-18)">AY 2018-19 (FY 2017-18)</option>
              </select>
            </div>

            <div className="form-group-custom">
              <label>Special Notes *</label>
              <textarea 
                name="notes" 
                value={assessmentData.notes} 
                onChange={handleChange} 
                placeholder="Filing targets, ledger reviews, compliance checks..."
                required 
                className="form-control-custom"
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Reference Document *</label>
              <input type="file" name="document" onChange={handleChange} required />
              {assessmentData.document && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {assessmentData.document.name}</span>}
            </div>

            <div className="form-group-custom">
              <label>Assign to Audit Officer *</label>
              <div className="input-with-icon">
                <UserCheck size={18} className="field-icon" />
                <select name="assignedTo" value={assessmentData.assignedTo} onChange={handleChange} required className="form-control-custom" style={{ paddingLeft: '2.75rem' }}>
                  <option value="">Select Assignee</option>
                  {auditUsers.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="save-btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
              <Save size={16} />
              <span>{loading ? 'Initializing...' : 'Create Assessment Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaxAssessment;
