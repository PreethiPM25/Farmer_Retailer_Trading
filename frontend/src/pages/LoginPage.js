import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authAPI.login(formData);
      const { role, passwordReset, email, fullName } = response.data;
      
      localStorage.setItem('user', JSON.stringify({ email, fullName, role }));
      
      if (!passwordReset) {
        navigate('/reset-password', { state: { email, isFirstLogin: true } });
      } else {
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'FARMER') navigate('/farmer/dashboard');
        else if (role === 'RETAILER') navigate('/retailer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to Agri-Pulse</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn-submit">Login</button>
        </form>
        <div className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
