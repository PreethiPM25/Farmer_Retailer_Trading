import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'FARMER' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login with:', { email: formData.email, role: formData.role });
      
      // Admin bypass - allow any password for admin
      if (formData.role === 'ADMIN') {
        localStorage.setItem('user', JSON.stringify({ 
          email: formData.email, 
          fullName: 'Admin User', 
          role: 'ADMIN' 
        }));
        navigate('/admin/dashboard');
        return;
      }
      
      // For farmers and retailers, use mock authentication
      const response = await authAPI.login({ email: formData.email, password: formData.password });
      console.log('Login response:', response.data);
      const { role, passwordReset, email, fullName, requiresPasswordReset } = response.data;
      
      localStorage.setItem('user', JSON.stringify({ email, fullName, role }));
      
      // Check if user needs to reset password (logged in with temp password)
      if (requiresPasswordReset) {
        localStorage.setItem('resetEmail', email);
        navigate('/new-password', { state: { email } });
        return;
      }
      
      // Navigate based on role
      if (role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (role === 'RETAILER') {
        navigate('/retailer/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="auth-page">
      <div className="login-header" style={{padding: '20px'}}>
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      </div>
      
      <div className="auth-container" style={{maxWidth: '500px', margin: '40px auto'}}>
        <h2>Login to Agri-Pulse</h2>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Enter your credentials to continue</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="FARMER">Farmer</option>
              <option value="RETAILER">Retailer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email <span style={{color: 'red'}}>*</span></label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password <span style={{color: 'red'}}>*</span></label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn-submit">Login</button>
        </form>
        
        <div className="auth-link">
          <a href="/forgot-password">Forgot Password?</a>
          <span className="divider">|</span>
          <a href="/register">Don't have an account? Register</a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
