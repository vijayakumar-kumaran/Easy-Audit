import API_BASE_URL from '../config';
// src/components/UpdateTaxAssessment.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";

const UpdateTaxAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();
  const [auditUsers, setAuditUsers] = useState([]);
  const [assessmentData, setAssessmentData] = useState({
    customerId: '',
    assesseeType: '',
    assesseName: '',
    fatherName: '',
    dob: '',
    panNumber: '',
    adharNumber: '',
    phoneNumber: '',
    assessmentYear: '',
    notes: '',
    document: null,
    assignedTo: '',
    status: '',
    comments: ''
  });

  const fetchAuditUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit-users`);
      setAuditUsers(response.data);
    } catch (error) {
      console.error("Error fetching audit users:", error);
    }
  }, []);

  const fetchAssessment = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer-tax-assessments/${id}`);
      setAssessmentData(response.data);
    } catch (error) {
      console.error("Error fetching tax assessment:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAuditUsers();
    fetchAssessment();
  }, [user, fetchAuditUsers, fetchAssessment]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setAssessmentData({ ...assessmentData, [name]: files[0] });
    } else {
      setAssessmentData({ ...assessmentData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('customerId', assessmentData.customerId);
      formData.append('assesseeType', assessmentData.assesseeType);
      formData.append('assesseName', assessmentData.assesseName);
      formData.append('fatherName', assessmentData.fatherName);
      formData.append('dob', assessmentData.dob);
      formData.append('panNumber', assessmentData.panNumber);
      formData.append('adharNumber', assessmentData.adharNumber);
      formData.append('phoneNumber', assessmentData.phoneNumber);
      formData.append('assessmentYear', assessmentData.assessmentYear);
      formData.append('notes', assessmentData.notes);
      formData.append('document', assessmentData.document);
      formData.append('assignedTo', assessmentData.assignedTo);
      formData.append('status', assessmentData.status);
      formData.append('comments', assessmentData.comments);

      await axios.put(`${API_BASE_URL}/customer-tax-assessments/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Tax assessment updated successfully');
      navigate('/update-assessments');
    } catch (error) {
      console.error("Error updating tax assessment:", error);
    }
  };

  if (!assessmentData.customerId) return <div>Loading...</div>;

  return (
    <div className="update-tax-assessment-page">
      <h2>Update Tax Assessment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assessee Type</label>
          <input type="text" name="assesseeType" value={assessmentData.assesseeType} onChange={handleChange} required readOnly />
        </div>
        <div>
          <label>Assessee Name</label>
          <input type="text" name="assesseName" value={assessmentData.assesseName} onChange={handleChange} required readOnly />
        </div>
        <div>
          <label>Father Name</label>
          <input type="text" name="fatherName" value={assessmentData.fatherName} onChange={handleChange} required  readOnly/>
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="text" name="dob" value={assessmentData.dob} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>PAN Card Number</label>
          <input type="text" name="panNumber" value={assessmentData.panNumber} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Aadhar Number</label>
          <input type="text" name="adharNumber" value={assessmentData.adharNumber} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Phone Number</label>
          <textarea type="text" name="phoneNumber" value={assessmentData.phoneNumber} onChange={handleChange} required readOnly/>
        </div>
        <div>
          <label>Notes</label>
          <textarea 
          type="text" 
          name="notes" 
          value={assessmentData.notes} 
          onChange={handleChange} 
          required  
          readOnly={user && user.userType !== 'admin'}/>
        </div>
        <div>
          <label>Assessment Year</label>
          <select name="assessmentYear" value={assessmentData.assessmentYear} onChange={handleChange} required>
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
        {user && user.userType === 'audituser' && (
          <div>
            <label>Status</label>
            <select name="status" value={assessmentData.status} onChange={handleChange} required>
              <option value="" disabled>-Set Status-</option>
              <option value="pending">pending</option>
              <option value="inprogress">in-progress</option>
              <option value="completed">completed</option>
            </select>
          </div>
        )}
        {user && user.userType === 'admin' && (
          <div>
            <label>Assigned To</label>
            <select name="assignedTo" value={assessmentData.assignedTo} onChange={handleChange} required>
            <option value="">Select Assignee</option>
            {auditUsers.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          </div>
        )}
        {user && user.userType === 'audituser' && (
        <div>
          <label>Comments: </label>
          <textarea
            name="comments"
            value={assessmentData.comments}
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

export default UpdateTaxAssessment;
