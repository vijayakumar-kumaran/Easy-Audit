import API_BASE_URL from '../config';
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/create_tax_assessment.css";

const BusinessTaxCreate = () => {
  const { id } = useParams(); // This is the business_listID
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [auditUsers, setAuditUsers] = useState([]);

  const [bassessmentData, setbAssessmentData] = useState({
    assessmentYear: '',
    notes: '',
    document: null,
    assignedTo: ''
  });
  const fetchAuditUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit-users`);
      setAuditUsers(response.data);
    } catch (error) {
      console.error("Error fetching audit users:", error);
    }
  }, []);
  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business_list/${id}`);
      setBusiness(response.data);
    } catch (error) {
      console.error("Error fetching business:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAuditUsers();
    fetchBusiness();
  }, [fetchAuditUsers,fetchBusiness]);

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

      await axios.post(`${API_BASE_URL}/business-tax-assessments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Tax assessment created successfully');
      navigate('/business-list-for-tax');
    } catch (error) {
      console.error("Error creating tax assessment:", error);
    }
  };

  if (!business) return <div>Loading...</div>;

  return (
    <div className="create-tax-assessment-page">
      <h2>Create Tax Assessment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assessee Type</label>
          <input type="text" value={business.assesseeType} readOnly />
        </div>
        <div>
          <label>Business Name</label>
          <input type="text" value={business.businessName} readOnly />
        </div>
        <div>
          <label>Business Owner Name</label>
          <input type="text" value={business.businessOwnerName} readOnly />
        </div>
        <div>
          <label>Type of Business</label>
          <input type="text" value={business.typeOfBusiness} readOnly />
        </div>
        <div>
          <label>Business Registration Number</label>
          <input type="text" value={business.businessRegistrationNumber} readOnly />
        </div>
        <div>
          <label>PAN Of Business</label>
          <input type="text" value={business.panOfBusiness} readOnly />
        </div>
        <div>
          <label>GSTIN</label>
          <input type="text" value={business.gstin} readOnly />
        </div>
        <div>
          <label>Contact Person Name</label>
          <input type="text" value={business.contactPersonName} readOnly />
        </div>
        <div>
          <label>Assessment Year</label>
          <select name="assessmentYear" value={bassessmentData.assessmentYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            {/* Add more years as needed */}
          </select>
        </div>
        <div>
          <label>Notes</label>
          <textarea type="text" name="notes" value={bassessmentData.notes} onChange={handleChange} required />
        </div>
        <div>
          <label>Upload Document</label>
          <input type="file" name="document" onChange={handleChange} required />
        </div>
        <div>
          <label>Assigned To</label>
          <select name="assignedTo" value={bassessmentData.assignedTo} onChange={handleChange} required>
            <option value="">Select Assignee</option>
            {auditUsers.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BusinessTaxCreate;
