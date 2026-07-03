import API_BASE_URL from '../config';
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/create_tax_assessment.css";

const CreateTaxAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [auditUsers, setAuditUsers] = useState([]);
  const [assessmentData, setAssessmentData] = useState({
    assessmentYear: '',
    notes: '',
    document: null,
    assignedTo: ''
  });

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
    }
  }, [id]);

  const fetchAuditUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit-users`);
      setAuditUsers(response.data);
    } catch (error) {
      console.error("Error fetching audit users:", error);
    }
  }, []);

  useEffect(() => {
    fetchCustomer();
    fetchAuditUsers();
  }, [fetchCustomer, fetchAuditUsers]);

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
      formData.append('customerId', id);
      formData.append('assesseeType', customer.assesseeType);
      formData.append('assesseName', `${customer.assesseefirstName} ${customer.assesseelastName}`);
      formData.append('fatherName', customer.fatherHusbandName);
      formData.append('dob', `${customer.day}/${customer.month}/${customer.year}`);
      formData.append('panNumber', customer.panNumber);
      formData.append('adharNumber', customer.aadharNumber);
      formData.append('phoneNumber', customer.phoneNumber);
      formData.append('assessmentYear', assessmentData.assessmentYear);
      formData.append('notes', assessmentData.notes);
      formData.append('document', assessmentData.document);
      formData.append('assignedTo', assessmentData.assignedTo);
      formData.append('status', 'pending');

      await axios.post(`${API_BASE_URL}/customer-tax-assessments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Tax assessment created successfully');
      navigate('/customers');
    } catch (error) {
      console.error("Error creating tax assessment:", error);
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="create-tax-assessment-page">
      <h2>Create Tax Assessment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assessee Type</label>
          <input type="text" value={customer.assesseeType} readOnly />
        </div>
        <div>
          <label>Assessee Name</label>
          <input type="text" value={`${customer.assesseefirstName} ${customer.assesseelastName}`} readOnly />
        </div>
        <div>
          <label>Father Name</label>
          <input type="text" value={customer.fatherHusbandName} readOnly />
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="text" value={`${customer.day}/${customer.month}/${customer.year}`} readOnly />
        </div>
        <div>
          <label>PAN Card Number</label>
          <input type="text" value={customer.panNumber} readOnly />
        </div>
        <div>
          <label>Aadhar Number</label>
          <input type="text" value={customer.aadharNumber} readOnly />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="text" value={customer.phoneNumber} readOnly />
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
          <label>Notes</label>
          <input type="text" name="notes" value={assessmentData.notes} onChange={handleChange} required />
        </div>
        <div>
          <label>Upload Document</label>
          <input type="file" name="document" onChange={handleChange} required />
        </div>
        <div>
          <label>Assigned To</label>
          <select name="assignedTo" value={assessmentData.assignedTo} onChange={handleChange} required>
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

export default CreateTaxAssessment;
