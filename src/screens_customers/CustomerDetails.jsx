import API_BASE_URL from '../config';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/customer_detail.css";
import { useAuth } from '../AuthContext';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
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
      const url = `${API_BASE_URL}/customers/${id}`;
      const response = await axios.get(url);
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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in customerData) {
        formData.append(key, customerData[key]);
      }
      await axios.put(`${API_BASE_URL}/customers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Customer information updated successfully');
      fetchCustomer();
      setEditMode(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/customers/${id}`);
      alert('Customer deleted successfully');
      navigate('/customers');
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading customer data</div>;

  return (
    <div className="customer-details-page">
      <h2>Customer Details</h2>
      {editMode ? (
        <form className="customer-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Assessee Type</label>
              <select name="assesseeType" value={customerData.assesseeType} onChange={handleChange} required>
                <option value="">Select Assessee Type</option>
                <option value="individual">Individual</option>
                <option value="HUF">HUF</option>
                <option value="AOD/BOI">AOD/BOI</option>
              </select>
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="assesseefirstName" value={customerData.assesseefirstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="assesseelastName" value={customerData.assesseelastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Father/Husband Name</label>
              <input type="text" name="fatherHusbandName" value={customerData.fatherHusbandName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Marital Status</label>
              <input type="text" name="maritialstatus" value={customerData.maritialstatus} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="text" name="day" value={customerData.day} onChange={handleChange} required placeholder="Day" />
              <input type="text" name="month" value={customerData.month} onChange={handleChange} required placeholder="Month" />
              <input type="text" name="year" value={customerData.year} onChange={handleChange} required placeholder="Year" />
            </div>
            <div className="form-group">
              <label>PAN Number</label>
              <input type="text" name="panNumber" value={customerData.panNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Aadhar Number</label>
              <input type="text" name="aadharNumber" value={customerData.aadharNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phoneNumber" value={customerData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="emailAddress" value={customerData.emailAddress} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input type="text" name="contactPersonName" value={customerData.contactPersonName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="streetAddress" value={customerData.streetAddress} onChange={handleChange} required placeholder="Street Address" />
              <input type="text" name="city" value={customerData.city} onChange={handleChange} required placeholder="City" />
              <input type="text" name="state" value={customerData.state} onChange={handleChange} required placeholder="State" />
              <input type="text" name="postalCode" value={customerData.postalCode} onChange={handleChange} required placeholder="Postal Code" />
              <input type="text" name="country" value={customerData.country} onChange={handleChange} required placeholder="Country" />
            </div>
            <div className="form-group">
              <label>Bank Name</label>
              <input type="text" name="bankName" value={customerData.bankName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Branch Name</label>
              <input type="text" name="branchName" value={customerData.branchName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Bank Account Number</label>
              <input type="text" name="bankAccountNumber" value={customerData.bankAccountNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input type="text" name="ifscCode" value={customerData.ifscCode} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>DSC Password</label>
              <input type="text" name="dscPassword" value={customerData.dscPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>PAN Card File</label>
              <input type="file" name="panCardFile" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Aadhar Card File</label>
              <input type="file" name="adharCardFile" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Other Document File</label>
              <input type="file" name="otherDocumentFile" onChange={handleChange} />
            </div>
          </div>
          <div className="button-group">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="customer-info">
          <div className="details-card">
            <h3>Personal Information</h3>
            <p><strong>Assessee Type:</strong> {customer.assesseeType}</p>
            <p><strong>First Name:</strong> {customer.assesseefirstName}</p>
            <p><strong>Last Name:</strong> {customer.assesseelastName}</p>
            <p><strong>Father/Husband Name:</strong> {customer.fatherHusbandName}</p>
            <p><strong>Marital Status:</strong> {customer.maritialstatus}</p>
            <p><strong>Date of Birth:</strong> {customer.day}/{customer.month}/{customer.year}</p>
            <p><strong>PAN Number:</strong> {customer.panNumber}</p>
            <p><strong>Aadhar Number:</strong> {customer.aadharNumber}</p>
            <p><strong>Phone Number:</strong> {customer.phoneNumber}</p>
            <p><strong>Email:</strong> {customer.emailAddress}</p>
            <p><strong>Contact Person:</strong> {customer.contactPersonName}</p>
          </div>
          <div className="details-card">
            <h3>Address</h3>
            <p><strong>Street Address:</strong> {customer.streetAddress}</p>
            <p><strong>City:</strong> {customer.city}</p>
            <p><strong>State:</strong> {customer.state}</p>
            <p><strong>Postal Code:</strong> {customer.postalCode}</p>
            <p><strong>Country:</strong> {customer.country}</p>
          </div>
          <div className="details-card">
            <h3>Bank Information</h3>
            <p><strong>Bank Name:</strong> {customer.bankName}</p>
            <p><strong>Branch Name:</strong> {customer.branchName}</p>
            <p><strong>Bank Account Number:</strong> {customer.bankAccountNumber}</p>
            <p><strong>IFSC Code:</strong> {customer.ifscCode}</p>
          </div>
          <div className="details-card">
            <h3>Additional Information</h3>
            <p><strong>DSC Password:</strong> {customer.dscPassword}</p>
          </div>
          {user && user.userType === 'admin' && (
          <div className="button-group">
            <button type="button" onClick={() => setEditMode(true)}>Edit</button>
            <button type="button" onClick={handleDelete}>Delete</button>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
