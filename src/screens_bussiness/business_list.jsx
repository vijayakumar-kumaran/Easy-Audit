import API_BASE_URL from "../config";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../AuthContext";
import "../css/customer_list.css";

const BusinessList = () => {
  const { user } = useAuth();
  const [business, setBusiness] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business_list`);
      setBusiness(response.data);
    } catch (error) {
      console.error("Error fetching Business:", error);
    }
  };

  const filteredBusiness = business.filter(
    (biz) =>
      biz.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.businessOwnerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      biz.contactPhoneNumber?.includes(searchTerm)
  );

  return (
    <div className="customer-view-page">
      <h1>Business List</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by business name or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredBusiness.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiSearch size={36} />
          </div>

          <h3>No Businesses Found</h3>

          <p>
            {searchTerm
              ? "We couldn't find any business clients matching your search criteria. Try a different name or phone number."
              : "There are no business clients registered in your system yet."}
          </p>

          {user?.userType === "admin" && (
            <Link to="/business-signup" className="empty-state-btn">
              <FiUserPlus />
              Register Corporate Client
            </Link>
          )}
        </div>
      ) : (
        <ul className="customer-list">
          {filteredBusiness.map((biz) => {
            // Change these field names if your API uses a different one
            const avatar =
              biz.avatar ||
              biz.logo ||
              biz.businessLogo ||
              biz.profileImage;

            return (
              <li key={biz.id} className="customer-list-item">
                <Link
                  to={`/business-Details/${biz.id}`}
                  className="customer-card"
                >
                  <div className="customer-left">
                    <div className="customer-avatar">
                      {avatar ? (
                        <img
                          src={`${biz.avatar}`}
                          alt={biz.businessName}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {biz.businessName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="customer-details">
                      <h3>{biz.businessName}</h3>

                      <p>
                        <strong>Owner:</strong> {biz.businessOwnerName}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {biz.contactPhoneNumber || "N/A"}
                      </p>
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

export default BusinessList;