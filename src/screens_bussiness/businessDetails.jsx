import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Edit3, Trash2, Save, X, Building2, MapPin, 
  CreditCard, FileText, Download, ShieldAlert, CheckCircle, Info
} from "lucide-react";
import axios from "axios";
import "../css/customer_detail.css"; // Reuses profile detail layout CSS
import { useAuth } from '../AuthContext';

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("company");

  const [businessData, setBusinessData] = useState({
    assesseeType: '',
    businessName: '',
    businessOwnerName: '',
    typeOfBusiness: '',
    businessRegistrationNumber: '',
    panOfBusiness: '',
    gstin: '',
    signatoryAuthorityName: '',
    bankName: '',
    branchName: '',
    bankAccountNumber: '',
    ifscCode: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    dscPassword: '',
    contactPhoneNumber: '',
    contactEmail: '',
    contactPersonName: '',
    notes: '',
    panCardFile: null,
    gstinFile: null,
    otherDocumentFile: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBusiness();
  }, [id, user, navigate]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/business_list/${id}`);
      setBusiness(response.data);
      setBusinessData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setBusinessData({ ...businessData, [name]: files[0] });
    } else {
      setBusinessData({ ...businessData, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in businessData) {
        if (businessData[key] instanceof File) {
          formData.append(key, businessData[key]);
        } else if (businessData[key] !== null && typeof businessData[key] !== 'object') {
          formData.append(key, businessData[key]);
        }
      }
      
      await axios.put(`/api/business_list/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Business details updated successfully');
      setEditMode(false);
      fetchBusiness();
    } catch (error) {
      console.error("Error updating business details:", error);
      alert("Failed to update business details.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this business profile? This action is permanent.")) {
      try {
        await axios.delete(`/api/business_list/${id}`);
        alert('Business profile deleted successfully');
        navigate('/business-list');
      } catch (error) {
        console.error("Error deleting business:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="list-loading-placeholder">
        <p>Loading company profile details...</p>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="no-records-card glass-card">
        <ShieldAlert size={40} style={{ color: 'var(--accent-red)' }} />
        <h3>Company Load Error</h3>
        <p>Failed to find or retrieve this business profile data.</p>
        <button onClick={() => navigate('/business-list')}>Return to Directory</button>
      </div>
    );
  }

  const isAdmin = user && user.userType === 'admin';

  return (
    <div className="customer-details-page fade-in">
      {/* Header Panel */}
      <div className="details-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/business-list')}>
            <ArrowLeft size={16} />
            <span>Directory</span>
          </button>
          <h2>{business.businessName}</h2>
          <span className="assessee-badge" style={{ background: 'var(--accent-soft-gold)', color: 'var(--accent-gold)', borderColor: 'rgba(248, 180, 0, 0.2)' }}>
            {business.typeOfBusiness || 'Business'}
          </span>
        </div>

        {isAdmin && !editMode && (
          <div className="header-actions">
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              <Edit3 size={16} />
              <span>Edit Details</span>
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <Trash2 size={16} />
              <span>Delete Company</span>
            </button>
          </div>
        )}
      </div>

      {editMode ? (
        /* Edit Mode Form View */
        <form onSubmit={handleSave} className="details-edit-form glass-card">
          <div className="edit-form-header">
            <h3>Modify Business Profile</h3>
            <p>Update fields below and submit to apply changes.</p>
          </div>

          <div className="edit-form-grid">
            <div className="form-group-custom">
              <label>Assessee Type</label>
              <select name="assesseeType" value={businessData.assesseeType} onChange={handleChange} required className="form-control-custom">
                <option value="">Select Assessee Type</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
                <option value="LLP">LLP</option>
              </select>
            </div>

            <div className="form-group-custom">
              <label>Business Name</label>
              <input type="text" name="businessName" value={businessData.businessName} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Business Owner / Director Name</label>
              <input type="text" name="businessOwnerName" value={businessData.businessOwnerName} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Type of Business</label>
              <input type="text" name="typeOfBusiness" value={businessData.typeOfBusiness} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Business Registration Number</label>
              <input type="text" name="businessRegistrationNumber" value={businessData.businessRegistrationNumber} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>PAN of Business</label>
              <input type="text" name="panOfBusiness" value={businessData.panOfBusiness} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>GSTIN</label>
              <input type="text" name="gstin" value={businessData.gstin} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Authorized Signatory Name</label>
              <input type="text" name="signatoryAuthorityName" value={businessData.signatoryAuthorityName} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Street Address</label>
              <input type="text" name="streetAddress" value={businessData.streetAddress} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>City</label>
              <input type="text" name="city" value={businessData.city} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>State</label>
              <input type="text" name="state" value={businessData.state} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={businessData.postalCode} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Country</label>
              <input type="text" name="country" value={businessData.country} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Contact Phone Number</label>
              <input type="text" name="contactPhoneNumber" value={businessData.contactPhoneNumber} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Contact Email</label>
              <input type="email" name="contactEmail" value={businessData.contactEmail} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Contact Person Name</label>
              <input type="text" name="contactPersonName" value={businessData.contactPersonName} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Bank Name</label>
              <input type="text" name="bankName" value={businessData.bankName} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Branch Name</label>
              <input type="text" name="branchName" value={businessData.branchName} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>A/C Number</label>
              <input type="text" name="bankAccountNumber" value={businessData.bankAccountNumber} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>IFSC Code</label>
              <input type="text" name="ifscCode" value={businessData.ifscCode} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>DSC Password</label>
              <input type="text" name="dscPassword" value={businessData.dscPassword} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom" style={{ gridColumn: 'span 2' }}>
              <label>Notes / Remarks</label>
              <textarea name="notes" value={businessData.notes} onChange={handleChange} className="form-control-custom" style={{ minHeight: '80px', resize: 'vertical' }} />
            </div>

            <div className="form-group-custom">
              <label>PAN Card File</label>
              <input type="file" name="panCardFile" onChange={handleChange} />
            </div>

            <div className="form-group-custom">
              <label>GSTIN File</label>
              <input type="file" name="gstinFile" onChange={handleChange} />
            </div>

            <div className="form-group-custom">
              <label>Other Document File</label>
              <input type="file" name="otherDocumentFile" onChange={handleChange} />
            </div>
          </div>

          <div className="edit-form-actions">
            <button type="submit" className="save-btn btn-primary">
              <Save size={16} />
              <span>Apply Changes</span>
            </button>
            <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      ) : (
        /* Regular View: Tabbed Layout Cards */
        <div className="details-container">
          <div className="details-tabs-bar glass-card">
            <button className={`tab-link ${activeTab === "company" ? "active" : ""}`} onClick={() => setActiveTab("company")}>
              <Building2 size={16} />
              <span>Company Profile</span>
            </button>
            <button className={`tab-link ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>
              <MapPin size={16} />
              <span>Address & Contacts</span>
            </button>
            <button className={`tab-link ${activeTab === "bank" ? "active" : ""}`} onClick={() => setActiveTab("bank")}>
              <CreditCard size={16} />
              <span>Bank Details</span>
            </button>
            <button className={`tab-link ${activeTab === "vault" ? "active" : ""}`} onClick={() => setActiveTab("vault")}>
              <FileText size={16} />
              <span>Document Vault</span>
            </button>
          </div>

          <div className="tab-content-container glass-card fade-in">
            {activeTab === "company" && (
              <div className="tab-card-body">
                <h3>Company Profile</h3>
                <div className="info-details-grid">
                  <div className="info-item"><span className="info-label">Corporate Name:</span> <span style={{ fontWeight: 600 }}>{business.businessName}</span></div>
                  <div className="info-item"><span className="info-label">Assessee Constitution:</span> <span>{business.assesseeType || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Director / Owner:</span> <span>{business.businessOwnerName}</span></div>
                  <div className="info-item"><span className="info-label">Type of Industry:</span> <span>{business.typeOfBusiness}</span></div>
                  <div className="info-item"><span className="info-label">Registration Number:</span> <span>{business.businessRegistrationNumber || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Company PAN:</span> <span className="pan-number-val">{business.panOfBusiness || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">GSTIN ID:</span> <span className="pan-number-val">{business.gstin || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Authorized Signatory:</span> <span>{business.signatoryAuthorityName || 'N/A'}</span></div>
                  {business.notes && (
                    <div className="info-item" style={{ gridColumn: 'span 2' }}>
                      <span className="info-label">Office Remarks:</span>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px' }}>{business.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "contacts" && (
              <div className="tab-card-body">
                <h3>Contact & Address Information</h3>
                <div className="info-details-grid">
                  <div className="info-item"><span className="info-label">Office Phone:</span> <span>{business.contactPhoneNumber || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Office Email:</span> <span>{business.contactEmail || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Primary Liaison:</span> <span>{business.contactPersonName || 'N/A'}</span></div>
                  <div className="info-item" style={{ gridColumn: 'span 2' }}>
                    <span className="info-label">Registered Office Address:</span>
                    <span>
                      {business.streetAddress ? `${business.streetAddress}, ${business.city}, ${business.state} - ${business.postalCode}, ${business.country}` : 'No address supplied'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bank" && (
              <div className="tab-card-body">
                <h3>Banking details & DSC Token</h3>
                <div className="info-details-grid">
                  <div className="info-item"><span className="info-label">Bank Name:</span> <span>{business.bankName || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Branch Location:</span> <span>{business.branchName || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Bank Account Number:</span> <span className="ac-number-val">{business.bankAccountNumber || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">IFSC Financial Code:</span> <span>{business.ifscCode || 'N/A'}</span></div>
                  <div className="info-item" style={{ gridColumn: 'span 2' }}>
                    <span className="info-label">DSC Key Signature Password:</span> 
                    <span className="dsc-pass-val">{business.dscPassword || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vault" && (
              <div className="tab-card-body">
                <h3>Company Document Vault</h3>
                <p className="vault-subtitle">Review and download file attachments uploaded for this corporate assessee.</p>
                <div className="vault-files-list">
                  <div className="vault-file-row">
                    <div className="file-meta">
                      <FileText className="file-icon" size={20} />
                      <div className="file-desc">
                        <span className="file-title">Company PAN Certificate</span>
                        <span className="file-name">{business.panCardFile || 'No file uploaded'}</span>
                      </div>
                    </div>
                    {business.panCardFile && (
                      <a href={`/api/uploads/${business.panCardFile}`} target="_blank" rel="noreferrer" className="file-download-btn">
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    )}
                  </div>

                  <div className="vault-file-row">
                    <div className="file-meta">
                      <FileText className="file-icon" size={20} />
                      <div className="file-desc">
                        <span className="file-title">GSTIN Registration Document</span>
                        <span className="file-name">{business.gstinFile || 'No file uploaded'}</span>
                      </div>
                    </div>
                    {business.gstinFile && (
                      <a href={`/api/uploads/${business.gstinFile}`} target="_blank" rel="noreferrer" className="file-download-btn">
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    )}
                  </div>

                  <div className="vault-file-row">
                    <div className="file-meta">
                      <FileText className="file-icon" size={20} />
                      <div className="file-desc">
                        <span className="file-title">Other Corporate Document</span>
                        <span className="file-name">{business.otherDocumentFile || 'No file uploaded'}</span>
                      </div>
                    </div>
                    {business.otherDocumentFile && (
                      <a href={`/api/uploads/${business.otherDocumentFile}`} target="_blank" rel="noreferrer" className="file-download-btn">
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetails;
