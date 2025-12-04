import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
      </div>
      
      <nav className="landing-nav">
        <div className="logo">🌾 Agri-Pulse</div>
        <div className="nav-buttons">
          <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-register" onClick={() => navigate('/register')}>Register</button>
        </div>
      </nav>
      
      <div className="landing-hero">
        <h1>Welcome to Agri-Pulse</h1>
        <p>Connecting Farmers Directly with Retailers</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
          <button className="btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
