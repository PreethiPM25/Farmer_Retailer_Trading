import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

function RetailerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await userAPI.getDashboard(user.email);
      setUserData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>🏪 Retailer Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {userData.fullName}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Profile Status</h3>
            <div className="stat-value">✓</div>
            <div className="stat-label">Complete</div>
          </div>
          <div className="stat-card">
            <h3>Account Status</h3>
            <div className="stat-value">
              <span className={`status-badge status-${userData.status.toLowerCase()}`}>
                {userData.status}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <h3>Last Login</h3>
            <div className="stat-value" style={{fontSize: '18px'}}>
              {userData.lastLogin !== 'N/A' ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>

        <div className="user-dashboard-card">
          <h3>My Profile Information</h3>
          <div className="info-row">
            <span className="info-label">Full Name:</span>
            <span className="info-value">{userData.fullName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{userData.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role:</span>
            <span className="info-value">{userData.role}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Registration Date:</span>
            <span className="info-value">{new Date(userData.registrationDate).toLocaleDateString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Password Reset:</span>
            <span className="info-value">{userData.passwordReset ? 'Yes' : 'No'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className={`status-badge status-${userData.status.toLowerCase()}`}>
              {userData.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerDashboard;
