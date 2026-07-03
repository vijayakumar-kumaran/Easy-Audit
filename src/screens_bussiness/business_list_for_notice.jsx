import API_BASE_URL from '../config';
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/customer_list.css";

const BusinessListForNotice = () => {
  const [business, setBusiness] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business_list`);
      setBusiness(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const filteredBusiness = business.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.businessOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.contactPhoneNumber.includes(searchTerm)
  );

  const handleBusinessSelect = (id) => {
    navigate(`/create-bus-it-notice/${id}`);
  };

  return (
    <div className="customer-view-page">
      <h1>Select a Customer</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="customer-list">
        {filteredBusiness.map(business => (
          <li key={business.id} className="customer-list-item" onClick={() => handleBusinessSelect(business.id)}>
            <div>
              <span>{business.businessName} {business.businessOwnerName}</span>
              <span>{business.contactPhoneNumber}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessListForNotice;
