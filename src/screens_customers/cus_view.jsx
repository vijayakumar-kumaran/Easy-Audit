import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, User, Phone, ArrowLeft, ArrowUpRight, Plus, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "../css/customer_list.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

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

  const filteredCustomers = customers.filter(customer => {
    const firstName = customer.assesseefirstName?.toLowerCase() || '';
    const lastName = customer.assesseelastName?.toLowerCase() || '';
    const phone = customer.phoneNumber || '';
    return firstName.includes(searchTerm.toLowerCase()) ||
           lastName.includes(searchTerm.toLowerCase()) ||
           phone.includes(searchTerm);
  });

  return (
    <div className="customer-view-page fade-in">
      <div className="view-page-header">
        <div className="header-meta">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1>Individual Clients Directory</h1>
          <p>Search profiles, update records, and view workflow status.</p>
        </div>
        {user && user.userType === 'admin' && (
          <Link to="/customer-signup" className="register-client-btn btn-primary">
            <Plus size={16} />
            <span>Register Individual</span>
          </Link>
        )}
      </div>

      <div className="search-filter-card glass-card">
        <div className="search-wrapper-custom">
          <Search className="search-box-icon" size={18} />
          <input
            type="text"
            placeholder="Search clients by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="list-loading-placeholder">
          <p>Fetching individual clients...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="no-records-card glass-card">
          <AlertCircle size={40} className="no-records-icon" />
          <h3>No Clients Found</h3>
          <p>Try searching using a different name or phone number, or register a new individual client.</p>
        </div>
      ) : (
        <div className="custom-table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Phone Number</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <motion.tr 
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td>
                    <div className="table-client-name-cell">
                      <div className="client-avatar-cell">
                        <User size={14} />
                      </div>
                      <span>{customer.assesseefirstName} {customer.assesseelastName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-phone-cell">
                      <Phone size={14} />
                      <span>{customer.phoneNumber || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <Link to={`/customer/${customer.id}`} className="table-action-link view-profile-link">
                        <span>Profile</span>
                        <ArrowUpRight size={14} />
                      </Link>
                      {user && user.userType === 'admin' && (
                        <>
                          <Link to={`/create-tax-assessment/${customer.id}`} className="table-action-link tax-action-link">
                            <Calendar size={13} />
                            <span>Add Tax</span>
                          </Link>
                          <Link to={`/create-it-notice/${customer.id}`} className="table-action-link notice-action-link">
                            <AlertCircle size={13} />
                            <span>Add Notice</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
