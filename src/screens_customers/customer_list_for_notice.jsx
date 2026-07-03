import API_BASE_URL from '../config';
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/customer_list.css";

const CustomerListForNotice = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = customers.filter(customer =>
    customer.assesseefirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.assesseelastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  );

  const handleCustomerSelect = (id) => {
    navigate(`/create-it-notice/${id}`);
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
        {filteredCustomers.map(customer => (
          <li key={customer.id} className="customer-list-item" onClick={() => handleCustomerSelect(customer.id)}>
            <div>
              <span>{customer.assesseefirstName} {customer.assesseelastName}</span>
              <span>{customer.phoneNumber}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerListForNotice;
