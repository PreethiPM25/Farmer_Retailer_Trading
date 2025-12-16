import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, productAPI, orderAPI, bidAPI } from '../services/api';

function FarmerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [imagePreview, setImagePreview] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', quantity: '', unit: 'kg', price: '', availability: 'Available',
    imagePath: '', deliveryDays: '', location: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));

  const loadDashboard = useCallback(async () => {
    try {
      console.log('📋 Loading dashboard for:', user?.email);
      const response = await userAPI.getDashboard(user.email);
      console.log('✅ Dashboard data:', response.data);
      setUserData(response.data);
    } catch (err) {
      console.error('❌ Failed to load dashboard:', err);
    }
  }, [user?.email]);

  const loadProducts = useCallback(async () => {
    try {
      if (!user?.email) {
        console.warn('⚠️ No user email available');
        setProducts([]);
        return;
      }
      console.log('🔍 Fetching products for farmer:', user.email);
      const response = await productAPI.getFarmerProducts(user.email);
      console.log('📊 API Response received:', response);
      console.log('📊 Response type:', typeof response);
      console.log('📊 Response.data:', response?.data);
      console.log('📊 Response.data type:', typeof response?.data);
      
      if (response && response.data) {
        const productsData = Array.isArray(response.data) ? response.data : [];
        console.log('✅ Products loaded successfully:', productsData.length, 'products');
        
        // Ensure proper data formatting for each product
        const formattedProducts = productsData.map(p => ({
          ...p,
          quantity: parseFloat(p.quantity) || 0,
          price: parseFloat(p.price) || 0,
          deliveryDays: parseInt(p.deliveryDays) || 7
        }));
        
        console.log('📈 Formatted products data:', formattedProducts);
        setProducts(formattedProducts);
      } else {
        console.warn('⚠️ No data in response:', response);
        setProducts([]);
      }
    } catch (err) {
      console.error('❌ Failed to load products:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error details:', err);
      setProducts([]);
    }
  }, [user?.email]);

  const loadOrders = useCallback(async () => {
    try {
      console.log('📦 Loading orders for:', user?.email);
      const response = await orderAPI.getFarmerOrders(user.email);
      if (response.data) {
        setOrders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('❌ Failed to load orders:', err);
      setOrders([]);
    }
  }, [user?.email]);

  const loadBids = useCallback(async () => {
    try {
      console.log('💰 Loading bids for:', user?.email);
      const response = await bidAPI.getFarmerBids(user.email);
      if (response.data) {
        setBids(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('❌ Failed to load bids:', err);
      setBids([]);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      loadDashboard();
      loadProducts();
      loadOrders();
      loadBids();
    }
  }, [user?.email, loadDashboard, loadProducts, loadOrders, loadBids]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.quantity || !newProduct.price || !newProduct.location) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      console.log('📝 Adding product with data:', { ...newProduct, farmerEmail: user.email });
      const response = await productAPI.addProduct({ ...newProduct, farmerEmail: user.email });
      console.log('✅ Product added response:', response);
      console.log('🔍 Response data type:', typeof response.data);
      console.log('🔍 Response data:', response.data);
      
      if (response && response.data) {
        console.log('📦 Product saved successfully! ID:', response.data.id);
        
        // Immediately add product to table with proper data formatting
        const newProductData = {
          ...response.data,
          quantity: parseFloat(response.data.quantity),
          price: parseFloat(response.data.price),
          deliveryDays: parseInt(response.data.deliveryDays) || 7
        };
        setProducts(prevProducts => [...prevProducts, newProductData]);
        console.log('⚡ Product added to table immediately:', newProductData);
        
        // Reset form
        setShowAddProduct(false);
        setImagePreview(null);
        setNewProduct({ name: '', quantity: '', unit: 'kg', price: '', availability: 'Available', imagePath: '', deliveryDays: '', location: '' });
        
        alert('✅ Product added successfully! Email sent to retailers.');
        
        // Reload products from server after a short delay to ensure consistency
        setTimeout(() => {
          console.log('🔄 Reloading products from server for consistency...');
          loadProducts();
        }, 500);
      } else {
        console.error('❌ No data in response:', response);
        alert('Failed to add product. Please try again.');
      }
    } catch (err) {
      console.error('❌ Error adding product:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      alert('Failed to add product. Error: ' + (err.message || 'Unknown error'));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview for UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Store only filename, NOT the entire base64 data
      setNewProduct({...newProduct, imagePath: file.name});
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        loadProducts();
        alert('✅ Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
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
        <h2>🌾 Farmer Dashboard</h2>
        <div className="user-info">
          <span>Welcome, Murali !!</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
          <div className="user-dashboard-card" style={{flex: '0 0 300px'}}>
            <h3>My Profile Information</h3>
            <div className="info-row">
              <span className="info-label">Full Name:</span>
              <span className="info-value">Murali</span>
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
        <div style={{display: 'flex', gap: '12px', marginBottom: '25px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '18px', borderRadius: '18px', boxShadow: '0 12px 40px rgba(102, 126, 234, 0.35)', border: '2px solid rgba(255,255,255,0.1)'}}>
          {['products', 'bids', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)' : 'rgba(255,255,255,0.15)',
                color: activeTab === tab ? '#1a3a2a' : 'white',
                border: activeTab === tab ? '2px solid #00ff88' : '2px solid rgba(255,255,255,0.3)',
                padding: '12px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'capitalize',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: activeTab === tab ? '0 8px 25px rgba(0, 255, 136, 0.4)' : 'none',
                textShadow: activeTab === tab ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {tab === 'products' ? '🌾 My Products' : tab === 'bids' ? '💰 Bidding Process' : '📦 Orders'}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
            {/* Product Details Form Card */}
            <div style={{background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)', border: '3px solid #667eea', borderRadius: '25px', padding: '35px', boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)', borderRadius: '50%'}}></div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'relative', zIndex: 1}}>
                <h3 style={{color: '#1e3c72', fontSize: '26px', fontWeight: '800', margin: '0', display: 'flex', alignItems: 'center', gap: '12px'}}>
                  ✨ Product Details
                </h3>
                <button 
                  className="btn-toggle-form" 
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  style={{
                    background: showAddProduct ? 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)' : 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
                    color: showAddProduct ? 'white' : '#1a3a2a',
                    border: 'none',
                    padding: '13px 28px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: showAddProduct ? '0 8px 25px rgba(255, 71, 87, 0.3)' : '0 8px 25px rgba(0, 255, 136, 0.3)',
                  }}
                >
                  {showAddProduct ? '✕ Cancel' : '➕ Add Product'}
                </button>
              </div>

              {showAddProduct && (
                <form onSubmit={handleAddProduct} style={{position: 'relative', zIndex: 1}}>
                  {/* First Row - 4 Equal Columns */}
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px'}}>
                    {/* Product Name */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>📦 Product</label>
                      <input 
                        type="text" 
                        placeholder="Enter product name" 
                        value={newProduct.name} 
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                        required 
                        style={{
                          padding: '14px 16px', 
                          border: '2px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          background: '#ffffff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>

                    {/* Quantity */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>📊 Quantity</label>
                      <input 
                        type="number" 
                        placeholder="Enter quantity" 
                        value={newProduct.quantity} 
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} 
                        required 
                        style={{
                          padding: '14px 16px', 
                          border: '2px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          background: '#ffffff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>

                    {/* Unit */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>⚖️ Unit</label>
                      <select 
                        value={newProduct.unit} 
                        onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})} 
                        style={{
                          padding: '14px 16px', 
                          border: '2px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          background: '#ffffff',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="ton">Ton</option>
                        <option value="quintal">Quintal</option>
                      </select>
                    </div>

                    {/* Price per Unit */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>💰 Price/Unit</label>
                      <input 
                        type="number" 
                        placeholder="Enter price" 
                        value={newProduct.price} 
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                        required 
                        style={{
                          padding: '14px 16px', 
                          border: '2px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          background: '#ffffff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>
                  </div>

                  {/* Second Row - Image Upload & Delivery Days */}
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px'}}>
                    {/* Image Upload */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>🖼️ Upload Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{
                          padding: '12px 16px', 
                          border: '2px dashed #667eea', 
                          borderRadius: '12px', 
                          fontSize: '13px',
                          background: '#f7fafc',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#667eea'}
                      />
                    </div>

                    {/* Delivery Days */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>🚚 Deliver Within (days)</label>
                      <input 
                        type="number" 
                        placeholder="Days to deliver" 
                        value={newProduct.deliveryDays} 
                        onChange={(e) => setNewProduct({...newProduct, deliveryDays: e.target.value})} 
                        style={{
                          padding: '14px 16px', 
                          border: '2px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          background: '#ffffff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>

                    {/* Status */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>📈 Status</label>
                      <select 
                        value={newProduct.availability} 
                        onChange={(e) => setNewProduct({...newProduct, availability: e.target.value})} 
                        style={{
                          padding: '14px 16px', 
                          border: '2px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          background: '#ffffff',
                          cursor: 'pointer'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      >
                        <option value="Available">✅ Available</option>
                        <option value="Out of Stock">❌ Out of Stock</option>
                      </select>
                    </div>

                    {/* Location */}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <label style={{color: '#2d3748', fontWeight: '600', marginBottom: '8px', fontSize: '13px'}}>📍 Location</label>
                      <input 
                        type="text" 
                        placeholder="Enter location" 
                        value={newProduct.location} 
                        onChange={(e) => setNewProduct({...newProduct, location: e.target.value})} 
                        required 
                        style={{
                          padding: '14px 16px', 
                          border: '2px solid #cbd5e1', 
                          borderRadius: '12px', 
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          background: '#ffffff'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div style={{marginBottom: '25px', textAlign: 'center'}}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{maxWidth: '150px', maxHeight: '150px', borderRadius: '12px', border: '3px solid #667eea'}}
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white', 
                      border: 'none', 
                      padding: '16px 30px', 
                      borderRadius: '12px', 
                      cursor: 'pointer', 
                      fontWeight: '700', 
                      fontSize: '16px', 
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    🚀 Add Product
                  </button>
                </form>
              )}
            </div>

            {/* Products Listed Table */}
            <div style={{background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)', border: '3px solid #00ff88', borderRadius: '25px', padding: '30px', boxShadow: '0 20px 60px rgba(0, 255, 136, 0.15)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: 0, left: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 255, 136, 0.1) 0%, transparent 70%)', borderRadius: '50%'}}></div>
              
              <h3 style={{color: '#1a3a2a', fontSize: '26px', fontWeight: '800', marginBottom: '25px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px'}}>
                📂 Products Listed
              </h3>

              <div style={{borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', border: '2px solid #00ff88', position: 'relative', zIndex: 1}}>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)', color: '#1a3a2a'}}>
                        <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📂 Product</th>
                        <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>💰 Quantity</th>
                        <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>💵 Price</th>
                        <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>🚚 Delivery</th>
                        <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📈 Status</th>
                        <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>⚡ Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr 
                          key={product.id} 
                          style={{
                            borderBottom: '1px solid #e2e8f0', 
                            background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f0f4ff';
                            e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(102, 126, 234, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <td style={{padding: '16px 16px', color: '#1a3a2a', fontWeight: '600'}}>{product.name}</td>
                          <td style={{padding: '16px 16px', color: '#475569'}}>{product.quantity} {product.unit}</td>
                          <td style={{padding: '16px 16px', color: '#00cc66', fontWeight: '700'}}>₹{product.price}</td>
                          <td style={{padding: '16px 16px', color: '#475569'}}>{product.deliveryDays || 'N/A'} days</td>
                          <td style={{padding: '16px 16px'}}>
                            <span style={{
                              background: product.availability === 'Available' ? '#dcfce7' : '#fef2f2', 
                              color: product.availability === 'Available' ? '#166534' : '#991b1b', 
                              padding: '8px 14px', 
                              borderRadius: '20px', 
                              fontSize: '12px', 
                              fontWeight: '700',
                              border: product.availability === 'Available' ? '1px solid #86efac' : '1px solid #fca5a5'
                            }}>
                              {product.availability === 'Available' ? '✅ Available' : '❌ Out of Stock'}
                            </span>
                          </td>
                          <td style={{padding: '16px 16px'}}>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)} 
                              style={{
                                background: 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 16px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontSize: '12px', 
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(255, 71, 87, 0.25)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 71, 87, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 71, 87, 0.25)';
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {products.length === 0 && (
                  <div style={{textAlign: 'center', padding: '50px 20px', background: '#f8fafc'}}>
                    <div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div>
                    <h4 style={{margin: '0 0 8px 0', color: '#1a3a2a', fontSize: '18px', fontWeight: '700'}}>No Products Listed</h4>
                    <p style={{margin: '0', color: '#64748b', fontSize: '14px'}}>Start by adding your first product</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bidding Process Tab */}
        {activeTab === 'bids' && (
          <div style={{background: 'linear-gradient(135deg, #fef7cd 0%, #fbbf24 100%)', border: '3px solid #f59e0b', borderRadius: '25px', padding: '35px', boxShadow: '0 20px 60px rgba(245, 158, 11, 0.25)', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)', borderRadius: '50%'}}></div>
            
            <h3 style={{color: '#92400e', fontSize: '26px', fontWeight: '800', marginBottom: '30px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px'}}>
              💰 Bidding Process Management
            </h3>
            <div style={{borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1}}>
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white'}}>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>🏷️ Product</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>🏪 Retailer</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>💰 Bid Amount</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📊 Quantity</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📅 Date</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📈 Status</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>⚡ Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid, index) => (
                      <tr 
                        key={bid.id} 
                        style={{
                          borderBottom: '1px solid #f1f5f9', 
                          background: index % 2 === 0 ? 'white' : '#fffbf0',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fffef5';
                          e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(245, 158, 11, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fffbf0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <td style={{padding: '16px 16px', color: '#1a3a2a', fontWeight: '600'}}>{bid.productName}</td>
                        <td style={{padding: '16px 16px', color: '#475569'}}>{bid.retailerName}</td>
                        <td style={{padding: '16px 16px', color: '#f59e0b', fontWeight: '700'}}>₹{bid.bidAmount}</td>
                        <td style={{padding: '16px 16px', color: '#475569'}}>{bid.quantity}</td>
                        <td style={{padding: '16px 16px', color: '#475569'}}>{new Date(bid.bidDate).toLocaleDateString()}</td>
                        <td style={{padding: '16px 16px'}}>
                          <span style={{
                            background: bid.status === 'ACTIVE' ? '#dbeafe' : bid.status === 'ACCEPTED' ? '#dcfce7' : '#fef2f2', 
                            color: bid.status === 'ACTIVE' ? '#1e40af' : bid.status === 'ACCEPTED' ? '#166534' : '#991b1b', 
                            padding: '8px 14px', 
                            borderRadius: '20px', 
                            fontSize: '12px', 
                            fontWeight: '700',
                            border: bid.status === 'ACTIVE' ? '1px solid #93c5fd' : bid.status === 'ACCEPTED' ? '1px solid #86efac' : '1px solid #fca5a5'
                          }}>
                            {bid.status}
                          </span>
                        </td>
                        <td style={{padding: '16px 16px'}}>
                          {bid.status === 'ACTIVE' && (
                            <button 
                              onClick={() => bidAPI.acceptBid(bid.id).then(() => loadBids())} 
                              style={{
                                background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)', 
                                color: '#1a3a2a', 
                                border: 'none', 
                                padding: '8px 16px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontSize: '12px', 
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.25)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 255, 136, 0.25)';
                              }}
                            >
                              ✅ Accept
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {bids.length === 0 && (
                <div style={{textAlign: 'center', padding: '50px 20px', background: '#fffbf0'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>💰</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#1a3a2a', fontSize: '18px', fontWeight: '700'}}>No Bids Received</h4>
                  <p style={{margin: '0', color: '#92400e', fontSize: '14px'}}>Bids will appear here when retailers place them</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div style={{background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', border: '3px solid #6366f1', borderRadius: '25px', padding: '35px', boxShadow: '0 20px 60px rgba(99, 102, 241, 0.25)', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, left: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', borderRadius: '50%'}}></div>
            
            <h3 style={{color: '#3730a3', fontSize: '26px', fontWeight: '800', marginBottom: '30px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px'}}>
              📦 Orders Received
            </h3>
            <div style={{borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', position: 'relative', zIndex: 1}}>
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white'}}>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📂 Product</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>🏪 Retailer</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📊 Quantity</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>💰 Total</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📈 Status</th>
                      <th style={{padding: '18px 16px', fontWeight: '800', fontSize: '14px', textAlign: 'left'}}>📅 Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr 
                        key={order.id} 
                        style={{
                          borderBottom: '1px solid #f1f5f9', 
                          background: index % 2 === 0 ? 'white' : '#f8f9ff',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0f4ff';
                          e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(99, 102, 241, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8f9ff';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <td style={{padding: '16px 16px', color: '#1a3a2a', fontWeight: '600'}}>{order.productName}</td>
                        <td style={{padding: '16px 16px', color: '#475569'}}>{order.retailerName}</td>
                        <td style={{padding: '16px 16px', color: '#475569'}}>{order.quantity}</td>
                        <td style={{padding: '16px 16px', color: '#6366f1', fontWeight: '700'}}>₹{order.totalAmount}</td>
                        <td style={{padding: '16px 16px'}}>
                          <span style={{
                            background: order.status === 'PENDING' ? '#fef3c7' : order.status === 'CONFIRMED' ? '#dcfce7' : '#fef2f2', 
                            color: order.status === 'PENDING' ? '#92400e' : order.status === 'CONFIRMED' ? '#166534' : '#991b1b', 
                            padding: '8px 14px', 
                            borderRadius: '20px', 
                            fontSize: '12px', 
                            fontWeight: '700',
                            border: order.status === 'PENDING' ? '1px solid #fcd34d' : order.status === 'CONFIRMED' ? '1px solid #86efac' : '1px solid #fca5a5'
                          }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{padding: '16px 16px', color: '#475569'}}>{new Date(order.orderDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orders.length === 0 && (
                <div style={{textAlign: 'center', padding: '50px 20px', background: '#f8f9ff'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#1a3a2a', fontSize: '18px', fontWeight: '700'}}>No Orders Received</h4>
                  <p style={{margin: '0', color: '#3730a3', fontSize: '14px'}}>Orders will appear here when retailers place them</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmerDashboard;
