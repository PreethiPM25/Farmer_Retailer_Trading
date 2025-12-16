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
        </div>
      </nav>
      
      <div className="landing-hero">
        <h1>Welcome to Agri-Pulse</h1>
        <p>Connecting Farmers Directly with Retailers</p>
        <p className="tagline">Transforming Agriculture through Smart Technology</p>
        
        {/* Registration Options */}
        <div className="registration-boxes">
          <div className="reg-box farmer-box">
            <div className="reg-icon">👨‍🌾</div>
            <h3>Register as Farmer</h3>
            <p>Connect directly with retailers and expand your market reach</p>
            <button className="btn-reg-farmer" onClick={() => navigate('/register?role=FARMER')}>
              Register
            </button>
          </div>
          
          <div className="reg-box retailer-box">
            <div className="reg-icon">🏪</div>
            <h3>Register as Retailer</h3>
            <p>Source fresh produce directly from farmers at best prices</p>
            <button className="btn-reg-retailer" onClick={() => navigate('/register?role=RETAILER')}>
              Register
            </button>
          </div>
        </div>
        
        <div className="hero-buttons">
          <button className="btn-login-hero" onClick={() => navigate('/login')}>
            Login to Your Account
          </button>
        </div>
      </div>

      <section className="features-section">
        <div className="features-container">
          <h2>Why Choose Agri-Pulse?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast & Easy</h3>
              <p>Register in minutes and start connecting with farmers and retailers instantly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Your data is protected with industry-leading security measures and encryption</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track your growth with comprehensive dashboards and real-time statistics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Direct Connection</h3>
              <p>Connect directly with buyers and sellers without middlemen</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="works-container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Register</h4>
              <p>Sign up as a Farmer or Retailer with your basic information</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Get Approved</h4>
              <p>Our admin team verifies your details for authenticity</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Access Dashboard</h4>
              <p>View your personalized dashboard with market insights</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Start Trading</h4>
              <p>Connect with other farmers and retailers to grow your business</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <h2>Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h4>Email</h4>
              <p>support@agripulse.com</p>
              <p className="small-text">We reply within 24 hours</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h4>Phone</h4>
              <p>+91 1800-AGRI-PULSE</p>
              <p className="small-text">Available 9 AM - 6 PM IST</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h4>Address</h4>
              <p>Agri-Pulse Headquarters</p>
              <p className="small-text">Agricultural Technology Hub, India</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">💬</div>
              <h4>Chat Support</h4>
              <p>Live Chat Available</p>
              <p className="small-text">Click the chat button to get help</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2>What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-text">
                "Agri-Pulse helped me connect directly with retailers. My income increased by 30%!"
              </div>
              <div className="testimonial-author">- Ramesh Kumar, Farmer</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-text">
                "Easy to use platform with great support. Best decision for my retail business."
              </div>
              <div className="testimonial-author">- Priya Sharma, Retailer</div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-text">
                "The admin dashboard gives me complete insights into market trends and user growth."
              </div>
              <div className="testimonial-author">- Admin Team</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Agri-Pulse</h4>
            <p>Revolutionizing agriculture through direct farmer-retailer connections</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Social Media</h4>
            <div className="social-links">
              <a href="#facebook">Facebook</a>
              <a href="#twitter">Twitter</a>
              <a href="#linkedin">LinkedIn</a>
              <a href="#instagram">Instagram</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe for updates and insights</p>
            <div className="newsletter-input">
              <input type="email" placeholder="Your email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Agri-Pulse. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
