import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateITNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [customer, setCustomer] = useState({});
  const [noticeTypes, setNoticeTypes] = useState([]);
  const [noticeType, setNoticeType] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState();
  const [auditUsers, setAuditUsers] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
        setCustomer(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    const fetchNoticeTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notice-types`);
        setNoticeTypes(response.data);
      } catch (error) {
        console.error("Error fetching notice types:", error);
      }
    };
    const fetchAuditUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/audit-users`);
        setAuditUsers(response.data);
      } catch (error) {
        console.error("Error fetching audit users:", error);
      }
    };
    fetchAuditUsers();
    fetchCustomerData();
    fetchNoticeTypes();
  }, [id]);

  const formatDate = (dateStr) => {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleNoticeTypeChange = (e) => {
    const selectedType = e.target.value;
    setNoticeType(selectedType);

    const selectedNotice = noticeTypes.find(notice => notice.noticetype === selectedType);
    if (selectedNotice) {
      setNoticeDescription(selectedNotice.noticedescription);
    }
  };

  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDob = formatDate(`${customer.month || ''}/${customer.day || ''}/${customer.year || ''}`);

    const formData = new FormData();
    formData.append('customerId', id);
    formData.append('assesseeType', customer.assesseeType || '');
    formData.append('assesseeName', `${customer.assesseefirstName || ''} ${customer.assesseelastName || ''}`);
    formData.append('fatherName', customer.fatherHusbandName || '');
    formData.append('dob', formattedDob);
    formData.append('panNumber', customer.panNumber || '');
    formData.append('adharNumber', customer.aadharNumber || '');
    formData.append('phoneNumber', customer.phoneNumber || '');
    formData.append('noticeType', noticeType);
    formData.append('noticeDescription', noticeDescription);
    formData.append('document', document);
    formData.append('dueDate', dueDate);
    formData.append('assignedTo', assignedTo);
    formData.append('status', 'pending');
    formData.append('notes', notes);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await axios.post(`${API_BASE_URL}/customer-it-notices`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('IT Notice created successfully');
      navigate('/customers-notice');
    } catch (error) {
      console.error("Error creating IT Notice:", error);
    }
  };

  return (
    <div>
      <h1>Create IT Notice</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assessee Type: </label>
          <input type="text" value={customer.assesseeType || ''} readOnly />
        </div>
        <div>
          <label>Assessee Name: </label>
          <input type="text" value={`${customer.assesseefirstName || ''} ${customer.assesseelastName || ''}`} readOnly />
        </div>
        <div>
          <label>Father's Name: </label>
          <input type="text" value={customer.fatherHusbandName || ''} readOnly />
        </div>
        <div>
          <label>Date of Birth: </label>
          <input type="text" value={`${customer.day || ''}/${customer.month || ''}/${customer.year || ''}`} readOnly />
        </div>
        <div>
          <label>PAN Number: </label>
          <input type="text" value={customer.panNumber || ''} readOnly />
        </div>
        <div>
          <label>Aadhar Number: </label>
          <input type="text" value={customer.aadharNumber || ''} readOnly />
        </div>
        <div>
          <label>Phone Number: </label>
          <input type="text" value={customer.phoneNumber || ''} readOnly />
        </div>
        

        <div>
          <label>Notice Type: </label>
          <select value={noticeType} onChange={handleNoticeTypeChange}>
            <option value="" disabled>Select a notice type</option>
            {noticeTypes.map(notice => (
              <option key={notice.item_id} value={notice.noticetype}>
                {notice.noticetype} - {notice.noticedescription}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Notice Description: </label>
          <textarea value={noticeDescription} readOnly />
        </div>
        <div>
          <label>Upload Document: </label>
          <input type="file" onChange={handleDocumentUpload} />
        </div>
        <div>
          <label>Due Date: </label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <label>Assigned To: </label>
          <select
            name="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          >
            <option value="">Select Assignee</option>
            {auditUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Notes: </label>
          <input type="text" value={customer.notes} onChange={(e) => setNotes(e.target.value)} required />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateITNotice;
