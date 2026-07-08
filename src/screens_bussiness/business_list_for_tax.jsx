import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Phone, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import "../css/customer_list.css";

const BusinessListforTax = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(business => {
    const businessName = business.businessName?.toLowerCase() || '';
    const ownerName = business.businessOwnerName?.toLowerCase() || '';
    const phone = business.contactPhoneNumber || '';
    return businessName.includes(searchTerm.toLowerCase()) ||
           ownerName.includes(searchTerm.toLowerCase()) ||
           phone.includes(searchTerm);
  });

  const handleBusinessSelect = (id) => {
    navigate(`/create-tax-business/${id}`);
  };

  return (
    <div className="customer-view-page fade-in">
      <div className="view-page-header">
        <div className="header-meta">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h1>Select Business for Tax Assessment</h1>
          <p>Search and select a business client profile from the directory to start a corporate tax audit.</p>
        </div>
      </div>

      <div className="search-filter-card glass-card">
        <div className="search-wrapper-custom">
          <Search className="search-box-icon" size={18} />
          <input
            type="text"
            placeholder="Search company name, owner or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="list-loading-placeholder">
          <p>Loading directory...</p>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="no-records-card glass-card">
          <AlertCircle size={40} className="no-records-icon" />
          <h3>No Businesses Found</h3>
          <p>Register the company first before creating a tax assessment.</p>
        </div>
      ) : (
        <div className="custom-table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company / Business Name</th>
                <th>Owner Name</th>
                <th>Phone Number</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map(business => (
                <tr key={business.id} style={{ cursor: 'pointer' }} onClick={() => handleBusinessSelect(business.id)}>
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
                  <td style={{ textAlign: 'right' }}>
                    <button className="table-action-link view-profile-link btn" style={{ padding: '0.4rem 0.85rem' }}>
                      <span>Select Business</span>
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

export default BusinessListforTax;
