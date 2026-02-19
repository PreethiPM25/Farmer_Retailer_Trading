import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, productAPI, orderAPI, bidAPI } from '../services/api';

function RetailerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const [searchFilters, setSearchFilters] = useState({ category: '', minPrice: '', maxPrice: '', location: '' });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidQuantity, setBidQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('products');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
    loadProducts();
    loadOrders();
    loadBids();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await userAPI.getDashboard(user.email);
      setUserData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getRetailerOrders(user.email);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  };

  const loadBids = async () => {
    try {
      const response = await bidAPI.getRetailerBids(user.email);
      setBids(response.data);
    } catch (err) {
      console.error('Failed to load bids', err);
    }
  };

  const handleSearch = async () => {
    try {
      const params = {};
      if (searchFilters.category) params.category = searchFilters.category;
      if (searchFilters.minPrice) params.minPrice = searchFilters.minPrice;
      if (searchFilters.maxPrice) params.maxPrice = searchFilters.maxPrice;
      if (searchFilters.location) params.location = searchFilters.location;
      const response = await productAPI.searchProducts(params);
      setProducts(response.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await orderAPI.placeOrder({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: parseFloat(orderQuantity),
        price: selectedProduct.price,
        farmerEmail: selectedProduct.farmerEmail,
        farmerName: selectedProduct.farmerName,
        retailerEmail: user.email,
        retailerName: userData.fullName
      });
      setShowOrderModal(false);
      setOrderQuantity('');
      loadOrders();
      alert('Order placed successfully!');
    } catch (err) {
      alert('Failed to place order');
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm('Cancel this order?')) {
      try {
        await orderAPI.cancelOrder(id);
        loadOrders();
      } catch (err) {
        alert('Failed to cancel order');
      }
    }
  };

  const handleModifyOrder = async (id, newQuantity) => {
    try {
      await orderAPI.updateOrder(id, { quantity: parseFloat(newQuantity) });
      loadOrders();
      alert('Order updated successfully!');
    } catch (err) {
      alert('Failed to update order');
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    try {
      await bidAPI.placeBid({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        retailerEmail: user.email,
        retailerName: userData.fullName,
        farmerEmail: selectedProduct.farmerEmail,
        bidAmount: parseFloat(bidAmount),
        quantity: parseInt(bidQuantity)
      });
      setShowBidModal(false);
      setBidAmount('');
      setBidQuantity(1);
      loadBids();
      alert('Bid placed successfully!');
    } catch (err) {
      alert('Failed to place bid');
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
          <span>Welcome, Pavithra !!</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
          <div className="user-dashboard-card" style={{flex: '0 0 300px'}}>
            <h3>My Profile Information</h3>
            <div className="info-row">
              <span className="info-label">Full Name:</span>
              <span className="info-value">Pavithra</span>
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
          </div>

          <div style={{display: 'flex', gap: '15px', flex: 1}}>
            <div className="stat-card" style={{flex: 1}}>
              <h3>Profile Status</h3>
              <div className="stat-value">✓</div>
              <div className="stat-label">Complete</div>
            </div>
            <div className="stat-card" style={{flex: 1}}>
              <h3>Account Status</h3>
              <div className="stat-value">
                <span className={`status-badge status-${userData.status.toLowerCase()}`}>
                  {userData.status}
                </span>
              </div>
            </div>
            <div className="stat-card" style={{flex: 1}}>
              <h3>Last Login</h3>
              <div className="stat-value" style={{fontSize: '16px'}}>
                {userData.lastLogin !== 'N/A' ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{display: 'flex', gap: '10px', marginBottom: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '15px', borderRadius: '15px', boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'}}>
          {['products', 'bids', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'capitalize',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === tab ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none'
              }}
            >
              {tab === 'products' ? '🛒 Browse Products' : tab === 'bids' ? '💰 My Bids' : '📦 My Orders'}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="user-dashboard-card" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '2px solid #0ea5e9', borderRadius: '20px', padding: '30px'}}>
            <h3 style={{color: '#0c4a6e', fontSize: '24px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              🛒 Product Marketplace
            </h3>
            
            <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '20px'}}>
              <h4 style={{color: '#1e3c72', marginBottom: '15px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                🔍 Search & Filter Products
              </h4>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <input 
                  type="text" 
                  placeholder="📂 Category" 
                  value={searchFilters.category} 
                  onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})} 
                  style={{flex: '1', minWidth: '120px', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', background: 'white'}}
                />
                <input 
                  type="number" 
                  placeholder="💰 Min Price" 
                  value={searchFilters.minPrice} 
                  onChange={(e) => setSearchFilters({...searchFilters, minPrice: e.target.value})} 
                  style={{flex: '1', minWidth: '120px', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', background: 'white'}}
                />
                <input 
                  type="number" 
                  placeholder="💰 Max Price" 
                  value={searchFilters.maxPrice} 
                  onChange={(e) => setSearchFilters({...searchFilters, maxPrice: e.target.value})} 
                  style={{flex: '1', minWidth: '120px', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', background: 'white'}}
                />
                <input 
                  type="text" 
                  placeholder="📍 Location" 
                  value={searchFilters.location} 
                  onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})} 
                  style={{flex: '1', minWidth: '120px', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', background: 'white'}}
                />
                <button 
                  onClick={handleSearch}
                  style={{background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'}}
                >
                  🔍 Search
                </button>
              </div>
            </div>

            <div style={{background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 8px 25px rgba(0,0,0,0.1)'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'white'}}>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏷️ Product</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📂 Category</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>👨‍🌾 Farmer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📍 Location</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📊 Quantity</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>💰 Price</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🚚 Delivery</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📈 Status</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>⚡ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} style={{borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? 'white' : '#fafbfc'}}>
                      <td style={{padding: '15px 12px', color: '#334155', fontWeight: '500'}}>{product.name}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{product.category}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{product.farmerName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{product.location}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{product.quantity} {product.unit}</td>
                      <td style={{padding: '15px 12px', color: '#10b981', fontWeight: '600'}}>₹{product.price}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{product.deliveryDays || 'N/A'} days</td>
                      <td style={{padding: '15px 12px'}}>
                        <span style={{background: product.availability === 'Available' ? '#dcfce7' : '#fef2f2', color: product.availability === 'Available' ? '#166534' : '#991b1b', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500'}}>
                          {product.availability}
                        </span>
                      </td>
                      <td style={{padding: '15px 12px', display: 'flex', gap: '8px'}}>
                        <button 
                          onClick={() => { setSelectedProduct(product); setShowBidModal(true); }} 
                          style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500'}}
                        >
                          💰 Bid
                        </button>
                        <button 
                          onClick={() => { setSelectedProduct(product); setShowOrderModal(true); }} 
                          style={{background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500'}}
                        >
                          🛒 Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Products Available</h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>Try adjusting your search filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bids Tab */}
        {activeTab === 'bids' && (
          <div className="user-dashboard-card" style={{background: 'linear-gradient(135deg, #fef7cd 0%, #fbbf24 100%)', border: '2px solid #f59e0b', borderRadius: '20px', padding: '30px'}}>
            <h3 style={{color: '#92400e', fontSize: '24px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              💰 My Bidding History
            </h3>
            <div style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white'}}>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏷️ Product</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>👨‍🌾 Farmer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>💰 Bid Amount</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📊 Quantity</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📅 Date</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📈 Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid, index) => (
                    <tr key={bid.id} style={{borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? 'white' : '#fafbfc'}}>
                      <td style={{padding: '15px 12px', color: '#334155', fontWeight: '500'}}>{bid.productName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{bid.farmerName}</td>
                      <td style={{padding: '15px 12px', color: '#10b981', fontWeight: '600'}}>₹{bid.bidAmount}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{bid.quantity}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{new Date(bid.bidDate).toLocaleDateString()}</td>
                      <td style={{padding: '15px 12px'}}>
                        <span style={{background: bid.status === 'ACTIVE' ? '#dbeafe' : bid.status === 'ACCEPTED' ? '#dcfce7' : '#fef2f2', color: bid.status === 'ACTIVE' ? '#1e40af' : bid.status === 'ACCEPTED' ? '#166534' : '#991b1b', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500'}}>
                          {bid.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bids.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>💰</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Bids Placed</h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>Start bidding on products to see your history here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="user-dashboard-card" style={{background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '2px solid #6366f1', borderRadius: '20px', padding: '30px'}}>
            <h3 style={{color: '#3730a3', fontSize: '24px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              📦 My Orders
            </h3>
            <div style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white'}}>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏷️ Product</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>👨‍🌾 Farmer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📊 Quantity</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>💰 Total</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📈 Status</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📅 Date</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>⚡ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} style={{borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? 'white' : '#fafbfc'}}>
                      <td style={{padding: '15px 12px', color: '#334155', fontWeight: '500'}}>{order.productName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{order.farmerName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{order.quantity}</td>
                      <td style={{padding: '15px 12px', color: '#10b981', fontWeight: '600'}}>₹{order.totalAmount}</td>
                      <td style={{padding: '15px 12px'}}>
                        <span style={{background: order.status === 'PENDING' ? '#fef3c7' : order.status === 'CONFIRMED' ? '#dcfce7' : '#fef2f2', color: order.status === 'PENDING' ? '#92400e' : order.status === 'CONFIRMED' ? '#166534' : '#991b1b', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500'}}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td style={{padding: '15px 12px'}}>
                        {order.status === 'PENDING' && (
                          <div style={{display: 'flex', gap: '5px'}}>
                            <button onClick={() => { const qty = prompt('Enter new quantity:', order.quantity); if (qty) handleModifyOrder(order.id, qty); }} style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500'}}>✏️ Modify</button>
                            <button onClick={() => handleCancelOrder(order.id)} style={{background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500'}}>❌ Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Orders Placed</h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>Start ordering products to see your history here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', padding: '35px', borderRadius: '20px', width: '450px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', border: '2px solid #e2e8f0'}}>
            <h3 style={{color: '#1e3c72', fontSize: '24px', fontWeight: '700', marginBottom: '20px', textAlign: 'center'}}>💰 Place Your Bid</h3>
            <div style={{background: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0'}}>
              <p style={{margin: '0 0 8px 0', color: '#374151'}}><strong>🏷️ Product:</strong> {selectedProduct?.name}</p>
              <p style={{margin: '0 0 8px 0', color: '#374151'}}><strong>💰 Base Price:</strong> ₹{selectedProduct?.price} per {selectedProduct?.unit}</p>
              <p style={{margin: '0 0 8px 0', color: '#374151'}}><strong>📊 Available:</strong> {selectedProduct?.quantity} {selectedProduct?.unit}</p>
              <p style={{margin: '0', color: '#374151'}}><strong>👨🌾 Farmer:</strong> {selectedProduct?.farmerName}</p>
            </div>
            <form onSubmit={handlePlaceBid}>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500'}}>💰 Your Bid Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="Enter your bid amount" 
                  value={bidAmount} 
                  onChange={(e) => setBidAmount(e.target.value)} 
                  required 
                  style={{width: '100%', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '10px', fontSize: '16px', background: 'white'}} 
                />
              </div>
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500'}}>📊 Quantity (Single Unit Only)</label>
                <input 
                  type="number" 
                  value={bidQuantity} 
                  onChange={(e) => setBidQuantity(e.target.value)} 
                  min="1" 
                  max="1" 
                  required 
                  style={{width: '100%', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '10px', fontSize: '16px', background: 'white'}} 
                  readOnly
                />
                <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#6b7280'}}>Note: Bids are only allowed for single quantity</p>
              </div>
              <div style={{display: 'flex', gap: '12px', marginTop: '25px'}}>
                <button 
                  type="submit" 
                  style={{flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'}}
                >
                  🚀 Place Bid
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowBidModal(false); setBidAmount(''); setBidQuantity(1); }} 
                  style={{flex: 1, background: 'linear-gradient(135deg, #6b7280, #4b5563)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '16px'}}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', padding: '35px', borderRadius: '20px', width: '450px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', border: '2px solid #e2e8f0'}}>
            <h3 style={{color: '#1e3c72', fontSize: '24px', fontWeight: '700', marginBottom: '20px', textAlign: 'center'}}>🛒 Place Order</h3>
            <div style={{background: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0'}}>
              <p style={{margin: '0 0 8px 0', color: '#374151'}}><strong>🏷️ Product:</strong> {selectedProduct?.name}</p>
              <p style={{margin: '0 0 8px 0', color: '#374151'}}><strong>💰 Price:</strong> ₹{selectedProduct?.price} per {selectedProduct?.unit}</p>
              <p style={{margin: '0 0 8px 0', color: '#374151'}}><strong>📊 Available:</strong> {selectedProduct?.quantity} {selectedProduct?.unit}</p>
              <p style={{margin: '0', color: '#374151'}}><strong>👨🌾 Farmer:</strong> {selectedProduct?.farmerName}</p>
            </div>
            <form onSubmit={handlePlaceOrder}>
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500'}}>📊 Enter Quantity</label>
                <input 
                  type="number" 
                  placeholder="Enter quantity" 
                  value={orderQuantity} 
                  onChange={(e) => setOrderQuantity(e.target.value)} 
                  required 
                  style={{width: '100%', padding: '12px 15px', border: '2px solid #cbd5e1', borderRadius: '10px', fontSize: '16px', background: 'white'}} 
                />
              </div>
              {orderQuantity && (
                <div style={{background: '#dcfce7', padding: '15px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #10b981'}}>
                  <p style={{margin: '0', color: '#166534', fontWeight: '600', fontSize: '18px'}}>💰 Total: ₹{(orderQuantity * selectedProduct?.price).toFixed(2)}</p>
                </div>
              )}
              <div style={{display: 'flex', gap: '12px', marginTop: '25px'}}>
                <button 
                  type="submit" 
                  style={{flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'}}
                >
                  🚀 Confirm Order
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowOrderModal(false); setOrderQuantity(''); }} 
                  style={{flex: 1, background: 'linear-gradient(135deg, #6b7280, #4b5563)', color: 'white', border: 'none', padding: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '16px'}}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RetailerDashboard;
