import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const EditITNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState({});
  const [noticeTypes, setNoticeTypes] = useState([]);
  const [noticeType, setNoticeType] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [document, setDocument] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [comments, setComments] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useAuth();
  const [auditUsers, setAuditUsers] = useState([]);

  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/customer-it-notices/${id}`);
        setNotice(response.data);
        setNoticeType(response.data.noticeType);
        setNoticeDescription(response.data.noticeDescription);
        setDocument(null);
        setDueDate(response.data.dueDate.split('T')[0]);
        setAssignedTo(response.data.assignedTo);
        setStatus(response.data.status);
        setComments(response.data.comments);
        setNotes(response.data.notes)
      } catch (error) {
        console.error("Error fetching notice data:", error);
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

    const fetchNoticeTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/notice-types`);
        setNoticeTypes(response.data);
      } catch (error) {
        console.error("Error fetching notice types:", error);
      }
    };

    fetchAuditUsers();
    fetchNoticeData();
    fetchNoticeTypes();
  }, [user, id]);

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

    console.log('Form Submitted');
    console.log('Current Status:', status);

    // Check if status is completed and handle accordingly
    if (status === 'completed' && user && user.userType === 'admin') {
      alert('The task is completed and cannot be edited.');
      return; // Prevent form submission
    }

    const formData = new FormData();
    formData.append('customerId', notice.customerId);
    formData.append('assesseeType', notice.assesseeType || '');
    formData.append('assesseeName', notice.assesseeName || '');
    formData.append('fatherName', notice.fatherName || '');
    formData.append('dob', new Date(notice.dob).toISOString().split('T')[0]); // Ensure correct format
    formData.append('panNumber', notice.panNumber || '');
    formData.append('adharNumber', notice.adharNumber || '');
    formData.append('phoneNumber', notice.phoneNumber || '');
    formData.append('notes', notice.notes || '');
    formData.append('noticeType', noticeType);
    formData.append('noticeDescription', noticeDescription);
    if (document) {
      formData.append('document', document);
    }
    formData.append('dueDate', new Date(dueDate).toISOString().split('T')[0]); // Ensure correct format
    formData.append('assignedTo', assignedTo);
    formData.append('status', status);
    formData.append('comments', comments)

    try {
      await axios.put(`${API_BASE_URL}/customer-it-notices/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('IT Notice updated successfully');
      if (user && user.userType === 'audituser') {
        navigate('/notice-list');
      } else {
        navigate('/customers-notice');
      }
    } catch (error) {
      console.error("Error updating IT Notice:", error);
    }
  };

  return (
    <div>
      <h1>Edit IT Notice</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assessee Type: </label>
          <input type="text" value={notice.assesseeType || ''} readOnly />
        </div>
        <div>
          <label>Assessee Name: </label>
          <input type="text" value={notice.assesseeName || ''} readOnly />
        </div>
        <div>
          <label>Father's Name: </label>
          <input type="text" value={notice.fatherName || ''} readOnly />
        </div>
        <div>
          <label>Date of Birth: </label>
          <input type="text" value={notice.dob || ''} readOnly />
        </div>
        <div>
          <label>PAN Number: </label>
          <input type="text" value={notice.panNumber || ''} readOnly />
        </div>
        <div>
          <label>Aadhar Number: </label>
          <input type="text" value={notice.adharNumber || ''} readOnly />
        </div>
        <div>
          <label>Phone Number: </label>
          <input type="text" value={notice.phoneNumber || ''} readOnly />
        </div>
        <div>
          <label>Notes: </label>
          <textarea 
          name='notes'
          type="text" 
          value={notes || ''} 
          onChange={(e) => setNotes(e.target.value)}
          readOnly={user && user.userType !== 'admin'} 
          />
        </div>
        <div>
          <label>Notice Type: </label>
          <select value={noticeType} onChange={handleNoticeTypeChange} disabled={status === 'completed'}>
            <option value="" disabled>Select a notice type</option>
            {noticeTypes.map((noticeType) => (
              <option key={noticeType.item_id} value={noticeType.noticetype}>
                {noticeType.noticetype}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Notice Description: </label>
          <textarea value={noticeDescription} onChange={(e) => setNoticeDescription(e.target.value)} disabled={status === 'completed'} />
        </div>
        <div>
          <label>Upload Document: </label>
          <input type="file" onChange={handleDocumentUpload} disabled={status === 'completed'} />
        </div>
        <div>
          <label>Due Date: </label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={status === 'completed'} />
        </div>
        <div>
          <label>Assigned To: </label>
          <select
            name="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
            <option value="">Select Assignee</option>
            {auditUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        {user && user.userType === 'audituser' && (
          <div>
            <label>Status: </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={status === 'completed'}>
              <option value="" disabled>-Select status-</option>
              <option value="pending">pending</option>
              <option value="inprogress">inprogress</option>
              <option value="completed">completed</option>
            </select>
          </div>
        )}
        {user&& user.userType === 'audituser' && (
        <div>
          <label>Comments: </label>
          <textarea
          name='comments'
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
          />
        </div>
        )}
        <button type="submit" disabled={status === 'completed'}>Update</button>
      </form>
    </div>
  );
};

export default EditITNotice;
