import API_BASE_URL from '../config';
// src/components/ListTaxAssessments.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../css/cus_list_tax_asses.css'
import { useAuth } from "../AuthContext";

const ListTaxAssessments = () => {
  const [taxAssessments, setTaxAssessments] = useState([]);
  const {user} = useAuth();

  useEffect(() => {
    if(user){
    const fetchTaxAssessments = async () => {
      try {
        let response
        if (user.userType === 'audituser'){
          response = await axios.get(`${API_BASE_URL}/customer-tax-assessments`, {
            params: {username:user.username}
          });
        } else if (user.userType === 'admin'){
          response = await axios.get(`${API_BASE_URL}/customer-tax-assessments-all`)
        }
        
        setTaxAssessments(response.data);
      } catch (error) {
        console.error("Error fetching tax assessments:", error);
      }
    };

    fetchTaxAssessments();
  }
  }, [user]);

  return (
    <div className="list-tax-assessments-page">
      <h2>Tax Assessments</h2>
      <table>
        <thead>
          <tr>
            <th>Assessee Type</th>
            <th>Name</th>
            <th>Assessment Year</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxAssessments.map((assessment) => (
            <tr key={assessment.id}>
              <td>{assessment.assesseeType}</td>
              <td>{assessment.assesseName}</td>
              <td>{assessment.assessmentYear}</td>
              <td>{assessment.assignedTo}</td>
              <td>{assessment.status}</td>
              <td>
                <Link to={`/update-tax-assessment/${assessment.id}`}>{user && user.userType === 'audituser' ? "Start" : "Edit" }</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListTaxAssessments;
