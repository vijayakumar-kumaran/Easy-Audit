import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const UpdateBusITNotice = () => {
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
  const {user} = useAuth();
  const [auditUsers, setAuditUsers] = useState([]);
  
  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bus-it-notice/${id}`);
        setNotice(response.data);
        setNoticeType(response.data.noticeType);
        setNoticeDescription(response.data.noticeDescription);
        setDocument(null);
        setDueDate(response.data.dueDate.split('T')[0]);
        setAssignedTo(response.data.assignedTo);
        setStatus(response.data.status);
        setComments(response.data.comments);
        setNotes(response.data.notes);

      } catch (error) {
        console.error("Error fetching notice data:", error);
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

    const formData = new FormData();
    // Exisiting feild with Read only
    formData.append('businessID', notice.businessID);
    formData.append('assesseeType', notice.assesseeType || '');
    formData.append('businessName', notice.businessName || '');
    formData.append('businessOwnerName', notice.businessOwnerName || '');
    formData.append('typeOfBusiness', notice.typeOfBusiness || '');
    formData.append('contactPersonName', notice.contactPersonName || '');
    formData.append('notes', notice.notes || '');
    // Entry feilds 
    formData.append('noticeType', noticeType);
    formData.append('noticeDescription', noticeDescription);
    if (document) {
      formData.append('document', document);
    }
    formData.append('dueDate', new Date(dueDate).toISOString().split('T')[0]); // Ensure correct format
    formData.append('assignedTo', assignedTo);
    formData.append('status', status);
    formData.append('comments', comments)

    // Update to finish
    try {
      await axios.put(`${API_BASE_URL}/business-it-notices/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('IT Notice updated successfully');
      navigate('/busITNoticeList');
    } catch (error) {
      console.error("Error updating IT Notice:", error);
    }
  };

  return (
    <div>
      <h1>Update IT Notice</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Assessee Type: </label>
          <input type="text" value={notice.assesseeType || ''} readOnly />
        </div>
        <div>
          <label>Business Name: </label>
          <input type="text" value={notice.businessName || ''} readOnly />
        </div>
        <div>
          <label>Business Owner Name: </label>
          <input type="text" value={notice.businessOwnerName || ''} readOnly />
        </div>
        <div>
          <label>Type Of Business: </label>
          <input type="text" value={notice.typeOfBusiness || ''} readOnly />
        </div>
        <div>
          <label>Contact Person Name: </label>
          <input type="text" value={notice.contactPersonName || ''} readOnly />
        </div>
        <div>
          <label>Notice Type: </label>
          <select value={noticeType} onChange={handleNoticeTypeChange}>
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
          <textarea value={noticeDescription} onChange={(e) => setNoticeDescription(e.target.value)} />
        </div>
        <div>
          <label>Notes: </label>
          <textarea 
          name='notes'
          value={notes || ''} 
          onChange={(e) => setNotes(e.target.value)}
          readOnly={user && user.userType !== 'admin'} />
        </div>

        <div>
          <label>Upload Document: </label>
          <input type="file" onChange={handleDocumentUpload} />
        </div>
        <div>
          <label>Due Date: </label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        {user&& user.userType === 'admin' && (
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
        )}
        {user&& user.userType === 'audituser' && (
        <div>
          <label>Status: </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="" disabled>Select</option>
            <option value="pending">Pending</option>
            <option value="inprogress">Inprogress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        )}
        {user && user.userType === 'audituser' && (
        <div>
          <label>Comments: </label>
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
        </div>
        )}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateBusITNotice;
