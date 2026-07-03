import API_BASE_URL from '../config';
// src/components/ITNoticeList.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/cus_list_tax_asses.css';
import { useAuth } from '../AuthContext';

const ITNoticeList = () => {
  const [notices, setNotices] = useState([]);
  const {user} = useAuth();

  useEffect(() => {
    if(user){
    const fetchNotices = async () => {
      try {
        let response
        if(user.userType === 'audituser'){
          response = await axios.get(`${API_BASE_URL}/it-notices`, {
            params: {username: user.username}
          });
        } else if (user.userType === 'admin') {
          response = await axios.get(`${API_BASE_URL}/it-notices-all`)
        }

        console.log('Fetched IT notices:', response.data); // Log the data
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching IT notices:', error);
      }
    };

    fetchNotices();
  }
  }, [user]);

  return (
    <div className="list-it-notices-page">
      <h2>IT Notices</h2>
      <table>
        <thead>
          <tr>
            <th>Notice Type</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th>Assess Name</th>
            <th>Type</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notices.map(notice => (
            <tr key={notice.id}>
              <td>{notice.noticeType || 'N/A'}</td>
              <td>{new Date(notice.dueDate).toLocaleDateString() || 'N/A'}</td>
              <td>{notice.assignedTo || 'N/A'}</td>
              <td>{notice.assesseeName || 'N/A'}</td>
              <td>{notice.assesseeType || 'N/A'}</td>
              <td>{notice.phoneNumber || 'N/A'}</td>
              <td>{notice.status}</td>
              <td>
                <Link to={`/edit-it-notice/${notice.id}`}>
                  {user && user.userType === 'audituser' ? 'Start': 'Edit'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ITNoticeList;
