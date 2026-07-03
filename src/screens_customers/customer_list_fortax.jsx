import API_BASE_URL from '../config';
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/customer_list.css";

const CustomerListforTax = () => {
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
    navigate(`/create-tax-assessment/${id}`);
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
  {filteredCustomers.map((customer) => (
    <li
      key={customer.id}
      className="customer-list-item"
      onClick={() => handleCustomerSelect(customer.id)}
    >
      <div className="customer-card">

        <div className="customer-left">
          <div className="customer-avatar">
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocI9C_TbuWeWAhkDQG8eDnXF0q-LaXoDWVIXiWnuCHDloCsI_Z0=s288-c-no"
              alt="Avatar"
            />
          </div>

          <div className="customer-details">
            <h3>
              {customer.assesseefirstName} {customer.assesseelastName}
            </h3>

            <p>
              <strong>Aadhar:</strong> {customer.aadharNumber}
            </p>

            <p>
              <strong>Phone:</strong> {customer.phoneNumber}
            </p>
          </div>
        </div>

      </div>
        <button
          className="customer-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleCustomerSelect(customer.id);
          }}
        >
          Proceed →
        </button>
    </li>
  ))}
</ul>
    </div>
  );
};

export default CustomerListforTax;
