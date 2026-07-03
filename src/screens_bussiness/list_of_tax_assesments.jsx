import API_BASE_URL from '../config';
// src/components/ListTaxAssessments.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../css/cus_list_tax_asses.css'
import { useAuth } from "../AuthContext";

const BusinessListOfTaxAssessments = () => {
  const [businesstaxAssessments, setBusinessTaxAssessments] = useState([]);
  const { user} = useAuth();

  useEffect(() => {
    if (user) {
    const fetchBusinessTaxAssessments = async () => {
      try {
        let response
        if(user.userType === 'audituser') {
          response = await axios.get(`${API_BASE_URL}/list-of-tax-assessments`, {
            params: {username:user.username}
          });
        } else if (user.userType === 'admin') {
          response = await axios.get(`${API_BASE_URL}/list-of-tax-assessments-all`)
        }
        setBusinessTaxAssessments(response.data);
      } catch (error) {
        console.error("Error fetching tax assessments:", error);
      }
    };

    fetchBusinessTaxAssessments();
  }
  }, [user]);

  return (
    <div className="list-tax-assessments-page">
      <h2>Tax Assessments</h2>
      <table>
        <thead>
          <tr>
            <th>Assessee Type</th>
            <th>Business Name</th>
            <th>Assessment Year</th>
            {user && user.userType === "admin" && (
              <th>Assigned To</th>
            )}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {businesstaxAssessments.map((bassessment) => (
            <tr key={bassessment.id}>
              <td>{bassessment.assesseeType}</td>
              <td>{bassessment.businessName}</td>
              <td>{bassessment.assessmentYear}</td>
              {user && user.userType === "admin" && (
                <td>{bassessment.assignedTo}</td>
              )}
              <td>{bassessment.status}</td>
              <td>
                <Link to={`/update-bus-tax-assessment/${bassessment.id}`}>{user&& user.userType === "audituser" ? "Start": "Edit"}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessListOfTaxAssessments;
