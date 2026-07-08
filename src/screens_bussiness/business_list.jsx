import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Building2, Phone, ArrowLeft, ArrowUpRight, Plus, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "../css/customer_list.css"; // Reuses directory table & search styles

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get('/api/business_list');
      setBusinesses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const businessName = business.businessName?.toLowerCase() || '';
    const ownerName = business.businessOwnerName?.toLowerCase() || '';
    const phone = business.contactPhoneNumber || '';
    return businessName.includes(searchTerm.toLowerCase()) ||
           ownerName.includes(searchTerm.toLowerCase()) ||
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
          <h1>Business Clients Directory</h1>
          <p>Search company profiles, check registrations, and assign audits.</p>
        </div>
        {user && user.userType === 'admin' && (
          <Link to="/business-signup" className="register-client-btn btn-primary">
            <Plus size={16} />
            <span>Register Business</span>
          </Link>
        )}
      </div>

      <div className="search-filter-card glass-card">
        <div className="search-wrapper-custom">
          <Search className="search-box-icon" size={18} />
          <input
            type="text"
            placeholder="Search business name, owner or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="list-loading-placeholder">
          <p>Fetching business accounts...</p>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="no-records-card glass-card">
          <AlertCircle size={40} className="no-records-icon" />
          <h3>No Businesses Found</h3>
          <p>Try searching using a different name or register a new business client account.</p>
        </div>
      ) : (
        <div className="custom-table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company / Business Name</th>
                <th>Owner Name</th>
                <th>Phone Number</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((business, index) => (
                <motion.tr 
                  key={business.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td>
                    <div className="table-client-name-cell">
                      <div className="client-avatar-cell" style={{ background: 'var(--accent-soft-gold)', color: 'var(--accent-gold)' }}>
                        <Building2 size={14} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{business.businessName}</span>
                    </div>
                  </td>
                  <td>
                    <span>{business.businessOwnerName || 'N/A'}</span>
                  </td>
                  <td>
                    <div className="table-phone-cell">
                      <Phone size={14} />
                      <span>{business.contactPhoneNumber || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <Link to={`/business-Details/${business.id}`} className="table-action-link view-profile-link">
                        <span>Profile</span>
                        <ArrowUpRight size={14} />
                      </Link>
                      {user && user.userType === 'admin' && (
                        <>
                          <Link to={`/create-tax-business/${business.id}`} className="table-action-link tax-action-link">
                            <Calendar size={13} />
                            <span>Add Tax</span>
                          </Link>
                          <Link to={`/create-bus-it-notice/${business.id}`} className="table-action-link notice-action-link">
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

export default BusinessList;
