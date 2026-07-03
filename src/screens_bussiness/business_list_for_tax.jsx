import API_BASE_URL from '../config';
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/customer_list.css";

const BusinessListforTax = () => {
  const [business, setBusiness] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business_list`);
      setBusiness(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  }, []);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  const filteredBusinesses = business.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.businessOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.contactPhoneNumber.includes(searchTerm)
  );

  const handleBusinessSelect = (id) => {
    navigate(`/create-tax-business/${id}`);
  };

  return (
    <div className="Customer-view-page">
      <h1>Select a Business</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className="customer-list">
        {filteredBusinesses.map(businesslist => (
          <li key={businesslist.id} className="customer-list-item" onClick={() => handleBusinessSelect(businesslist.id)}>
            <div>
              <span>{businesslist.businessName} {business.businessOwnerName}</span>
              <span>{businesslist.contactPhoneNumber}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessListforTax;
