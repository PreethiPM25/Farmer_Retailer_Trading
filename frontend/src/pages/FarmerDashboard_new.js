import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

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
      const savedBids = JSON.parse(localStorage.getItem('farmerBids') || '[]');
      const productBids = products.map(product => {
        const productBidsList = savedBids.filter(b => b.productId === product.id);
        const highestBid = productBidsList.length > 0 ? Math.max(...productBidsList.map(b => b.bidPrice)) : 0;
        const highestBidder = productBidsList.find(b => b.bidPrice === highestBid);
        return {
          ...product,
          bids: productBidsList,
          totalBids: productBidsList.length,
          highestBid,
          highestBidder: highestBidder?.retailerName || 'N/A',
          increase: product.basePrice ? Math.round(((highestBid - product.basePrice) / product.basePrice) * 100) : 0
        };
      });
      setBids(productBids);
    } catch (err) {
      console.error('Failed to load bids:', err);
      setBids([]);
    }
  }, [products]);

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
      const newProductData = {
        id: Date.now(),
        ...newProduct,
        farmerEmail: user.email,
        status: 'Active',
        availability: 'Available',
        highestBid: 0,
        unit: 'kg'
      };
      setProducts([...products, newProductData]);
      const savedProducts = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
      savedProducts.push(newProductData);
      localStorage.setItem('farmerProducts', JSON.stringify(savedProducts));
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
      const updatedProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      setProducts(updatedProducts);
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
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
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
            </div>
          </div>
        </div>

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

        {activeTab === 'products' && (
          <div>Products Tab Content Here</div>
        )}

        {activeTab === 'bids' && (
          <div>Bids Tab Content Here</div>
        )}

        {activeTab === 'orders' && (
          <div>Orders Tab Content Here</div>
        )}
      </div>
    </div>
  );
}

export default FarmerDashboard;
