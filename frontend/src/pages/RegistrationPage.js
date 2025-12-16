import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';

function RegistrationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'FARMER';

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    role: roleParam
  });
  const [documentFileName, setDocumentFileName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(prev => ({...prev, role: roleParam}));
  }, [roleParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate required fields
    if (!formData.email || !formData.fullName || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      const submitData = {
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        role: formData.role,
        documentPath: documentFileName.trim() || ''
      };
      
      console.log('Registering user:', submitData);
      const response = await authAPI.register(submitData);
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        setSuccess('Registration successful! Admin will review your request.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error details:', err.response?.data || err.message);
      
      if (err.code === 'NETWORK_ERROR' || (err.message && err.message.includes('Network Error'))) {
        setError('Registration failed. Please try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
      }
    }
  };



  return (
    <div className="registration-page-container">
      <div className="reg-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      </div>

      <div className="auth-page">
        <div className="auth-container registration-form">
          <h2>
            {formData.role === 'FARMER' ? (
              <>Register as <span className="role-highlight farmer-role">Farmer</span></>
            ) : (
              <>Register as <span className="role-highlight retailer-role">Retailer</span></>
            )}
          </h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email <span style={{color: 'red'}}>*</span></label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone <span style={{color: 'red'}}>*</span></label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Address <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Document Name <span style={{color: '#666', fontSize: '12px'}}>(Optional)</span></label>
              <input
                type="text"
                value={documentFileName}
                onChange={(e) => setDocumentFileName(e.target.value)}
                placeholder="Enter document reference (e.g., Aadhar Card, License)"
              />
              <p className="file-help-text" style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>You can provide document details for verification</p>
            </div>
            <button type="submit" className="btn-submit registration-submit" disabled={!formData.email || !formData.fullName || !formData.phone || !formData.address}>
              {formData.role === 'FARMER' ? 'Register as Farmer' : 'Register as Retailer'}
            </button>
          </form>
          
          <div className="auth-link">
            Already have an account? <a href="/login">Login here</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
