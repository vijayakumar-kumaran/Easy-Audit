import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Edit3, Trash2, Save, X, User, MapPin, 
  CreditCard, FileText, Download, ShieldAlert, CheckCircle, Info
} from "lucide-react";
import axios from "axios";
import "../css/customer_detail.css";
import { useAuth } from '../AuthContext';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const [customerData, setCustomerData] = useState({
    assesseeType: '',
    assesseefirstName: '',
    assesseelastName: '',
    fatherHusbandName: '',
    maritialstatus: '',
    day: '',
    month: '',
    year: '',
    panNumber: '',
    aadharNumber: '',
    phoneNumber: '',
    emailAddress: '',
    contactPersonName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    bankName: '',
    branchName: '',
    bankAccountNumber: '',
    ifscCode: '',
    dscPassword: '',
    panCardFile: null,
    adharCardFile: null,
    otherDocumentFile: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCustomer();
  }, [id, user, navigate]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/customers/${id}`);
      setCustomer(response.data);
      setCustomerData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setCustomerData({ ...customerData, [name]: files[0] });
    } else {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in customerData) {
        // Only append files if they are actually selected as objects
        if (customerData[key] instanceof File) {
          formData.append(key, customerData[key]);
        } else if (customerData[key] !== null && typeof customerData[key] !== 'object') {
          formData.append(key, customerData[key]);
        }
      }
      
      await axios.put(`/api/customers/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Client information updated successfully');
      setEditMode(false);
      fetchCustomer();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update client info. Check input data.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this customer profile? This action is permanent.")) {
      try {
        await axios.delete(`/api/customers/${id}`);
        alert('Customer profile deleted successfully');
        navigate('/customers');
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="list-loading-placeholder">
        <p>Loading client profile details...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="no-records-card glass-card">
        <ShieldAlert size={40} style={{ color: 'var(--accent-red)' }} />
        <h3>Client Load Error</h3>
        <p>Failed to find or retrieve this customer profile data. It may have been deleted.</p>
        <button onClick={() => navigate('/customers')}>Return to Directory</button>
      </div>
    );
  }

  const isAdmin = user && user.userType === 'admin';

  return (
    <div className="customer-details-page fade-in">
      {/* Header Panel */}
      <div className="details-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/customers')}>
            <ArrowLeft size={16} />
            <span>Directory</span>
          </button>
          <h2>{customer.assesseefirstName} {customer.assesseelastName}</h2>
          <span className="assessee-badge">{customer.assesseeType || 'Assessee'}</span>
        </div>

        {isAdmin && !editMode && (
          <div className="header-actions">
            <button className="edit-btn" onClick={() => setEditMode(true)}>
              <Edit3 size={16} />
              <span>Edit Details</span>
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <Trash2 size={16} />
              <span>Delete Profile</span>
            </button>
          </div>
        )}
      </div>

      {editMode ? (
        /* Edit Mode Form View */
        <form onSubmit={handleSave} className="details-edit-form glass-card">
          <div className="edit-form-header">
            <h3>Modify Profile Details</h3>
            <p>Update fields below and submit to apply changes.</p>
          </div>

          <div className="edit-form-grid">
            <div className="form-group-custom">
              <label>Assessee Type</label>
              <select name="assesseeType" value={customerData.assesseeType} onChange={handleChange} required className="form-control-custom">
                <option value="">Select Assessee Type</option>
                <option value="Individual">Individual</option>
                <option value="HUF">HUF</option>
                <option value="AOD/BOI">AOD/BOI</option>
              </select>
            </div>

            <div className="form-group-custom">
              <label>First Name</label>
              <input type="text" name="assesseefirstName" value={customerData.assesseefirstName} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Last Name</label>
              <input type="text" name="assesseelastName" value={customerData.assesseelastName} onChange={handleChange} required className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Father/Husband Name</label>
              <input type="text" name="fatherHusbandName" value={customerData.fatherHusbandName} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Marital Status</label>
              <input type="text" name="maritialstatus" value={customerData.maritialstatus} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Date of Birth</label>
              <div className="dob-inputs">
                <input type="text" name="day" value={customerData.day} onChange={handleChange} placeholder="DD" className="form-control-custom" style={{ width: '30%' }} />
                <input type="text" name="month" value={customerData.month} onChange={handleChange} placeholder="MM" className="form-control-custom" style={{ width: '30%' }} />
                <input type="text" name="year" value={customerData.year} onChange={handleChange} placeholder="YYYY" className="form-control-custom" style={{ width: '35%' }} />
              </div>
            </div>

            <div className="form-group-custom">
              <label>PAN Number</label>
              <input type="text" name="panNumber" value={customerData.panNumber} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Aadhar Number</label>
              <input type="text" name="aadharNumber" value={customerData.aadharNumber} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Phone Number</label>
              <input type="text" name="phoneNumber" value={customerData.phoneNumber} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Email Address</label>
              <input type="email" name="emailAddress" value={customerData.emailAddress} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Contact Person</label>
              <input type="text" name="contactPersonName" value={customerData.contactPersonName} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Street Address</label>
              <input type="text" name="streetAddress" value={customerData.streetAddress} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>City</label>
              <input type="text" name="city" value={customerData.city} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>State</label>
              <input type="text" name="state" value={customerData.state} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={customerData.postalCode} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Country</label>
              <input type="text" name="country" value={customerData.country} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Bank Name</label>
              <input type="text" name="bankName" value={customerData.bankName} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>Branch Name</label>
              <input type="text" name="branchName" value={customerData.branchName} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>A/C Number</label>
              <input type="text" name="bankAccountNumber" value={customerData.bankAccountNumber} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>IFSC Code</label>
              <input type="text" name="ifscCode" value={customerData.ifscCode} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>DSC Password</label>
              <input type="text" name="dscPassword" value={customerData.dscPassword} onChange={handleChange} className="form-control-custom" />
            </div>

            <div className="form-group-custom">
              <label>PAN Card Document</label>
              <input type="file" name="panCardFile" onChange={handleChange} />
            </div>

            <div className="form-group-custom">
              <label>Aadhar Document</label>
              <input type="file" name="adharCardFile" onChange={handleChange} />
            </div>

            <div className="form-group-custom">
              <label>Other Supporting File</label>
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
            <button className={`tab-link ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>
              <User size={16} />
              <span>Personal Info</span>
            </button>
            <button className={`tab-link ${activeTab === "address" ? "active" : ""}`} onClick={() => setActiveTab("address")}>
              <MapPin size={16} />
              <span>Address & Contact</span>
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
            {activeTab === "personal" && (
              <div className="tab-card-body">
                <h3>Personal Information</h3>
                <div className="info-details-grid">
                  <div className="info-item"><span className="info-label">Assessee Type:</span> <span>{customer.assesseeType || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">First Name:</span> <span>{customer.assesseefirstName}</span></div>
                  <div className="info-item"><span className="info-label">Last Name:</span> <span>{customer.assesseelastName}</span></div>
                  <div className="info-item"><span className="info-label">Father/Husband Name:</span> <span>{customer.fatherHusbandName || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Marital Status:</span> <span>{customer.maritialstatus || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Date of Birth:</span> <span>{customer.day ? `${customer.day}/${customer.month}/${customer.year}` : 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">PAN Number:</span> <span className="pan-number-val">{customer.panNumber || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Aadhar Number:</span> <span>{customer.aadharNumber || 'N/A'}</span></div>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="tab-card-body">
                <h3>Address & Contact Information</h3>
                <div className="info-details-grid">
                  <div className="info-item"><span className="info-label">Email Address:</span> <span>{customer.emailAddress || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Phone Number:</span> <span>{customer.phoneNumber || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Contact Person:</span> <span>{customer.contactPersonName || 'N/A'}</span></div>
                  <div className="info-item" style={{ gridColumn: 'span 2' }}>
                    <span className="info-label">Full Address:</span>
                    <span>
                      {customer.streetAddress ? `${customer.streetAddress}, ${customer.city}, ${customer.state} - ${customer.postalCode}, ${customer.country}` : 'No address supplied'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bank" && (
              <div className="tab-card-body">
                <h3>Bank Information & Security</h3>
                <div className="info-details-grid">
                  <div className="info-item"><span className="info-label">Bank Name:</span> <span>{customer.bankName || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">Branch Name:</span> <span>{customer.branchName || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">A/C Number:</span> <span className="ac-number-val">{customer.bankAccountNumber || 'N/A'}</span></div>
                  <div className="info-item"><span className="info-label">IFSC Code:</span> <span>{customer.ifscCode || 'N/A'}</span></div>
                  <div className="info-item" style={{ gridColumn: 'span 2' }}>
                    <span className="info-label">DSC Signature Password:</span> 
                    <span className="dsc-pass-val">{customer.dscPassword || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vault" && (
              <div className="tab-card-body">
                <h3>Secure Document Vault</h3>
                <p className="vault-subtitle">Review and download file attachments uploaded for this client profile.</p>
                <div className="vault-files-list">
                  <div className="vault-file-row">
                    <div className="file-meta">
                      <FileText className="file-icon" size={20} />
                      <div className="file-desc">
                        <span className="file-title">PAN Card Document</span>
                        <span className="file-name">{customer.panCardFile || 'No file uploaded'}</span>
                      </div>
                    </div>
                    {customer.panCardFile && (
                      <a href={`/api/uploads/${customer.panCardFile}`} target="_blank" rel="noreferrer" className="file-download-btn">
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    )}
                  </div>

                  <div className="vault-file-row">
                    <div className="file-meta">
                      <FileText className="file-icon" size={20} />
                      <div className="file-desc">
                        <span className="file-title">Aadhar Card Document</span>
                        <span className="file-name">{customer.adharCardFile || 'No file uploaded'}</span>
                      </div>
                    </div>
                    {customer.adharCardFile && (
                      <a href={`/api/uploads/${customer.adharCardFile}`} target="_blank" rel="noreferrer" className="file-download-btn">
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    )}
                  </div>

                  <div className="vault-file-row">
                    <div className="file-meta">
                      <FileText className="file-icon" size={20} />
                      <div className="file-desc">
                        <span className="file-title">Other Supporting Document</span>
                        <span className="file-name">{customer.otherDocumentFile || 'No file uploaded'}</span>
                      </div>
                    </div>
                    {customer.otherDocumentFile && (
                      <a href={`/api/uploads/${customer.otherDocumentFile}`} target="_blank" rel="noreferrer" className="file-download-btn">
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

export default CustomerDetails;
