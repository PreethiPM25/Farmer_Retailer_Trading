import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAPI } from '../services/mockApi';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await mockAPI.forgotPassword(email);
      setMessage('✅ Password reset request sent to admin. Please wait for approval.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'User not found'));
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🔐 Forgot Password</h2>
          <p>Enter your email to request password reset</p>
        </div>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Sending Request...' : '📧 Send Request'}
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

export default ForgotPasswordPage;