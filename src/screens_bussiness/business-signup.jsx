import API_BASE_URL from '../config';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';


const BusinessSignup = () => {
  const [step, setStep] = useState(1);
  const [assesseeTypes, setAssesseeTypes] = useState([]);
  const navigate = useNavigate();
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
    otherDocumentFile: null,
    avatar: ''
  });

  useEffect(() => {
    // Fetch assessee types from the backend
    axios.get(`${API_BASE_URL}/business-assessment-types`)
      .then(response => {
        setAssesseeTypes(response.data);
      })
      .catch(error => {
        console.error(error);
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
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    for (const key in businessData) {
      formData.append(key, businessData[key]);
    }
  
    axios.post(`${API_BASE_URL}/business-signup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('Business registered successfully');
      navigate('/home')
    })
    .catch(error => {
      console.error(error);
    });
  };
  
  return (
    <div className="business-signup-page"
    style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'
    }}
    >
      <h1>Business Signup</h1>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div>
              <label>Assessee Type</label>
              <select name="assesseeType" value={businessData.assesseeType} onChange={handleChange} required>
                <option value="">Select Assessee Type</option>
                {assesseeTypes.map(type => (
                  <option key={type.item_id} value={type.bassessmentvalues}>
                    {type.bassessmentvalues}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Business Name</label>
              <input type="text" name="businessName" value={businessData.businessName} onChange={handleChange} required />
            </div>
            <div>
              <label>Business Owner Name</label>
              <input type="text" name="businessOwnerName" value={businessData.businessOwnerName} onChange={handleChange} required />
            </div>
            <div>
              <label>Type of Business</label>
              <input type="text" name="typeOfBusiness" value={businessData.typeOfBusiness} onChange={handleChange} required />
            </div>
            <div>
              <label>Business Registration Number</label>
              <input type="text" name="businessRegistrationNumber" value={businessData.businessRegistrationNumber} onChange={handleChange} required />
            </div>
            <div>
              <label>PAN of Business</label>
              <input type="text" name="panOfBusiness" value={businessData.panOfBusiness} onChange={handleChange} required />
            </div>
            <div>
              <label>GSTIN</label>
              <input type="text" name="gstin" value={businessData.gstin} onChange={handleChange} />
            </div>
            <div>
              <label>Signatory Authority Name</label>
              <input type="text" name="signatoryAuthorityName" value={businessData.signatoryAuthorityName} onChange={handleChange} required />
            </div>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label>Bank Details</label><br />
              <label>Bank Name</label>
              <input type="text" name="bankName" value={businessData.bankName} onChange={handleChange} required />
              <label>Branch Name</label>
              <input type="text" name="branchName" value={businessData.branchName} onChange={handleChange} required />
              <label>A/C Number</label>
              <input type="text" name="bankAccountNumber" value={businessData.bankAccountNumber} onChange={handleChange} required />
              <label>IFSC CODE</label>
              <input type="text" name="ifscCode" value={businessData.ifscCode} onChange={handleChange} required />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 3 && (
          <>
            <div>
              <label>Business Address</label><br />
              <label>Street Address</label>
              <input type="text" name="streetAddress" value={businessData.streetAddress} onChange={handleChange} required />
            </div>
            <div>
              <label>City</label>
              <input type="text" name="city" value={businessData.city} onChange={handleChange} required />
            </div>
            <div>
              <label>State</label>
              <input type="text" name="state" value={businessData.state} onChange={handleChange} required />
            </div>
            <div>
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={businessData.postalCode} onChange={handleChange} required />
            </div>
            <div>
              <label>Country</label>
              <input type="text" name="country" value={businessData.country} onChange={handleChange} required />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 4 && (
          <>
            <div>
              <label>DSC Details</label><br />
              <label>DSC Password</label>
              <input type="text" name="dscPassword" value={businessData.dscPassword} onChange={handleChange} required />
            </div>
            <div>
              <label>Contact Information</label><br />
              <label>Phone Number</label>
              <input type="text" name="contactPhoneNumber" value={businessData.contactPhoneNumber} onChange={handleChange} required />
              <label>Email</label>
              <input type="text" name="contactEmail" value={businessData.contactEmail} onChange={handleChange} required />
              <label>Contact Person Name</label>
              <input type="text" name="contactPersonName" value={businessData.contactPersonName} onChange={handleChange} required />
            </div>
            <div>
              <label>Notes</label>
              <textarea name="notes" value={businessData.notes} onChange={handleChange} />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 5 && (
          <>
            <div>
              <label>Upload PAN Card</label>
              <input type="file" name="panCardFile" onChange={handleChange} required />
            </div>
            <div>
              <label>Upload GSTIN Document</label>
              <input type="file" name="gstinfile" onChange={handleChange} />
            </div>
            <div>
              <label>Upload Other Documents</label>
              <input type="file" name="otherDocumentFile" onChange={handleChange} required />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="submit">Submit</button>
          </>
        )}
      </form>
    </div>
  );
};

export default BusinessSignup;
