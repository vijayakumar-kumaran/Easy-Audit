import API_BASE_URL from '../config';
import React, { useState } from "react";
import axios from 'axios';
import '../css/customer_list.css'
const Customersignup = () => {
  const [step, setStep] = useState(1);
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setCustomerData({ ...customerData, [name]: files[0] });
    } else {
      setCustomerData({ ...customerData, [name]: value });
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
    for (const key in customerData) {
      formData.append(key, customerData[key]);
    }

    axios.post(`${API_BASE_URL}/customer-signup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('User registered successfully');
      window.location.href = '/login';
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div className="add-client-page">
      <h1>Customer Signup</h1>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div>
              <label>Assessee Type</label>
              <select name="assesseeType" value={customerData.assesseeType} onChange={handleChange} required>
                <option value="">Select Assessee Type</option>
                <option value="individual">Individual</option>
                <option value="HUF">HUF</option>
                <option value="AOD/BOI">AOD/BOI</option>
              </select>
            </div>
            <div>
              <label>Assessee First Name</label>
              <input type="text" name="assesseefirstName" value={customerData.assesseefirstName} onChange={handleChange} required />
            </div>
            <div>
              <label>Assessee Last Name</label>
              <input type="text" name="assesseelastName" value={customerData.assesseelastName} onChange={handleChange} required />
            </div>
            <div>
              <label>Father Name/Husband Name</label>
              <input type="text" name="fatherHusbandName" value={customerData.fatherHusbandName} onChange={handleChange} required />
            </div>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label>Marital Status</label>
              <select name="maritialstatus" value={customerData.maritialstatus} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="unmarried">Unmarried</option>
                <option value="married">Married</option>
              </select>
            </div>
            <div>
              <label>Date of Birth (Day/Month/Year)</label>
              <input type="number" name="day" value={customerData.day} onChange={handleChange} required placeholder="Day" />
              <input type="number" name="month" value={customerData.month} onChange={handleChange} required placeholder="Month" />
              <input type="number" name="year" value={customerData.year} onChange={handleChange} required placeholder="Year" />
            </div>
            <div>
              <label>Pan Number</label>
              <input type="text" name="panNumber" value={customerData.panNumber} onChange={handleChange} required />
            </div>
            <div>
              <label>Aadhar Number</label>
              <input type="text" name="aadharNumber" value={customerData.aadharNumber} onChange={handleChange} required />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 3 && (
          <>
            <div>
              <label>Contact Information</label><br />
              <label>Phone Number</label>
              <input type="text" name="phoneNumber" value={customerData.phoneNumber} onChange={handleChange} required />
            </div>
            <div>
              <label>Email</label>
              <input type="text" name="emailAddress" value={customerData.emailAddress} onChange={handleChange} required />
            </div>
            <div>
              <label>Contact Person Name</label>
              <input type="text" name="contactPersonName" value={customerData.contactPersonName} onChange={handleChange} required />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 4 && (
          <>
            <div>
              <label>Residential Address</label><br />
              <label>Street Address</label>
              <input type="text" name="streetAddress" value={customerData.streetAddress} onChange={handleChange} required />
            </div>
            <div>
              <label>City</label>
              <input type="text" name="city" value={customerData.city} onChange={handleChange} required />
            </div>
            <div>
              <label>State</label>
              <input type="text" name="state" value={customerData.state} onChange={handleChange} required />
            </div>
            <div>
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={customerData.postalCode} onChange={handleChange} required />
            </div>
            <div>
              <label>Country</label>
              <input type="text" name="country" value={customerData.country} onChange={handleChange} required />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 5 && (
          <>
            <div>
              <label>Bank Details</label><br />
              <label>Bank Name</label>
              <input type="text" name="bankName" value={customerData.bankName} onChange={handleChange} required />
              <label>Branch Name</label>
              <input type="text" name="branchName" value={customerData.branchName} onChange={handleChange} required />
              <label>A/C Number</label>
              <input type="text" name="bankAccountNumber" value={customerData.bankAccountNumber} onChange={handleChange} required />
              <label>IFSC CODE</label>
              <input type="text" name="ifscCode" value={customerData.ifscCode} onChange={handleChange} required />
            </div>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 6 && (
          <>
            <div>
              <label>DSC Details</label><br />
              <label>DSC Password</label>
              <input type="text" name="dscPassword" value={customerData.dscPassword} onChange={handleChange} required />
            </div>
            <div>
              <label>Upload PAN Card</label>
              <input type="file" name="panCardFile" onChange={handleChange} required />
            </div>
            <div>
              <label>Upload Aadhar Card</label>
              <input type="file" name="adharCardFile" onChange={handleChange} required />
            </div>
            <div>
              <label>Upload Other Document</label>
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

export default Customersignup;
