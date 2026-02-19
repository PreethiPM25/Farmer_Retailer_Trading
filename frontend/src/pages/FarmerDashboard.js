import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, productAPI, orderAPI, bidAPI } from '../services/api';

function FarmerDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProductBids, setSelectedProductBids] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', quantity: '', unit: 'kg', basePrice: '', minBidPrice: '',
    harvestDate: '', deliveryArea: '', imagePath: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const loadDashboard = useCallback(async () => {
    try {
      const response = await userAPI.getDashboard(user.email);
      setUserData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  }, [user?.email]);

  const loadProducts = useCallback(async () => {
    try {
      // Load from localStorage
      const savedProducts = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
      setProducts(savedProducts);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const dummyOrders = [
        {id: 'ORD001', productName: 'Tomatoes', retailerName: 'FreshMart Pvt Ltd', quantity: '100 kg', totalPrice: 2600, paymentStatus: 'Paid', deliveryStatus: 'Shipped', orderDate: '12 Feb 2026'},
        {id: 'ORD002', productName: 'Onions', retailerName: 'GreenBasket', quantity: '200 kg', totalPrice: 4400, paymentStatus: 'Paid', deliveryStatus: 'Delivered', orderDate: '10 Feb 2026'},
        {id: 'ORD003', productName: 'Potatoes', retailerName: 'CityRetail Hub', quantity: '150 kg', totalPrice: 2850, paymentStatus: 'Processing', deliveryStatus: 'Pending', orderDate: '14 Feb 2026'},
        {id: 'ORD004', productName: 'Carrots', retailerName: 'DailyNeeds Store', quantity: '120 kg', totalPrice: 2880, paymentStatus: 'Paid', deliveryStatus: 'Delivered', orderDate: '09 Feb 2026'},
        {id: 'ORD005', productName: 'Capsicum', retailerName: 'FarmFresh Retail', quantity: '80 kg', totalPrice: 2400, paymentStatus: 'Failed', deliveryStatus: 'Cancelled', orderDate: '08 Feb 2026'},
        {id: 'ORD006', productName: 'Beans', retailerName: 'MetroMart', quantity: '60 kg', totalPrice: 1680, paymentStatus: 'Paid', deliveryStatus: 'Shipped', orderDate: '13 Feb 2026'},
        {id: 'ORD007', productName: 'Brinjal', retailerName: 'SuperVeggies', quantity: '90 kg', totalPrice: 1890, paymentStatus: 'Paid', deliveryStatus: 'Delivered', orderDate: '07 Feb 2026'},
        {id: 'ORD008', productName: 'Cabbage', retailerName: 'LocalGrocers', quantity: '140 kg', totalPrice: 2520, paymentStatus: 'Processing', deliveryStatus: 'Pending', orderDate: '15 Feb 2026'}
      ];
      setOrders(dummyOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    }
  }, []);

  const loadBids = useCallback(async () => {
    try {
      // Dummy bid data
      const dummyBids = [
        {id: 1, productId: 1, productName: 'Tomatoes', category: 'Vegetables', quantity: '100 kg', basePrice: 20, bidPrice: 26, retailerName: 'FreshMart Pvt Ltd', status: 'Pending', bidTime: '2 hours ago'},
        {id: 2, productId: 1, productName: 'Tomatoes', category: 'Vegetables', quantity: '80 kg', basePrice: 20, bidPrice: 24, retailerName: 'GreenBasket', status: 'Pending', bidTime: '3 hours ago'},
        {id: 3, productId: 2, productName: 'Onions', category: 'Vegetables', quantity: '200 kg', basePrice: 18, bidPrice: 22, retailerName: 'CityRetail Hub', status: 'Pending', bidTime: '1 hour ago'},
        {id: 4, productId: 2, productName: 'Onions', category: 'Vegetables', quantity: '150 kg', basePrice: 18, bidPrice: 21, retailerName: 'DailyNeeds Store', status: 'Pending', bidTime: '4 hours ago'}
      ];
      
      // Group by product
      const productMap = {};
      dummyBids.forEach(bid => {
        if (!productMap[bid.productId]) {
          productMap[bid.productId] = {
            id: bid.productId,
            name: bid.productName,
            category: bid.category,
            quantity: bid.quantity,
            basePrice: bid.basePrice,
            unit: 'kg',
            status: 'Active',
            bids: [],
            totalBids: 0,
            highestBid: 0,
            highestBidder: 'N/A',
            increase: 0
          };
        }
        productMap[bid.productId].bids.push(bid);
      });
      
      const productBids = Object.values(productMap).map(product => {
        const highestBid = Math.max(...product.bids.map(b => b.bidPrice));
        const highestBidder = product.bids.find(b => b.bidPrice === highestBid);
        return {
          ...product,
          totalBids: product.bids.length,
          highestBid,
          highestBidder: highestBidder?.retailerName || 'N/A',
          increase: Math.round(((highestBid - product.basePrice) / product.basePrice) * 100)
        };
      });
      
      setBids(productBids);
    } catch (err) {
      console.error('Failed to load bids:', err);
      setBids([]);
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      loadDashboard();
      loadProducts();
      loadOrders();
      loadBids();
      const interval = setInterval(() => {
        loadProducts();
        loadBids();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [user?.email, loadDashboard, loadProducts, loadOrders, loadBids]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Create product with auto-generated ID
      const newProductData = {
        id: Date.now(),
        ...newProduct,
        farmerEmail: user.email,
        status: 'Active',
        availability: 'Available',
        highestBid: 0,
        unit: 'kg'
      };
      
      // Add to state immediately
      setProducts([...products, newProductData]);
      
      // Save to localStorage
      const savedProducts = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
      savedProducts.push(newProductData);
      localStorage.setItem('farmerProducts', JSON.stringify(savedProducts));
      
      // Reset form
      setShowAddProduct(false);
      setImagePreview(null);
      setNewProduct({ name: '', category: '', quantity: '', unit: 'kg', basePrice: '', minBidPrice: '', harvestDate: '', deliveryArea: '', imagePath: '' });
      alert('✅ Product added successfully!');
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      // Update in state
      const updatedProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      setProducts(updatedProducts);
      
      // Update localStorage
      localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
      
      setEditingProduct(null);
      alert('✅ Product updated!');
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        // Remove from state
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        
        // Update localStorage
        localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
        
        alert('✅ Product deleted!');
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handlePauseProduct = async (id) => {
    try {
      const updatedProducts = products.map(p => 
        p.id === id ? {...p, isPaused: true, status: 'Paused'} : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
      alert('✅ Product paused!');
    } catch (err) {
      alert('Failed to pause product');
    }
  };

  const handleResumeProduct = async (id) => {
    try {
      const updatedProducts = products.map(p => 
        p.id === id ? {...p, isPaused: false, status: 'Active'} : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('farmerProducts', JSON.stringify(updatedProducts));
      alert('✅ Product resumed!');
    } catch (err) {
      alert('Failed to resume product');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setNewProduct({...newProduct, imagePath: file.name});
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!userData) return <div>Loading...</div>;

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const outOfStock = products.filter(p => p.availability === 'Out of Stock').length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.highestBid || 0), 0);
  
  const totalBids = bids.reduce((sum, p) => sum + p.totalBids, 0);
  const activeBids = bids.filter(p => p.totalBids > 0 && p.status === 'Active').length;
  const acceptedBids = 0;
  const rejectedBids = 0;
  const closingSoon = bids.filter(p => p.totalBids > 0 && p.status === 'Active').length;
  
  const totalOrders = orders.length;
  const inTransit = orders.filter(o => o.deliveryStatus === 'Shipped').length;
  const delivered = orders.filter(o => o.deliveryStatus === 'Delivered').length;
  const pending = orders.filter(o => o.deliveryStatus === 'Pending').length;
  const cancelled = orders.filter(o => o.deliveryStatus === 'Cancelled').length;
  const totalEarnings = orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  if (!userData) return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', fontWeight: '700'}}>Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>🌾 Farmer Dashboard</h2>
        <div className="user-info">
          <span>Welcome, Murali!</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Farmer Info Boxes */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px'}}>
          <div style={{background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', border: '3px solid #0ea5e9', borderRadius: '18px', padding: '25px', boxShadow: '0 8px 25px rgba(14, 165, 233, 0.2)'}}>
            <h3 style={{margin: '0 0 20px 0', color: '#0c4a6e', fontSize: '18px', fontWeight: '800'}}>👤 Farmer Information</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#64748b', fontWeight: '600'}}>Farmer Name:</span>
                <span style={{color: '#1e293b', fontWeight: '700'}}>Murali</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#64748b', fontWeight: '600'}}>Email:</span>
                <span style={{color: '#1e293b', fontWeight: '700'}}>preeths.252005@gmail.com</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#64748b', fontWeight: '600'}}>Contact:</span>
                <span style={{color: '#1e293b', fontWeight: '700'}}>9988776655</span>
              </div>
            </div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '3px solid #10b981', borderRadius: '18px', padding: '25px', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)'}}>
            <h3 style={{margin: '0 0 20px 0', color: '#065f46', fontSize: '18px', fontWeight: '800'}}>📊 Account Status</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#64748b', fontWeight: '600'}}>Profile Status:</span>
                <span style={{color: '#1e293b', fontWeight: '700'}}>Farmer</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#64748b', fontWeight: '600'}}>Account Status:</span>
                <span style={{color: '#1e293b', fontWeight: '700'}}>Approved</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#64748b', fontWeight: '600'}}>Last Login Date:</span>
                <span style={{color: '#1e293b', fontWeight: '700'}}>{userData.lastLogin !== 'N/A' ? new Date(userData.lastLogin).toLocaleString() : 'N/A'}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#64748b', fontWeight: '600'}}>Registration Date:</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display: 'flex', gap: '12px', marginBottom: '25px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '18px', borderRadius: '18px', boxShadow: '0 12px 40px rgba(102, 126, 234, 0.35)'}}>
          {['products', 'bids', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab === tab ? 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)' : 'rgba(255,255,255,0.15)',
              color: activeTab === tab ? '#1a3a2a' : 'white', border: 'none', padding: '12px 28px',
              borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px',
              boxShadow: activeTab === tab ? '0 8px 25px rgba(0, 255, 136, 0.4)' : 'none'
            }}>
              {tab === 'products' ? '🌾 My Products' : tab === 'bids' ? '💰 Bidding Process' : '📦 Orders'}
            </button>
          ))}
        </div>

        {/* MY PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            {/* Summary Cards */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px'}}>
              <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>📦 Total Products</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{totalProducts}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)', padding: '25px', borderRadius: '15px', color: '#1a3a2a', boxShadow: '0 8px 25px rgba(0, 255, 136, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.8}}>🟢 Active Products</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{activeProducts}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #ff4757 0%, #ff3838 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(255, 71, 87, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>🔴 Out of Stock</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{outOfStock}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>💰 Total Revenue</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>₹{totalRevenue}</div>
              </div>
            </div>

            {/* Add Product Button */}
            <div style={{marginBottom: '20px', textAlign: 'right'}}>
              <button onClick={() => setShowAddProduct(!showAddProduct)} style={{
                background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)', color: '#1a3a2a',
                border: 'none', padding: '14px 30px', borderRadius: '12px', cursor: 'pointer',
                fontWeight: '700', fontSize: '15px', boxShadow: '0 8px 25px rgba(0, 255, 136, 0.3)'
              }}>
                {showAddProduct ? '✕ Cancel' : '➕ Add Product'}
              </button>
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
              <div style={{background: 'white', border: '3px solid #667eea', borderRadius: '20px', padding: '30px', marginBottom: '25px', boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)'}}>
                <h3 style={{marginBottom: '20px', color: '#1e3c72'}}>✨ Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px'}}>
                    <input placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                    <input placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                    <input placeholder="Quantity" type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                    <input placeholder="Base Price (₹)" type="number" value={newProduct.basePrice} onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                    <input placeholder="Min Bid Price (₹)" type="number" value={newProduct.minBidPrice} onChange={(e) => setNewProduct({...newProduct, minBidPrice: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                    <input placeholder="Harvest Date" type="date" value={newProduct.harvestDate} onChange={(e) => setNewProduct({...newProduct, harvestDate: e.target.value})} style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                    <input placeholder="Delivery Area" value={newProduct.deliveryArea} onChange={(e) => setNewProduct({...newProduct, deliveryArea: e.target.value})} style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', gridColumn: 'span 2'}} />
                  </div>
                  <div style={{marginBottom: '20px'}}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{padding: '12px', border: '2px dashed #667eea', borderRadius: '10px', fontSize: '14px', width: '100%', cursor: 'pointer', background: '#f8fafc'}} />
                  </div>
                  {imagePreview && (
                    <div style={{marginBottom: '20px', textAlign: 'center'}}>
                      <img src={imagePreview} alt="Preview" style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '12px', border: '3px solid #667eea'}} />
                    </div>
                  )}
                  <button type="submit" style={{width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'}}>
                    🚀 Add Product
                  </button>
                </form>
              </div>
            )}

            {/* Product Flashcards */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px'}}>
              {products.map((product) => (
                <div key={product.id} style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '3px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.1)', transition: 'all 0.3s ease'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'}}>
                  <div style={{height: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px'}}>🌾</div>
                  <div style={{padding: '20px'}}>
                    <h3 style={{margin: '0 0 15px 0', fontSize: '20px', fontWeight: '800', color: '#1a3a2a'}}>🌿 {product.name}</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#64748b', fontSize: '14px'}}>📂 Category:</span><span style={{fontWeight: '600', fontSize: '14px'}}>{product.category || 'N/A'}</span></div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#64748b', fontSize: '14px'}}>📦 Quantity:</span><span style={{fontWeight: '600', fontSize: '14px'}}>{product.quantity} {product.unit}</span></div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#64748b', fontSize: '14px'}}>💰 Base Price:</span><span style={{fontWeight: '700', fontSize: '14px', color: '#10b981'}}>₹{product.basePrice}</span></div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#64748b', fontSize: '14px'}}>🔥 Highest Bid:</span><span style={{fontWeight: '700', fontSize: '14px', color: '#f59e0b'}}>₹{product.highestBid || 0}</span></div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#64748b', fontSize: '14px'}}>📍 Area:</span><span style={{fontWeight: '600', fontSize: '14px'}}>{product.deliveryArea || 'N/A'}</span></div>
                    </div>
                    <div style={{marginBottom: '15px'}}>
                      <span style={{background: product.status === 'Active' ? '#dcfce7' : product.status === 'Paused' ? '#fef3c7' : '#fef2f2', color: product.status === 'Active' ? '#166534' : product.status === 'Paused' ? '#92400e' : '#991b1b', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', display: 'inline-block'}}>{product.status === 'Active' ? '🟢 Active' : product.status === 'Paused' ? '🟡 Paused' : '🔴 Closed'}</span>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                      <button onClick={() => alert('View bids for ' + product.name)} style={{padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>👁️ View Bids</button>
                      <button onClick={() => setEditingProduct(product)} style={{padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>✏️ Edit</button>
                      {product.status === 'Active' ? (
                        <button onClick={() => handlePauseProduct(product.id)} style={{padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>⏸️ Pause</button>
                      ) : (
                        <button onClick={() => handleResumeProduct(product.id)} style={{padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>▶️ Resume</button>
                      )}
                      <button onClick={() => handleDeleteProduct(product.id)} style={{padding: '10px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}>🗑️ Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <div style={{textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)'}}>
                <div style={{fontSize: '80px', marginBottom: '20px'}}>📦</div>
                <h3 style={{margin: '0 0 10px 0', color: '#1a3a2a', fontSize: '24px', fontWeight: '800'}}>No Products Listed</h3>
                <p style={{margin: '0', color: '#64748b', fontSize: '16px'}}>Start by adding your first product</p>
              </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                <div style={{background: 'white', padding: '30px', borderRadius: '20px', width: '600px', maxHeight: '80vh', overflow: 'auto'}}>
                  <h3 style={{marginBottom: '20px'}}>✏ Edit Product</h3>
                  <form onSubmit={handleEditProduct}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                      <input placeholder="Product Name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                      <input placeholder="Category" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                      <input placeholder="Quantity" type="number" value={editingProduct.quantity} onChange={(e) => setEditingProduct({...editingProduct, quantity: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                      <input placeholder="Base Price" type="number" value={editingProduct.basePrice} onChange={(e) => setEditingProduct({...editingProduct, basePrice: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                      <input placeholder="Min Bid Price" type="number" value={editingProduct.minBidPrice} onChange={(e) => setEditingProduct({...editingProduct, minBidPrice: e.target.value})} required style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                      <input placeholder="Delivery Area" value={editingProduct.deliveryArea} onChange={(e) => setEditingProduct({...editingProduct, deliveryArea: e.target.value})} style={{padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px'}} />
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button type="submit" style={{flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700'}}>✅ Save</button>
                      <button type="button" onClick={() => setEditingProduct(null)} style={{flex: 1, background: '#64748b', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700'}}>✕ Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BIDDING PROCESS TAB */}
        {activeTab === 'bids' && (
          <div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '25px'}}>
              <div style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>📊 Total Bids</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{totalBids}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>🟢 Active</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{activeBids}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>✅ Accepted</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{acceptedBids}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>❌ Rejected</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{rejectedBids}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>⏳ Closing Soon</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{closingSoon}</div>
              </div>
            </div>
            
            {/* Bidding Flashcards */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '25px'}}>
              {bids.filter(p => p.totalBids > 0).map((product) => (
                <div key={product.id} style={{background: 'linear-gradient(135deg, #ffffff 0%, #fffbf0 100%)', border: product.totalBids > 0 ? '3px solid #f59e0b' : '3px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(245, 158, 11, 0.2)', transition: 'all 0.3s ease'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(245, 158, 11, 0.3)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(245, 158, 11, 0.2)'}}>
                  {/* Product Image */}
                  <div style={{height: '180px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '70px'}}>🌾</div>
                  
                  <div style={{padding: '20px'}}>
                    {/* Product Info */}
                    <h3 style={{margin: '0 0 12px 0', fontSize: '22px', fontWeight: '800', color: '#1a3a2a'}}>🌿 {product.name}</h3>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
                      <span style={{background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'}}>📂 {product.category}</span>
                      <span style={{background: '#dbeafe', color: '#1e40af', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'}}>📦 {product.quantity} {product.unit}</span>
                    </div>

                    {/* Bidding Info Box */}
                    <div style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', padding: '18px', borderRadius: '15px', marginBottom: '15px', border: '2px solid #f59e0b'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                        <span style={{color: '#92400e', fontSize: '13px', fontWeight: '600'}}>💰 Base Price:</span>
                        <span style={{fontWeight: '700', fontSize: '14px', color: '#1a3a2a'}}>₹{product.basePrice}/{product.unit}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: '#fff', borderRadius: '10px'}}>
                        <span style={{color: '#92400e', fontSize: '13px', fontWeight: '600'}}>🔥 Highest Bid:</span>
                        <span style={{fontWeight: '800', fontSize: '18px', color: '#f59e0b'}}>₹{product.highestBid}/{product.unit}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                        <span style={{color: '#92400e', fontSize: '13px', fontWeight: '600'}}>👤 Highest Bidder:</span>
                        <span style={{fontWeight: '700', fontSize: '13px', color: '#1a3a2a'}}>{product.highestBidder}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                        <span style={{color: '#92400e', fontSize: '13px', fontWeight: '600'}}>📊 Total Bids:</span>
                        <span style={{fontWeight: '700', fontSize: '13px', color: '#1a3a2a'}}>{product.totalBids}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span style={{color: '#92400e', fontSize: '13px', fontWeight: '600'}}>📈 Increase:</span>
                        <span style={{fontWeight: '700', fontSize: '13px', color: product.increase > 0 ? '#10b981' : '#64748b'}}>+{product.increase}%</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{marginBottom: '15px'}}>
                      <span style={{background: product.status === 'Active' ? '#dcfce7' : '#fef2f2', color: product.status === 'Active' ? '#166534' : '#991b1b', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', display: 'inline-block'}}>{product.status === 'Active' ? '🟢 Active' : '🔴 Closed'}</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                      <button onClick={() => {setSelectedProductBids(product.bids); setShowBidModal(true);}} style={{padding: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'}}>👁️ View All Bids</button>
                      <button onClick={() => alert('Accept highest bid: ₹' + product.highestBid)} style={{padding: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'}}>✅ Accept Highest</button>
                      <button onClick={() => alert('Reject all bids')} style={{padding: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'}}>❌ Reject All</button>
                      <button onClick={() => alert('Counter offer feature')} style={{padding: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'}}>🔁 Counter Offer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {bids.filter(p => p.totalBids > 0).length === 0 && (
              <div style={{textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 12px 40px rgba(0,0,0,0.08)'}}>
                <div style={{fontSize: '80px', marginBottom: '20px'}}>💰</div>
                <h3 style={{margin: '0 0 10px 0', color: '#1a3a2a', fontSize: '24px', fontWeight: '800'}}>No Active Bids</h3>
                <p style={{margin: '0', color: '#64748b', fontSize: '16px'}}>Bids from retailers will appear here</p>
              </div>
            )}

            {/* Bid Modal */}
            {showBidModal && (
              <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}} onClick={() => setShowBidModal(false)}>
                <div style={{background: 'white', padding: '30px', borderRadius: '20px', width: '700px', maxHeight: '80vh', overflow: 'auto'}} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{marginBottom: '20px', color: '#1a3a2a'}}>📊 All Bids</h3>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                      <tr style={{background: '#f8fafc', borderBottom: '2px solid #e2e8f0'}}>
                        <th style={{padding: '12px', textAlign: 'left', fontWeight: '700'}}>Retailer</th>
                        <th style={{padding: '12px', textAlign: 'left', fontWeight: '700'}}>Bid Price</th>
                        <th style={{padding: '12px', textAlign: 'left', fontWeight: '700'}}>Quantity</th>
                        <th style={{padding: '12px', textAlign: 'left', fontWeight: '700'}}>Time</th>
                        <th style={{padding: '12px', textAlign: 'left', fontWeight: '700'}}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProductBids.map((bid, index) => (
                        <tr key={index} style={{borderBottom: '1px solid #e2e8f0'}}>
                          <td style={{padding: '12px'}}>{bid.retailerName}</td>
                          <td style={{padding: '12px', fontWeight: '700', color: '#f59e0b'}}>₹{bid.bidPrice}</td>
                          <td style={{padding: '12px'}}>{bid.quantity}</td>
                          <td style={{padding: '12px', fontSize: '12px', color: '#64748b'}}>{bid.bidTime || 'Just now'}</td>
                          <td style={{padding: '12px'}}>
                            <div style={{display: 'flex', gap: '8px'}}>
                              <button onClick={() => alert('Accept bid')} style={{padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600'}}>✅ Accept</button>
                              <button onClick={() => alert('Reject bid')} style={{padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600'}}>❌ Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={() => setShowBidModal(false)} style={{marginTop: '20px', width: '100%', padding: '12px', background: '#64748b', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700'}}>Close</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB - Placeholder */}
        {activeTab === 'orders' && (
          <div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '25px'}}>
              <div style={{background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>📦 Total Orders</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{totalOrders}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>🚚 In Transit</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{inTransit}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>🏁 Delivered</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>{delivered}</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>⏳ Awaiting</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>0</div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', padding: '25px', borderRadius: '15px', color: 'white', boxShadow: '0 8px 25px rgba(20, 184, 166, 0.3)'}}>
                <div style={{fontSize: '14px', opacity: 0.9}}>💰 Earnings</div>
                <div style={{fontSize: '36px', fontWeight: '800', marginTop: '10px'}}>₹{totalEarnings}</div>
              </div>
            </div>
            <div style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', border: '2px solid #e2e8f0'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white'}}>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Order ID</th>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Product</th>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Retailer</th>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Quantity</th>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Total Price</th>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Payment</th>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Delivery</th>
                    <th style={{padding: '16px', textAlign: 'left', fontWeight: '700'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} style={{borderBottom: '1px solid #e2e8f0', background: index % 2 === 0 ? '#ffffff' : '#f8fafc'}}>
                      <td style={{padding: '14px', fontWeight: '600', color: '#1a3a2a'}}>#{order.id}</td>
                      <td style={{padding: '14px', color: '#475569'}}>{order.productName}</td>
                      <td style={{padding: '14px', color: '#475569'}}>{order.retailerName}</td>
                      <td style={{padding: '14px', color: '#475569'}}>{order.quantity}</td>
                      <td style={{padding: '14px', color: '#10b981', fontWeight: '700'}}>₹{order.totalPrice}</td>
                      <td style={{padding: '14px'}}>
                        <span style={{background: order.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7', color: order.paymentStatus === 'Paid' ? '#166534' : '#92400e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'}}>{order.paymentStatus}</span>
                      </td>
                      <td style={{padding: '14px'}}>
                        <span style={{background: order.deliveryStatus === 'Delivered' ? '#dcfce7' : order.deliveryStatus === 'Shipped' ? '#dbeafe' : '#fef3c7', color: order.deliveryStatus === 'Delivered' ? '#166534' : order.deliveryStatus === 'Shipped' ? '#1e40af' : '#92400e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'}}>{order.deliveryStatus}</span>
                      </td>
                      <td style={{padding: '14px'}}>
                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                          {order.deliveryStatus !== 'Delivered' && <button onClick={() => {const updated = orders.map(o => o.id === order.id ? {...o, deliveryStatus: 'Delivered'} : o); setOrders(updated); localStorage.setItem('farmerOrders', JSON.stringify(updated)); alert('Marked as delivered!');}} style={{padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600'}}>🔄 Deliver</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div style={{textAlign: 'center', padding: '50px', color: '#64748b'}}><div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div><h4 style={{margin: '0 0 8px 0', color: '#1a3a2a'}}>No Orders Yet</h4><p style={{margin: '0'}}>Orders will appear here</p></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmerDashboard;
