import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/MyBids.css';
import biddingService from '../services/biddingService';

function MyBids() {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [bids, setBids] = useState([]);
  const [myBid, setMyBid] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Load bids when product changes
  useEffect(() => {
    if (product?.id) {
      // Add dummy previous bids
      const dummyBids = [
        {
          id: 1,
          retailerName: 'Ravi',
          amount: Math.floor(Math.random() * 500) + product.price,
          timestamp: new Date(Date.now() - Math.random() * 86400000)
        },
        {
          id: 2,
          retailerName: 'Hasini',
          amount: Math.floor(Math.random() * 600) + product.price,
          timestamp: new Date(Date.now() - Math.random() * 86400000)
        },
        {
          id: 3,
          retailerName: 'Nithish',
          amount: Math.floor(Math.random() * 700) + product.price,
          timestamp: new Date(Date.now() - Math.random() * 86400000)
        }
      ];
      
      const existingBids = biddingService.getProductBids(product.id);
      setBids([...dummyBids, ...existingBids]);
    }
  }, [product?.id]);

  const handleBidNow = () => {
    if (!myBid || parseFloat(myBid) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    try {
      // Add new bid to existing bids
      const newBid = {
        id: Date.now(),
        retailerName: user.fullName || 'Pavithra',
        amount: parseFloat(myBid),
        timestamp: new Date()
      };
      
      setBids(prevBids => [...prevBids, newBid]);
      
      // Store in biddingService
      biddingService.placeBid(
        product.id,
        user.email,
        user.fullName || 'Pavithra',
        parseFloat(myBid)
      );

      setMyBid('');
      alert('✅ Bid placed successfully! Your bid has been saved.');
    } catch (error) {
      alert('❌ Failed to place bid: ' + error.message);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="my-bids-container">
        <div style={{textAlign: 'center', padding: '60px 20px'}}>
          <div style={{fontSize: '64px', marginBottom: '20px'}}>📦</div>
          <h2 style={{color: '#374151', marginBottom: '10px'}}>No Product Selected</h2>
          <p style={{color: '#6b7280', marginBottom: '30px'}}>Please select a product first</p>
          <button 
            onClick={handleBackClick}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            ⬅️ Go Back
          </button>
        </div>
      </div>
    );
  }

  const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.bidPrice)) : 0;

  return (
    <div className="my-bids-container">
      <nav className="my-bids-nav">
        <button onClick={handleBackClick} style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          marginRight: '15px'
        }}>
          ⬅️ Back
        </button>
        <h2 style={{margin: '0', color: '#1f2937', fontSize: '24px', fontWeight: '700'}}>💰 My Bids</h2>
      </nav>

      <div className="my-bids-content">
        {/* Product Flashcard */}
        <div className="product-flashcard">
          <div style={{position: 'relative', marginBottom: '20px'}}>
            <div style={{
              width: '100%',
              height: '240px',
              background: '#f3f4f6',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              overflow: 'hidden',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>
              {product.imagePath ? <img src={product.imagePath} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : '🌾'}
            </div>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
              color: '#065f46',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0, 200, 100, 0.3)'
            }}>
              ✨ {product.category}
            </div>
          </div>

          <div className="flashcard-info">
            <h3 style={{fontSize: '24px', fontWeight: '700', margin: '0 0 15px 0', color: '#1f2937'}}>
              🌾 {product.name}
            </h3>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
              <div className="info-badge">
                <span className="badge-label">👨‍🌾 Farmer</span>
                <span className="badge-value">{product.farmerName}</span>
              </div>
              <div className="info-badge">
                <span className="badge-label">📍 Location</span>
                <span className="badge-value">{product.location}</span>
              </div>
              <div className="info-badge">
                <span className="badge-label">📊 Available</span>
                <span className="badge-value">{product.quantity} {product.unit}</span>
              </div>
              <div className="info-badge">
                <span className="badge-label">🚚 Delivery</span>
                <span className="badge-value">{product.deliveryDays || 'N/A'} days</span>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '18px'
            }}>
              💰 Base Price: ₹{product.price}
            </div>

            <button
              onClick={() => document.getElementById('bid-section').scrollIntoView({ behavior: 'smooth' })}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                padding: '14px 20px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🎯 Bid this Product
            </button>
          </div>
        </div>

        {/* Bidding Section */}
        <div id="bid-section" className="bidding-section">
          <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#1f2937'}}>
            📊 Previous Bids
          </h3>

          <div className="bids-list">
            {bids.length === 0 ? (
              <div style={{textAlign: 'center', padding: '30px 20px', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #e5e7eb'}}>
                <div style={{fontSize: '32px', marginBottom: '10px'}}>📭</div>
                <p style={{margin: '0', color: '#6b7280', fontWeight: '500'}}>No bids placed yet</p>
              </div>
            ) : (
              bids.map((bid, index) => (
                <div key={index} className="bid-card">
                  <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '18px'
                    }}>
                      {bid.retailerName.charAt(0)}
                    </div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', color: '#1f2937', marginBottom: '4px'}}>
                        {bid.retailerName}
                      </div>
                      <div style={{fontSize: '12px', color: '#6b7280'}}>
                        {new Date(bid.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{
                      background: bid.amount === Math.max(...bids.map(b => b.amount)) ? 'linear-gradient(135deg, #10b981, #059669)' : '#f3f4f6',
                      color: bid.amount === Math.max(...bids.map(b => b.amount)) ? 'white' : '#1f2937',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px'
                    }}>
                      ₹{bid.amount}
                      {bid.amount === Math.max(...bids.map(b => b.amount)) && <span style={{marginLeft: '6px', fontSize: '14px'}}>👑</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="my-bid-input-section">
            <h4 style={{color: '#1f2937', marginBottom: '15px', fontSize: '16px', fontWeight: '600'}}>
              🎯 Place Your Bid
            </h4>
            <div style={{display: 'flex', gap: '10px'}}>
              <input
                type="number"
                placeholder="Enter your bid amount (₹)"
                value={myBid}
                onChange={(e) => setMyBid(e.target.value)}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '500',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                onClick={handleBidNow}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 30px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🚀 Bid Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBids;
