import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Phone, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import "../css/customer_list.css";

const CustomerListForNotice = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/customers');
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const firstName = customer.assesseefirstName?.toLowerCase() || '';
    const lastName = customer.assesseelastName?.toLowerCase() || '';
    const phone = customer.phoneNumber || '';
    return firstName.includes(searchTerm.toLowerCase()) ||
           lastName.includes(searchTerm.toLowerCase()) ||
           phone.includes(searchTerm);
  });

  const handleCustomerSelect = (id) => {
    navigate(`/create-it-notice/${id}`);
  };

  return (
    <div className="customer-view-page fade-in">
      <div className="view-page-header">
        <div className="header-meta">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1>Select Client for IT Notice</h1>
          <p>Search and select an individual client profile from the directory to assign a notice task.</p>
        </div>
      </div>

      <div className="search-filter-card glass-card">
        <div className="search-wrapper-custom">
          <Search className="search-box-icon" size={18} />
          <input
            type="text"
            placeholder="Search by client name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="list-loading-placeholder">
          <p>Loading directory...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="no-records-card glass-card">
          <AlertCircle size={40} className="no-records-icon" />
          <h3>No Clients Found</h3>
          <p>Register the client first before creating an IT notice.</p>
        </div>
      ) : (
        <div className="custom-table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Assessee Name</th>
                <th>Phone Number</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} style={{ cursor: 'pointer' }} onClick={() => handleCustomerSelect(customer.id)}>
                  <td>
                    <div className="table-client-name-cell">
                      <div className="client-avatar-cell">
                        <User size={14} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{customer.assesseefirstName} {customer.assesseelastName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-phone-cell">
                      <Phone size={14} />
                      <span>{customer.phoneNumber || 'N/A'}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="table-action-link view-profile-link btn" style={{ padding: '0.4rem 0.85rem' }}>
                      <span>Select Client</span>
                      <CheckCircle size={13} style={{ color: 'var(--accent-green)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerListForNotice;
