import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Building2, UserCheck } from "lucide-react";
import axios from "axios";
import "../css/workflows.css";

const BusinessTaxCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [auditUsers, setAuditUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bassessmentData, setbAssessmentData] = useState({
    assessmentYear: '',
    notes: '',
    document: null,
    assignedTo: ''
  });

  const fetchAuditUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/audit-users');
      setAuditUsers(response.data);
    } catch (error) {
      console.error("Error fetching audit users:", error);
    }
  }, []);

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.get(`/api/business_list/${id}`);
      setBusiness(response.data);
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAuditUsers();
    fetchBusiness();
  }, [fetchAuditUsers, fetchBusiness]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setbAssessmentData({ ...bassessmentData, [name]: files[0] });
    } else {
      setbAssessmentData({ ...bassessmentData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('business_listID', id);
      formData.append('assesseeType', business.assesseeType);
      formData.append('businessName', business.businessName);
      formData.append('businessOwnerName', business.businessOwnerName);
      formData.append('typeOfBusiness', business.typeOfBusiness);
      formData.append('businessRegistrationNumber', business.businessRegistrationNumber);
      formData.append('panOfBusiness', business.panOfBusiness);
      formData.append('gstin', business.gstin);
      formData.append('contactPersonName', business.contactPersonName);
      formData.append('assessmentYear', bassessmentData.assessmentYear);
      formData.append('notes', bassessmentData.notes);
      formData.append('document', bassessmentData.document);
      formData.append('assignedTo', bassessmentData.assignedTo);
      formData.append('status', 'pending');

      await axios.post('/api/business-tax-assessments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      alert('Business tax assessment created successfully');
      navigate('/business-list-of-tax-assessments');
    } catch (error) {
      setLoading(false);
      console.error("Error creating business tax assessment:", error);
      alert('Failed to register tax assessment.');
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
        <h1>Initialize Business Tax Assessment</h1>
        <p>Start a corporate tax audit assessment workflow for the client below.</p>
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
              <span className="read-only-label">Registration Number</span>
              <span className="read-only-value" style={{ fontSize: '0.85rem' }}>{business.businessRegistrationNumber || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">Company PAN</span>
              <span className="read-only-value" style={{ fontFamily: 'monospace' }}>{business.panOfBusiness || 'N/A'}</span>
            </div>
            <div className="read-only-item">
              <span className="read-only-label">GSTIN ID</span>
              <span className="read-only-value" style={{ fontFamily: 'monospace' }}>{business.gstin || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Inputs */}
        <form onSubmit={handleSubmit} className="form-edit-section glass-card">
          <div className="step-form-section">
            <div className="form-group-custom">
              <label>Assessment Year *</label>
              <select name="assessmentYear" value={bassessmentData.assessmentYear} onChange={handleChange} required className="form-control-custom">
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
              <label>Notes / Filing Targets *</label>
              <textarea 
                name="notes" 
                value={bassessmentData.notes} 
                onChange={handleChange} 
                placeholder="GST reconciliation details, tax computations, profit summaries..."
                required 
                className="form-control-custom"
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Reference Document *</label>
              <input type="file" name="document" onChange={handleChange} required />
              {bassessmentData.document && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {bassessmentData.document.name}</span>}
            </div>

            <div className="form-group-custom">
              <label>Assign to Audit Officer *</label>
              <div className="input-with-icon">
                <UserCheck size={18} className="field-icon" />
                <select name="assignedTo" value={bassessmentData.assignedTo} onChange={handleChange} required className="form-control-custom" style={{ paddingLeft: '2.75rem' }}>
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

export default BusinessTaxCreate;
