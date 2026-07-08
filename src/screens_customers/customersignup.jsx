import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, User, MapPin, CreditCard, FileText, Bell } from 'lucide-react';
import axios from 'axios';
import '../css/add_client.css';
import '../css/customer_detail.css'

const Customersignup = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
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
    country: 'India',
    bankName: '',
    branchName: '',
    bankAccountNumber: '',
    ifscCode: '',
    dscPassword: '',
    panCardFile: null,
    adharCardFile: null,
    otherDocumentFile: null
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setCustomerData({ ...customerData, [name]: files[0] });
    } else {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

  const nextStep = () => {
    // Basic validations per step
    if (step === 1 && (!customerData.assesseeType || !customerData.assesseefirstName || !customerData.assesseelastName)) {
      alert("Please fill all required fields in this step.");
      return;
    }
    if (step === 2 && (!customerData.panNumber || !customerData.aadharNumber)) {
      alert("PAN and Aadhar numbers are required.");
      return;
    }
    if (step === 3 && (!customerData.phoneNumber || !customerData.emailAddress)) {
      alert("Please provide phone and email details.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerData.panCardFile || !customerData.adharCardFile) {
      alert("Please upload PAN card and Aadhar card files in step 6.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    for (const key in customerData) {
      formData.append(key, customerData[key]);
    }

    try {
      await axios.post('/api/customer-signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLoading(false);
      alert('Client registered successfully');
      navigate('/customers'); // Redirect back to Client Directory (not legacy /login logout)
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert('Error registering client. Please verify fields and try again.');
    }
  };

  const stepsList = [
    { num: 1, label: 'Profile', icon: User },
    { num: 2, label: 'Personal', icon: InfoIcon },
    { num: 3, label: 'Contact', icon: Bell },
    { num: 4, label: 'Address', icon: MapPin },
    { num: 5, label: 'Banking', icon: CreditCard },
    { num: 6, label: 'Vault', icon: FileText }
  ];

  // Helper custom info icon
  function InfoIcon(props) {
    return <span style={{ fontSize: '0.85rem' }}>ℹ</span>;
  }

  return (
    <div className="add-client-page fade-in">
      <div className="add-client-header">
        <button className="back-button" onClick={() => navigate('/customers')}>
          <ArrowLeft size={16} />
          <span>Directory</span>
        </button>
        <h1>Register Individual Client</h1>
        <p>Register a new individual assessee profile. Proceed through the visual wizard steps.</p>
      </div>

      {/* Multi-step step progress indicators */}
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
            <h3>Step 1: Assessee Profile Details</h3>
            <div className="form-group-custom">
              <label>Assessee Type *</label>
              <select name="assesseeType" value={customerData.assesseeType} onChange={handleChange} required className="form-control-custom">
                <option value="">Select Assessee Type</option>
                <option value="Individual">Individual</option>
                <option value="HUF">HUF</option>
                <option value="AOD/BOI">AOD/BOI</option>
              </select>
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>First Name *</label>
                <input type="text" name="assesseefirstName" value={customerData.assesseefirstName} onChange={handleChange} placeholder="First name" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Last Name *</label>
                <input type="text" name="assesseelastName" value={customerData.assesseelastName} onChange={handleChange} placeholder="Last name" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-group-custom">
              <label>Father's / Husband's Name *</label>
              <input type="text" name="fatherHusbandName" value={customerData.fatherHusbandName} onChange={handleChange} placeholder="Guardian/Husband name" required className="form-control-custom" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-form-section">
            <h3>Step 2: Personal Identifications</h3>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Marital Status *</label>
                <select name="maritialstatus" value={customerData.maritialstatus} onChange={handleChange} required className="form-control-custom">
                  <option value="">Select</option>
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              <div className="form-group-custom">
                <label>Date of Birth *</label>
                <div className="dob-inputs">
                  <input type="text" name="day" value={customerData.day} onChange={handleChange} required placeholder="DD" className="form-control-custom" />
                  <input type="text" name="month" value={customerData.month} onChange={handleChange} required placeholder="MM" className="form-control-custom" />
                  <input type="text" name="year" value={customerData.year} onChange={handleChange} required placeholder="YYYY" className="form-control-custom" />
                </div>
              </div>
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>PAN Number *</label>
                <input type="text" name="panNumber" value={customerData.panNumber} onChange={handleChange} placeholder="ABCDE1234F" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Aadhar Number *</label>
                <input type="text" name="aadharNumber" value={customerData.aadharNumber} onChange={handleChange} placeholder="12-digit number" required className="form-control-custom" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-form-section">
            <h3>Step 3: Contact Channels</h3>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Phone Number *</label>
                <input type="text" name="phoneNumber" value={customerData.phoneNumber} onChange={handleChange} placeholder="Phone number" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Email Address *</label>
                <input type="email" name="emailAddress" value={customerData.emailAddress} onChange={handleChange} placeholder="name@domain.com" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-group-custom">
              <label>Contact Person Name *</label>
              <input type="text" name="contactPersonName" value={customerData.contactPersonName} onChange={handleChange} placeholder="Representative name" required className="form-control-custom" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-form-section">
            <h3>Step 4: Residential Address</h3>
            <div className="form-group-custom">
              <label>Street Address *</label>
              <input type="text" name="streetAddress" value={customerData.streetAddress} onChange={handleChange} placeholder="House no, Street, Locality" required className="form-control-custom" />
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>City *</label>
                <input type="text" name="city" value={customerData.city} onChange={handleChange} placeholder="City name" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>State *</label>
                <input type="text" name="state" value={customerData.state} onChange={handleChange} placeholder="State name" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Postal Code *</label>
                <input type="text" name="postalCode" value={customerData.postalCode} onChange={handleChange} placeholder="6-digit ZIP" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Country *</label>
                <input type="text" name="country" value={customerData.country} onChange={handleChange} required className="form-control-custom" />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="step-form-section">
            <h3>Step 5: Banking Information</h3>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Bank Name *</label>
                <input type="text" name="bankName" value={customerData.bankName} onChange={handleChange} placeholder="e.g. HDFC Bank" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>Branch Name *</label>
                <input type="text" name="branchName" value={customerData.branchName} onChange={handleChange} placeholder="Branch name" required className="form-control-custom" />
              </div>
            </div>
            <div className="form-grid-2col">
              <div className="form-group-custom">
                <label>Bank Account Number *</label>
                <input type="text" name="bankAccountNumber" value={customerData.bankAccountNumber} onChange={handleChange} placeholder="A/C Number" required className="form-control-custom" />
              </div>
              <div className="form-group-custom">
                <label>IFSC Code *</label>
                <input type="text" name="ifscCode" value={customerData.ifscCode} onChange={handleChange} placeholder="11-digit code" required className="form-control-custom" />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="step-form-section">
            <h3>Step 6: Digital Signature & Files</h3>
            <div className="form-group-custom">
              <label>DSC Signature Password *</label>
              <input type="text" name="dscPassword" value={customerData.dscPassword} onChange={handleChange} placeholder="DSC Token Password" required className="form-control-custom" />
            </div>
            
            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload PAN Card (PDF/Image) *</label>
              <input type="file" name="panCardFile" onChange={handleChange} required />
              {customerData.panCardFile && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {customerData.panCardFile.name}</span>}
            </div>

            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Aadhar Card (PDF/Image) *</label>
              <input type="file" name="adharCardFile" onChange={handleChange} required />
              {customerData.adharCardFile && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {customerData.adharCardFile.name}</span>}
            </div>

            <div className="form-group-custom" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px dashed var(--border-glass)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload Other Document (PDF/Image) *</label>
              <input type="file" name="otherDocumentFile" onChange={handleChange} required />
              {customerData.otherDocumentFile && <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', display: 'block', marginTop: '0.25rem' }}>✓ {customerData.otherDocumentFile.name}</span>}
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
          
          {step < 6 ? (
            <button type="button" onClick={nextStep} className="next-step-btn btn-primary">
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" className="submit-form-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Register Client'}
              {!loading && <Check size={16} />}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Customersignup;
