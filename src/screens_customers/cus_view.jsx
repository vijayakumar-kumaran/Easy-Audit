import API_BASE_URL from '../config';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../AuthContext';
import "../css/customer_list.css";

const CustomerList = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);
  console.log(customers)
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.assesseefirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.assesseelastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="customer-view-page">
      <h1>Customer List</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiSearch size={36} />
          </div>
          <h3>No Customers Found</h3>
          <p>
            {searchTerm
              ? "We couldn't find any customers matching your search criteria. Try a different name or phone number."
              : "There are no individual clients registered in your system yet."}
          </p>
          {user && user.userType === 'admin' && (
            <Link to="/customer-signup" className="empty-state-btn">
              <FiUserPlus /> Register New Customer
            </Link>
          )}
        </div>
      ) : (
        <ul className="customer-list">
          {filteredCustomers.map((customer) => {
            const avatar = customer.avatar || customer.profileImage || customer.photo;

            return (
              <li key={customer.id} className="customer-list-item">
                <Link
                  to={`/customer/${customer.id}`}
                  className="customer-card"
                >
                  <div className="customer-left">
                    <div className="customer-avatar">
                      {avatar ? (
                        <img
                          src={`${customer.avatar}`}
                          alt={`${customer.assesseefirstName} ${customer.assesseelastName}`}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {customer.assesseefirstName?.charAt(0).toUpperCase()}
                          {customer.assesseelastName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="customer-details">
                      <h3>
                        {customer.assesseefirstName} {customer.assesseelastName}
                      </h3>

                      <p>{customer.phoneNumber}</p>
                    </div>
                  </div>

                  <button
                    className="customer-btn"
                    onClick={(e) => e.preventDefault()}
                  >
                    View Profile
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomerList;
