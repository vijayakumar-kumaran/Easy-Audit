import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateBusItNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [business, setBusiness] = useState({});
  const [noticeTypes, setNoticeTypes] = useState([]);
  const [noticeType, setNoticeType] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [auditUsers, setAuditUsers] = useState([]);

  
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/business_list/${id}`);
        setBusiness(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    const fetchNoticeTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bus-notice-types`);
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
    fetchBusinessData();
    fetchNoticeTypes();
  }, [id]);

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

    const formData = new FormData();
    formData.append('businessID', id);
    formData.append('assesseeType', business.assesseeType || '');
    formData.append('businessName', business.businessName || '');
    formData.append('businessOwnerName', business.businessOwnerName || '');
    formData.append('typeOfBusiness', business.typeOfBusiness || '');
    formData.append('contactPersonName', business.contactPersonName || '');
    formData.append('noticeType', noticeType);
    formData.append('noticeDescription', noticeDescription);
    formData.append('document', document);
    formData.append('dueDate', dueDate);
    formData.append('assignedTo', assignedTo);
    formData.append('status', "pending");
    formData.append('notes', business.notes)

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await axios.post(`${API_BASE_URL}/bus-it-notices`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('IT Notice created successfully');
      navigate('/business-list-for-notice');
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
          <input type="text" value={business.assesseeType || ''} readOnly />
        </div>
        <div>
          <label>Business Name: </label>
          <input type="text" value={business.businessName || ''} readOnly />
        </div>
        <div>
          <label>Business Owner Name: </label>
          <input type="text" value={business.businessOwnerName || ''} readOnly />
        </div>
        <div>
          <label>Type of Business: </label>
          <input type="text" value={business.typeOfBusiness || ''} readOnly />
        </div>
        <div>
          <label>Contact Person Name: </label>
          <input type="text" value={business.contactPersonName || ''} readOnly />
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
          <select name="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required >
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
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateBusItNotice;
