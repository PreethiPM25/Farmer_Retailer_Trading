import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockAPI } from '../services/mockApi';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const userEmail = location.state?.email || localStorage.getItem('resetEmail');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Update password using API
      const response = await mockAPI.updatePassword(userEmail, formData.newPassword);
      
      // Clear reset email
      localStorage.removeItem('resetEmail');

      setMessage('✅ Password updated successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successful! Please login with your new password.',
            email: userEmail
          }
        });
      }, 2000);

    } catch (error) {
      setMessage('❌ Failed to update password: ' + (error.response?.data?.message || error.message));
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Reset Password</h2>
          <p>Create your new password</p>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>New Password *</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Updating...' : '🔐 Update Password'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <button 
              onClick={() => navigate('/login')}
              className="link-button"
            >
              ← Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;