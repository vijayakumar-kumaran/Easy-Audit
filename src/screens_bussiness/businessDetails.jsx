import API_BASE_URL from '../config';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/customer_detail.css";
import { useAuth } from "../AuthContext";

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
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
    fetchBusiness();
  }, [user, id]);

  const fetchBusiness = async () => {
    try {
      const url = `${API_BASE_URL}/business_list/${id}`;
      const response = await axios.get(url);
      console.log('Fetched business data:', response.data);
      setBusiness(response.data);
      setBusinessData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching business data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setBusinessData(prevData => ({
        ...prevData,
        [name]: files[0]
      }));
    } else {
      setBusinessData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in businessData) {
        formData.append(key, businessData[key]);
      }
      await axios.put(`${API_BASE_URL}/business_list/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Customer information updated successfully');
      fetchBusiness();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/business_list/${id}`);
      alert('Business deleted successfully');
      navigate('/business-list');
    } catch (error) {
      console.error("Error deleting Business:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading customer data</div>;

  return (
    <div className="customer-details-page">
      <h2>Business Details</h2>
      {editMode ? (
        <form className="customer-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Assessee Type</label>
              <input type="text" name="asseseeType" value={businessData.assesseeType} onChange={handleChange} required />

            </div>
            <div className="form-group">
              <label>Business Name</label>
              <input type="text" name="businessName" value={businessData.businessName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Business Owner Name</label>
              <input type="text" name="businessOwnerName" value={businessData.businessOwnerName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Type of Business</label>
              <input type="text" name="typeOfBusiness" value={businessData.typeOfBusiness} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Business Registration Number</label>
              <input type="text" name="businessRegistrationNumber" value={businessData.businessRegistrationNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>PAN Of Business</label>
              <input type="text" name="panOfBusiness" value={businessData.panOfBusiness} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>GSTIN</label>
              <input type="text" name="gstin" value={businessData.gstin} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Signatory Authority Name</label>
              <input type="text" name="signatoryAuthorityName" value={businessData.signatoryAuthorityName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Bank Name</label>
              <input type="text" name="bankName" value={businessData.bankName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Branch Name</label>
              <input type="text" name="branchName" value={businessData.branchName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Bank Account Number</label>
              <input type="text" name="bankAccountNumber" value={businessData.bankAccountNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input type="text" name="ifscCode" value={businessData.ifscCode} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Street Address</label>
              <input type="text" name="streetAddress" value={businessData.streetAddress} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={businessData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" value={businessData.state} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={businessData.postalCode} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={businessData.country} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>DSC Password</label>
              <input type="text" name="dscPassword" value={businessData.dscPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Phone Number</label>
              <input type="text" name="contactPhoneNumber" value={businessData.contactPhoneNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" name="contactEmail" value={businessData.contactEmail} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Person Name</label>
              <input type="text" name="contactPersonName" value={businessData.contactPersonName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={businessData.notes} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>PAN Card</label>
              <input type="file" name="panCardFile" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>GSTIN</label>
              <input type="file" name="gstinFile" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Other Documents</label>
              <input type="file" name="otherDocumentFile" onChange={handleChange} />
            </div>
          </div>
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <div className="customer-info-grid">
            <div className="customer-info">
              <h3>Assessee Type:</h3>
              <p>{businessData.assesseeType}</p>
              <h3>Business Name:</h3>
              <p>{businessData.businessName}</p>
              <h3>Business Owner Name:</h3>
              <p>{businessData.businessOwnerName}</p>
              <h3>Type of Business:</h3>
              <p>{businessData.typeOfBusiness}</p>
              <h3>Business Registration Number:</h3>
              <p>{businessData.businessRegistrationNumber}</p>
              <h3>PAN Of Business:</h3>
              <p>{businessData.panOfBusiness}</p>
              <h3>GSTIN:</h3>
              <p>{businessData.gstin}</p>
              <h3>Signatory Authority Name:</h3>
              <p>{businessData.signatoryAuthorityName}</p>
              <h3>Bank Name:</h3>
              <p>{businessData.bankName}</p>
              <h3>Branch Name:</h3>
              <p>{businessData.branchName}</p>
              <h3>Bank Account Number:</h3>
              <p>{businessData.bankAccountNumber}</p>
              <h3>IFSC Code:</h3>
              <p>{businessData.ifscCode}</p>
              <h3>Street Address:</h3>
              <p>{businessData.streetAddress}</p>
              <h3>City:</h3>
              <p>{businessData.city}</p>
              <h3>State:</h3>
              <p>{businessData.state}</p>
              <h3>Postal Code:</h3>
              <p>{businessData.postalCode}</p>
              <h3>Country:</h3>
              <p>{businessData.country}</p>
              <h3>DSC Password:</h3>
              <p>{businessData.dscPassword}</p>
              <h3>Contact Phone Number:</h3>
              <p>{businessData.contactPhoneNumber}</p>
              <h3>Contact Email:</h3>
              <p>{businessData.contactEmail}</p>
              <h3>Contact Person Name:</h3>
              <p>{businessData.contactPersonName}</p>
              <h3>Notes:</h3>
              <p>{businessData.notes}</p>
              <h3>PAN Card:</h3>
              <p>{businessData.panCardFile}</p>
              <h3>GSTIN:</h3>
              <p>{businessData.gstinFile}</p>
              <h3>Other Documents:</h3>
              <p>{businessData.otherDocumentFile}</p>
            </div>
          </div>
          {user&& user.userType === 'admin' && (
            <div>
            <button onClick={() => setEditMode(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessDetails;
