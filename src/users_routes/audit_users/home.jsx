import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AuditHome = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const username = params.get('username');
 
  return (
    <div className="home-page">
      <h1>Welcome {username}</h1>
      <div className='categories'>
        <div className='category'>
          <h2>Individual</h2>
          <Link to="/customers">
            <button>Individual Clients</button>
          </Link>
        </div>
        <div className='category'>
          <h2>Business Clients</h2>
          <Link to="/business-list">
            <button>Business Search</button>
          </Link>
        </div>
      </div>
      <h1>Create Workflow</h1>
      <div className="categories">
        <div className="category">
          <h2>Individual</h2>
          <Link to="/tax-assesment">
            <button>Create Tax Assessment</button>
          </Link>
          <Link to="/notice-assesment">
            <button>Create Tax Notice</button>
          </Link>
        </div>
        <div className="category">
          <h2>Business</h2>
          <Link to="/business-tax-assessments">
            <button>Create Tax Assessment</button>
          </Link>
          <Link to="/business-notices">
            <button>Create Tax Notice</button>
          </Link>
        </div>
      </div>
      <Link to="/logout">
        <button className="add-client-button">Logout</button>
      </Link>
      <div className="footer-links">
        <Link to="#">Security Policy</Link>
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Legal</Link>
        <Link to="#">Technical Support</Link>
      </div>
    </div>
  );
};

export default AuditHome;
