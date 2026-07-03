import API_BASE_URL from '../config';
// src/components/UpdateTaxAssessment.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";


const BusinessUpdateTaxAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [auditUsers, setAuditUsers] = useState([]);
  const [busassessmentData, setBusAssessmentData] = useState({

    business_listID: '',
    assesseeType: '',
    businessName: '',
    businessOwnerName: '',
    typeOfBusiness: '',
    businessRegistrationNumber: '',
    panOfBusiness: '',
    gstin: '',
    contactPersonName: '',
    assessmentYear: '',
    notes: '',
    document: null,
    assignedTo: '',
    status: '',
    comments:''
  });

  const fetchAuditUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit-users`);
      setAuditUsers(response.data);
    } catch (error) {
      console.error("Error fetching audit users:", error);
    }
  }, []);

  const fetchBusAssessment = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/update-tax-assessments/${id}`);
      setBusAssessmentData(response.data);
    } catch (error) {
      console.error("Error fetching tax assessment:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAuditUsers();
    fetchBusAssessment();
  }, [user, fetchAuditUsers, fetchBusAssessment]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setBusAssessmentData({ ...busassessmentData, [name]: files[0] });
    } else {
      setBusAssessmentData({ ...busassessmentData, [name]: value });
    }
    console.log("Updated busassessmentData:", busassessmentData);
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('business_listID', busassessmentData.business_listID);
      formData.append('assesseeType', busassessmentData.assesseeType);
      formData.append('businessName', busassessmentData.businessName);
      formData.append('businessOwnerName', busassessmentData.businessOwnerName);
      formData.append('typeOfBusiness', busassessmentData.typeOfBusiness);
      formData.append('businessRegistrationNumber', busassessmentData.businessRegistrationNumber);
      formData.append('panOfBusiness', busassessmentData.panOfBusiness);
      formData.append('gstin', busassessmentData.gstin);
      formData.append('contactPersonName', busassessmentData.contactPersonName);
      formData.append('assessmentYear', busassessmentData.assessmentYear);
      formData.append('notes', busassessmentData.notes);
      formData.append('document', busassessmentData.document);
      formData.append('assignedTo', busassessmentData.assignedTo);
      formData.append('status', busassessmentData.status);
      formData.append('comments', busassessmentData.comments);
  
      console.log("Form Data: ", Array.from(formData.entries()));
  
      await axios.put(`${API_BASE_URL}/updated-tax-assessments/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Tax assessment updated successfully');
      navigate('/business-list-of-tax-assessments');
    } catch (error) {
      console.error("Error updating tax assessment:", error);
    }
  };
  

  if (!busassessmentData.business_listID) return <div>Loading...</div>;
  
  return (
    <div className="update-tax-assessment-page">
      <h2>Update Tax Assessment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assessee Type</label>
          <input type="text" name="assesseeType" value={busassessmentData.assesseeType} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Business Name</label>
          <input type="text" name="businessName" value={busassessmentData.businessName} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Business Owner Name</label>
          <input type="text" name="businessOwnerName" value={busassessmentData.businessOwnerName} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Type Of Business</label>
          <input type="text" name="typeOfBusiness" value={busassessmentData.typeOfBusiness} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Business Registration Number</label>
          <input type="text" name="businessRegistrationNumber" value={busassessmentData.businessRegistrationNumber} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>PAN of Businessr</label>
          <input type="text" name="panOfBusiness" value={busassessmentData.panOfBusiness} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>GSTIN</label>
          <input type="text" name="gstin" value={busassessmentData.gstin} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Contact Person Name</label>
          <input type="text" name="contactPersonName" value={busassessmentData.contactPersonName} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Notes</label>
          <textarea type="text"
           name="notes" 
           value={busassessmentData.notes} 
           onChange={handleChange} 
           required 
           readOnly={user && user.userType !== 'admin'}/>
        </div>
        <div>
          <label>Assessment Year</label>
          <select name="assessmentYear" value={busassessmentData.assessmentYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            {/* Add more years as needed */}
          </select>
        </div>
        <div>
          <label>Upload Document</label>
          <input type="file" name="document" onChange={handleChange} />
        </div>
        {user&& user.userType === 'admin' && (
        <div>
          <label>Assigned To</label>
          <select name="assignedTo" value={busassessmentData.assignedTo} onChange={handleChange} required>
            <option value="">Select Assignee</option>
            {auditUsers.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
        )}
        {user&& user.userType === 'audituser' && (
        <div>
          <label>Status</label>
          <select name="status" value={busassessmentData.status} onChange={handleChange} required>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        )}
        {user && user.userType === 'audituser' && (
        <div>
          <label>Comments: </label>
          <textarea
            name="comments"
            value={busassessmentData.comments}
            onChange={handleChange}
            required
          />
        </div>
        )}

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default BusinessUpdateTaxAssessment;
