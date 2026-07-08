import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, MapPin, CreditCard, FileText, Briefcase, Bell } from 'lucide-react';
import axios from 'axios';
import '../css/add_client.css'; // Reuses multi-step registration layout CSS

const BusinessSignup = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [assesseeTypes, setAssesseeTypes] = useState([]);
  
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
    country: 'India',
    dscPassword: '',
    contactPhoneNumber: '',
    contactEmail: '',
    contactPersonName: '',
    notes: '',
    panCardFile: null,
    gstinFile: null,
    otherDocumentFile: null
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch assessee types from the backend
    axios.get('/api/business-assessment-types')
      .then(response => {
        setAssesseeTypes(response.data);
      })
      .catch(error => {
        console.error(error);
        // Fallback standard options if API fails/empty
        setAssesseeTypes([
          { item_id: 1, bassessmentvalues: "Proprietorship" },
          { item_id: 2, bassessmentvalues: "Partnership" },
          { item_id: 3, bassessmentvalues: "Private Limited Company" },
          { item_id: 4, bassessmentvalues: "LLP" }
        ]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setBusinessData({ ...businessData, [name]: files[0] });
    } else {
      setBusinessData({ ...businessData, [name]: value });
    }
  };

  const nextStep = () => {
    // Basic validations
    if (step === 1 && (!businessData.assesseeType || !businessData.businessName || !businessData.businessOwnerName)) {
      alert("Please fill all required fields in this step.");
      return;
    }
    if (step === 2 && (!businessData.bankAccountNumber || !businessData.ifscCode)) {
      alert("Please enter bank account details.");
      return;
    }
    if (step === 3 && (!businessData.streetAddress || !businessData.city)) {
      alert("Please specify the office address.");
      return;
    }
    if (step === 4 && (!businessData.contactPhoneNumber || !businessData.contactEmail)) {
      alert("Please enter contact info.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessData.panCardFile || !businessData.otherDocumentFile) {
      alert("Please upload the required PAN card and supporting documents in step 5.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    for (const key in businessData) {
      formData.append(key, businessData[key]);
    }

    try {
      await axios.post('/api/business-signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      alert('Business client registered successfully');
      navigate('/business-list'); // Redirect back to Business list directory (not dashboard)
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert('Error registering business client. Please check fields and try again.');
    }
  };

  const stepsList = [
    { num: 1, label: 'Profile', icon: Briefcase },
    { num: 2, label: 'Banking', icon: CreditCard },
    { num: 3, label: 'Office Address', icon: MapPin },
    { num: 4, label: 'DSC & Liaison', icon: Bell },
    { num: 5, label: 'Vault Uploads', icon: FileText }
  ];

  return (
    <div className="add-client-page fade-in">
      <div className="add-client-header">
        <button className="back-button" onClick={() => navigate('/business-list')}>
          <ArrowLeft size={16} />
          <span>Directory</span>
        </button>
        <h1>Register Business Client</h1>
        <p>Set up a corporate assessee profile. Proceed through the visual wizard steps.</p>
      </div>

      {/* Multi-step progress bar */}
      <div className="step-progress-bar">
        {stepsList.map(s => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <div key={s.num} className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="step-circle">
                {isCompleted ? <Check size={16} /> : <Icon size={14} />}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="registration-form-card glass-card">
        {step === 1 && (
          <div className="step-form-section">
            <h3>Step 1: Corporate Profile</h3>
            <div className="form-group-custom">
              <label>Assessee Constitution Type *</label>
              <select name="assesseeType" value={businessData.assesseeType} onChange={handleChange} required className="form-control-custom">
                <option value="">Select Assessee Type</option>
                {assesseeTypes.map(type => (
                  <option key={type.item_id || type._id} value={type.bassessmentvalues}>
                    {type.bassessmentvalues}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group-custom">
              <label>Business Name (Corporate Title) *</label>
              <input type="text" name="businessName" value={businessData.businessName} onChange={handleChange} placeholder="e.g. Acme Corporation Pvt Ltd" required className="form-control-custom" />
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Business Owner / Director Name *</label>
                <input type="text" name="businessOwnerName" value={businessData.businessOwnerName} onChange={handleChange} placeholder="Director name" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Type of Business / Industry *</label>
                <input type="text" name="typeOfBusiness" value={businessData.typeOfBusiness} onChange={handleChange} placeholder="e.g. IT, Manufacturing" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-group-custom">
              <label>Business Registration Number (CIN/LLPIN) *</label>
              <input type="text" name="businessRegistrationNumber" value={businessData.businessRegistrationNumber} onChange={handleChange} placeholder="CIN/LLP registration code" required className="form-control-custom" />
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>PAN of Business *</label>
                <input type="text" name="panOfBusiness" value={businessData.panOfBusiness} onChange={handleChange} placeholder="10-character code" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>GSTIN ID</label>
                <input type="text" name="gstin" value={businessData.gstin} onChange={handleChange} placeholder="15-character GST code" className="form-control-custom" />
              </div>
            </div>
            <div className="form-group-custom">
              <label>Authorized Signatory Authority Name *</label>
              <input type="text" name="signatoryAuthorityName" value={businessData.signatoryAuthorityName} onChange={handleChange} placeholder="Authorized representative" required className="form-control-custom" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-form-section">
            <h3>Step 2: Corporate Bank Accounts</h3>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Bank Name *</label>
                <input type="text" name="bankName" value={businessData.bankName} onChange={handleChange} placeholder="Bank name" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Branch Name *</label>
                <input type="text" name="branchName" value={businessData.branchName} onChange={handleChange} placeholder="Branch location" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Bank Account Number *</label>
                <input type="text" name="bankAccountNumber" value={businessData.bankAccountNumber} onChange={handleChange} placeholder="A/C Number" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>IFSC Code *</label>
                <input type="text" name="ifscCode" value={businessData.ifscCode} onChange={handleChange} placeholder="IFSC Code" required className="form-control-custom" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-form-section">
            <h3>Step 3: Registered Office Address</h3>
            <div className="form-group-custom">
              <label>Street Address *</label>
              <input type="text" name="streetAddress" value={businessData.streetAddress} onChange={handleChange} placeholder="Suite, Building, Locality" required className="form-control-custom" />
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>City *</label>
                <input type="text" name="city" value={businessData.city} onChange={handleChange} placeholder="City" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>State *</label>
                <input type="text" name="state" value={businessData.state} onChange={handleChange} placeholder="State" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Postal Code *</label>
                <input type="text" name="postalCode" value={businessData.postalCode} onChange={handleChange} placeholder="6-digit ZIP code" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Country *</label>
                <input type="text" name="country" value={businessData.country} onChange={handleChange} required className="form-control-custom" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-form-section">
            <h3>Step 4: DSC Password & Liaison Contacts</h3>
            <div className="form-group-custom">
              <label>DSC Signature Password *</label>
              <input type="text" name="dscPassword" value={businessData.dscPassword} onChange={handleChange} placeholder="DSC Token Password" required className="form-control-custom" />
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Contact Phone Number *</label>
                <input type="text" name="contactPhoneNumber" value={businessData.contactPhoneNumber} onChange={handleChange} placeholder="Phone number" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Contact Email *</label>
                <input type="email" name="contactEmail" value={businessData.contactEmail} onChange={handleChange} placeholder="office@domain.com" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-group-custom">
              <label>Primary Contact Person Name *</label>
              <input type="text" name="contactPersonName" value={businessData.contactPersonName} onChange={handleChange} placeholder="Primary liaison officer name" required className="form-control-custom" />
            </div>
            <div className="form-group-custom">
              <label>Special Instructions / Notes</label>
              <textarea name="notes" value={businessData.notes} onChange={handleChange} placeholder="Specify any additional company notes or filing instructions..." className="form-control-custom" style={{ minHeight: '80px', resize: 'vertical' }} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-form-section">
            <h3>Step 5: Corporate Document Vault</h3>
            <p className="vault-subtitle">Please upload company identification and certificate copies to initialize the document vault.</p>
            
            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Company PAN Certificate *</label>
              <input type="file" name="panCardFile" onChange={handleChange} required />
              {businessData.panCardFile && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {businessData.panCardFile.name}</span>}
            </div>

            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload GSTIN Certificate</label>
              <input type="file" name="gstinFile" onChange={handleChange} />
              {businessData.gstinFile && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {businessData.gstinFile.name}</span>}
            </div>

            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Other Corporate Supporting File *</label>
              <input type="file" name="otherDocumentFile" onChange={handleChange} required />
              {businessData.otherDocumentFile && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {businessData.otherDocumentFile.name}</span>}
            </div>
          </div>
        )}

        <div className="form-navigation-actions">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="prev-step-btn">
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>
          )}
          
          {step < 5 ? (
            <button type="button" onClick={nextStep} className="next-step-btn btn-primary">
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" className="submit-form-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Register Business'}
              {!loading && <Check size={16} />}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BusinessSignup;
