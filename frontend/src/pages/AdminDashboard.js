import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import EmailNotification from '../components/EmailNotification';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [emailNotification, setEmailNotification] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allBids, setAllBids] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
    loadAllData();
    
    // Auto-refresh every 5 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      loadDashboard();
      if (activeSection !== 'dashboard') {
        loadAllData();
      }
    }, 5000);
    
    return () => clearInterval(refreshInterval);
  }, [activeSection]);

  const loadDashboard = async () => {
    try {
      console.log('Loading admin dashboard...');
      const [statsRes, usersRes, resetReqRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getPendingUsers(),
        adminAPI.getPasswordResetRequests()
      ]);
      
      console.log('Stats response:', statsRes.data);
      console.log('Pending users response:', usersRes.data);
      console.log('Password reset requests:', resetReqRes.data);
      
      const statsData = statsRes.data;
      const pendingList = usersRes.data || [];
      
      setStats({
        totalUsers: statsData.totalUsers || 0,
        activeUsers: statsData.activeUsers || 0,
        inactiveUsers: statsData.inactiveUsers || 0,
        passwordNotReset: statsData.usersNotResetPassword || 0,
        todayRegistrations: statsData.todayRegistrations || 0,
        weeklyGrowth: statsData.weeklyGrowth || [],
        userCategories: statsData.userCategories || {}
      });
      
      setPendingUsers(pendingList);
      setPasswordResetRequests(resetReqRes.data || []);
      console.log('Pending users count:', pendingList.length);
      console.log('Password reset requests count:', resetReqRes.data?.length || 0);
      
      setMessage('');
      setLoading(false);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      console.error('Error details:', err.response?.data || err.message);
      
      // Set default values to prevent infinite loading
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        passwordNotReset: 0,
        todayRegistrations: 0,
        weeklyGrowth: [],
        userCategories: {}
      });
      setPendingUsers([]);
      setPasswordResetRequests([]);
      
      setMessage('⚠️ Backend not responding. Please start backend: cd backend && mvn spring-boot:run');
      setLoading(false);
    }
  };

  const handleApprovePasswordReset = async (userId) => {
    try {
      setMessage('⏳ Processing password reset approval and sending email...');
      
      const response = await adminAPI.approvePasswordReset(userId);
      const data = response.data;
      
      if (data.emailSent) {
        const actualEmail = data.userRole === 'FARMER' ? 'preeths.252005@gmail.com' : 'paviii.061984@gmail.com';
        setMessage(`✅ Email sent to mailto:${actualEmail} with temporary password: ${data.tempPassword}`);
      } else {
        setMessage(`⚠️ Password reset approved but email failed. Temp password: ${data.tempPassword}`);
      }
      
      loadDashboard();
    } catch (err) {
      console.error('Password reset approval error:', err);
      setMessage('❌ Failed to approve password reset: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectPasswordReset = async (userId) => {
    try {
      const response = await adminAPI.rejectPasswordReset(userId);
      setMessage('✅ Password reset request rejected.');
      setTimeout(() => {
        loadDashboard();
        setMessage('');
      }, 3000);
    } catch (err) {
      setMessage('❌ Failed to reject password reset: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = async (userId) => {
    try {
      console.log('Approving user:', userId);
      const response = await adminAPI.approveUser(userId);
      console.log('Approve response:', response.data);
      
      const data = response.data;
      let msg = '✓ User approved successfully!';
      
      if (data.tempPassword) {
        msg += ` | Email: ${data.email} | Temp Password: ${data.tempPassword}`;
      }
      if (data.emailError) {
        msg += ` | ⚠️ Email Error: ${data.emailError}`;
      } else {
        msg += ' | Email sent successfully!';
      }
      
      setMessage(msg);
      setTimeout(() => {
        loadDashboard();
      }, 5000);
    } catch (err) {
      console.error('Approve error:', err);
      console.error('Error details:', err.response?.data || err.message);
      setMessage('✗ Failed to approve user: ' + (err.response?.data?.message || err.message));
    }
  };



  const handleApproveUser = async (userId) => {
    try {
      const users = JSON.parse(localStorage.getItem('agripulse_users') || '[]');
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, status: 'APPROVED' } : u
      );
      localStorage.setItem('agripulse_users', JSON.stringify(updatedUsers));
      
      setMessage('✓ User registration approved! User can now login.');
      setTimeout(() => {
        loadDashboard();
        setMessage('');
      }, 2000);
    } catch (err) {
      setMessage('✗ Failed to approve user.');
    }
  };

  const handleRejectUser = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        const users = JSON.parse(localStorage.getItem('agripulse_users') || '[]');
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('agripulse_users', JSON.stringify(updatedUsers));
        setMessage('✓ User rejected and removed.');
        setTimeout(() => {
          loadDashboard();
          setMessage('');
        }, 2000);
      } catch (err) {
        setMessage('✗ Failed to reject user.');
      }
    }
  };

  const loadAllData = async () => {
    try {
      const [productsRes, ordersRes, bidsRes] = await Promise.all([
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders(),
        adminAPI.getAllBids()
      ]);
      
      setAllProducts(productsRes.data || []);
      setAllOrders(ordersRes.data || []);
      setAllBids(bidsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      // Set empty arrays as fallback
      setAllProducts([]);
      setAllOrders([]);
      setAllBids([]);
    }
  };







  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <div className="dashboard">
      <div className="loading-spinner">Loading...</div>
    </div>
  );

  if (!stats) return (
    <div className="dashboard">
      <div style={{padding: '40px', textAlign: 'center'}}>
        <h2>⚠️ Unable to load dashboard</h2>
        <p>Backend is not responding. Please start the backend server.</p>
        <button onClick={loadDashboard} style={{marginTop: '20px', padding: '10px 20px'}}>Retry</button>
      </div>
    </div>
  );

  const COLORS = ['#1e3c72', '#2a5298', '#3d7ab5', '#7aa8d1'];
  const pieData = Object.entries(stats.userCategories).map(([name, value]) => ({ name, value }));

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div>
          <h2>🌾 Admin Dashboard</h2>
          <p style={{fontSize: '12px', color: '#999', marginTop: '5px'}}>Real-Time User Management & Approvals</p>
        </div>
        <div className="user-info">
          <span>👤Admin : PREETHI</span>
          <button 
            className="btn-refresh" 
            onClick={loadDashboard}
            title="Refresh dashboard data"
            style={{
              background: '#157ce3ff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginRight: '10px',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            🔄 Refresh
          </button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {message && (
        <div className={`dashboard-message ${message.includes('✓') ? 'success' : message.includes('⚠️') ? 'warning' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div style={{
        padding: '12px 20px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderLeft: '4px solid #3b82f6',
        margin: '0 20px 20px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#fcf8f8ff'
      }}>
        📊 Real-time tracking: Auto-refresh every 5 seconds | Last updated: {new Date().toLocaleTimeString()}
      </div>

      <div className="dashboard-content">
        {/* Top Stats Row */}
        <div style={{display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap'}}>
          <div className="stat-card" style={{flex: '1', minWidth: '200px'}}>
            <h3>👥 Total Users</h3>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Registered Users</div>
          </div>
          
          <div className="stat-card" style={{flex: '1', minWidth: '200px'}}>
            <h3>✅ Active Users</h3>
            <div className="stat-value" style={{color: '#10b981'}}>{stats.activeUsers}</div>
            <div className="stat-label">Currently Active</div>
          </div>
          
          <div className="stat-card" style={{flex: '1', minWidth: '200px', borderLeft: '5px solid #f59e0b'}}>
            <h3>⏳ Pending Approvals</h3>
            <div className="stat-value" style={{color: '#f59e0b'}}>{pendingUsers.length}</div>
            <div className="stat-label">Awaiting Review</div>
          </div>
          
          <div className="stat-card" style={{flex: '1', minWidth: '200px'}}>
            <h3>📝 Today's Registrations</h3>
            <div className="stat-value" style={{color: '#3b82f6'}}>{stats.todayRegistrations}</div>
            <div className="stat-label">New Registrations</div>
          </div>
        </div>

        <div className="dashboard-layout">
          {/* Left Sidebar - User Distribution */}
          <div className="dashboard-sidebar">
            <div style={{marginBottom: '20px'}}>
              <h3 style={{marginBottom: '20px', textAlign: 'center', color: '#a6a8abff'}}>👥 User Distribution</h3>
              
              <div className="stat-card" style={{marginBottom: '15px', background: '#f0fdf4', border: '2px solid #10b981'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontSize: '36px', marginBottom: '8px'}}>🚜</div>
                    <h4 style={{margin: '0', color: '#10b981', fontSize: '16px'}}>Farmers</h4>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '28px', fontWeight: 'bold', color: '#10b981'}}>{stats.userCategories?.FARMER || 0}</div>
                    <div style={{fontSize: '12px', color: '#666'}}>Registered</div>
                  </div>
                </div>
              </div>
              
              <div className="stat-card" style={{marginBottom: '20px', background: '#f0f9ff', border: '2px solid #3b82f6'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div>
                    <div style={{fontSize: '36px', marginBottom: '8px'}}>🏪</div>
                    <h4 style={{margin: '0', color: '#3b82f6', fontSize: '16px'}}>Retailers</h4>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '28px', fontWeight: 'bold', color: '#3b82f6'}}>{stats.userCategories?.RETAILER || 0}</div>
                    <div style={{fontSize: '12px', color: '#666'}}>Registered</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated Agricultural Theme */}
            <div style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '20px', borderRadius: '15px', textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
              <h4 style={{color: '#1e3c72', marginBottom: '15px', fontSize: '14px'}}>Agri-Pulse Platform</h4>
              
              {/* Floating Agricultural Elements */}
              <div style={{position: 'relative', height: '120px'}}>
                <div style={{position: 'absolute', top: '10px', left: '20px', fontSize: '24px', animation: 'float 3s ease-in-out infinite'}}>🌾</div>
                <div style={{position: 'absolute', top: '30px', right: '15px', fontSize: '20px', animation: 'float 3s ease-in-out infinite 0.5s'}}>🍅</div>
                <div style={{position: 'absolute', bottom: '20px', left: '15px', fontSize: '22px', animation: 'float 3s ease-in-out infinite 1s'}}>🥕</div>
                <div style={{position: 'absolute', bottom: '10px', right: '20px', fontSize: '18px', animation: 'float 3s ease-in-out infinite 1.5s'}}>🌽</div>
                <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '32px', animation: 'pulse 2s ease-in-out infinite'}}>🚜</div>
                <div style={{position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', fontSize: '16px', animation: 'float 3s ease-in-out infinite 2s'}}>🌱</div>
                <div style={{position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', fontSize: '14px', animation: 'float 3s ease-in-out infinite 2.5s'}}>🥬</div>
              </div>
              
              <div style={{marginTop: '10px', fontSize: '11px', color: '#666', fontStyle: 'italic'}}>
                Connecting Farmers & Retailers
              </div>
            </div>
          </div>

          {/* Right Content - Charts and Tables */}
          <div className="dashboard-main">
            <div className="chart-card">
              <h3>📈 Weekly Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.weeklyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#1e3c72" strokeWidth={3} dot={{fill: '#2a5298', r: 5}} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Registration Pending Approvals Section */}
            <div className="chart-card">
              <h3 style={{color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px'}}>
                📋 Registration Pending Approvals
                <span style={{background: '#f59e0b', color: 'white', fontSize: '12px', padding: '2px 8px', borderRadius: '12px'}}>
                  {pendingUsers.length}
                </span>
              </h3>
              {pendingUsers.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <div style={{fontSize: '48px', marginBottom: '10px'}}>✅</div>
                  <p style={{margin: '0', fontSize: '16px'}}>No pending registration requests</p>
                  <p style={{margin: '5px 0 0 0', fontSize: '14px', color: '#888'}}>All users have been reviewed</p>
                </div>
              ) : (
                <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                  {pendingUsers.map(user => (
                    <div key={user.id} style={{background: '#fefbf3', padding: '20px', marginBottom: '15px', borderRadius: '12px', border: '2px solid #fed7aa', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div style={{flex: 1}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
                            <h4 style={{margin: '0', color: '#1e3c72', fontSize: '18px'}}>{user.fullName}</h4>
                            <span style={{
                              background: user.role === 'FARMER' ? '#dcfce7' : '#dbeafe',
                              color: user.role === 'FARMER' ? '#166534' : '#1e40af',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              {user.role === 'FARMER' ? '🚜 Farmer' : '🏪 Retailer'}
                            </span>
                          </div>
                          <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>
                            📧 {user.email}
                          </p>
                          <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>
                            📱 {user.phone}
                          </p>
                          <p style={{margin: '0', fontSize: '14px', color: '#666'}}>
                            📍 {user.address}
                          </p>
                          {user.documentPath && (
                            <p style={{margin: '5px 0 0 0', fontSize: '12px', color: '#888'}}>
                              📄 Document: {user.documentPath}
                            </p>
                          )}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '20px'}}>
                          <button 
                            onClick={() => handleApproveUser(user.id)}
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            ✅ Approve
                          </button>
                          <button 
                            onClick={() => handleRejectUser(user.id)}
                            style={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div className="chart-card">
              <h3>📊 Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.weeklyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#2a5298" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Products and Orders Section */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px'}}>
          {/* Products Section */}
          <div className="stat-card">
            <h3 style={{color: '#10b981', marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #10b981', paddingBottom: '10px'}}>🌾 Products Management</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', textAlign: 'center'}}>
              <div style={{background: '#f0fdf4', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#10b981'}}>156</div>
                <div style={{fontSize: '11px', color: '#666'}}>Total</div>
              </div>
              <div style={{background: '#f0fdf4', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#10b981'}}>142</div>
                <div style={{fontSize: '11px', color: '#666'}}>Active</div>
              </div>
              <div style={{background: '#fef2f2', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#ef4444'}}>14</div>
                <div style={{fontSize: '11px', color: '#666'}}>Out Stock</div>
              </div>
              <div style={{background: '#f0f9ff', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#3b82f6'}}>₹45</div>
                <div style={{fontSize: '11px', color: '#666'}}>Avg Price</div>
              </div>
            </div>
            
            <div style={{marginBottom: '15px'}}>
              <h4 style={{fontSize: '14px', marginBottom: '10px', color: '#333'}}>📦 Recent Products</h4>
              <table style={{width: '100%', fontSize: '12px', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f9fafb'}}>
                    <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Product</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb'}}>Qty</th>
                    <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Farmer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>🍅 Tomato</td>
                    <td style={{padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f3f4f6'}}>50kg</td>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>Ramesh</td>
                  </tr>
                  <tr>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>🧅 Onion</td>
                    <td style={{padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f3f4f6'}}>100kg</td>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>Arjun</td>
                  </tr>
                  <tr>
                    <td style={{padding: '6px 8px'}}>🥔 Potato</td>
                    <td style={{padding: '6px 8px', textAlign: 'center'}}>75kg</td>
                    <td style={{padding: '6px 8px'}}>Ravi</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 style={{fontSize: '14px', marginBottom: '10px', color: '#333'}}>📊 Categories</h4>
              <div style={{display: 'flex', gap: '8px', fontSize: '11px'}}>
                <span style={{background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px'}}>🥬 Vegetables 45%</span>
                <span style={{background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '12px'}}>🍎 Fruits 30%</span>
                <span style={{background: '#e0e7ff', color: '#3730a3', padding: '4px 8px', borderRadius: '12px'}}>🌾 Grains 25%</span>
              </div>
            </div>
          </div>
          
          {/* Orders Section */}
          <div className="stat-card">
            <h3 style={{color: '#3b82f6', marginBottom: '20px', fontSize: '18px', borderBottom: '2px solid #3b82f6', paddingBottom: '10px'}}>📋 Orders Management</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', textAlign: 'center'}}>
              <div style={{background: '#f0f9ff', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#3b82f6'}}>89</div>
                <div style={{fontSize: '11px', color: '#666'}}>Total</div>
              </div>
              <div style={{background: '#f0fdf4', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#10b981'}}>12</div>
                <div style={{fontSize: '11px', color: '#666'}}>Today</div>
              </div>
              <div style={{background: '#fef3c7', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#f59e0b'}}>8</div>
                <div style={{fontSize: '11px', color: '#666'}}>Pending</div>
              </div>
              <div style={{background: '#f0fdf4', padding: '10px', borderRadius: '8px'}}>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#10b981'}}>76</div>
                <div style={{fontSize: '11px', color: '#666'}}>Complete</div>
              </div>
            </div>
            
            <div style={{marginBottom: '15px'}}>
              <h4 style={{fontSize: '14px', marginBottom: '10px', color: '#333'}}>🛒 Recent Orders</h4>
              <table style={{width: '100%', fontSize: '12px', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: '#f9fafb'}}>
                    <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Order ID</th>
                    <th style={{padding: '8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Retailer</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb'}}>Product</th>
                    <th style={{padding: '8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>#1021</td>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>Kannan</td>
                    <td style={{padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f3f4f6'}}>Tomato 30kg</td>
                    <td style={{padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f3f4f6'}}>
                      <span style={{background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '8px', fontSize: '10px'}}>Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>#1020</td>
                    <td style={{padding: '6px 8px', borderBottom: '1px solid #f3f4f6'}}>Meera</td>
                    <td style={{padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f3f4f6'}}>Onion 50kg</td>
                    <td style={{padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f3f4f6'}}>
                      <span style={{background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '8px', fontSize: '10px'}}>Accepted</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{padding: '6px 8px'}}>#1019</td>
                    <td style={{padding: '6px 8px'}}>Akash</td>
                    <td style={{padding: '6px 8px', textAlign: 'center'}}>Wheat 5 bags</td>
                    <td style={{padding: '6px 8px', textAlign: 'center'}}>
                      <span style={{background: '#d1fae5', color: '#065f46', padding: '2px 6px', borderRadius: '8px', fontSize: '10px'}}>Delivered</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>



        {/* Password Reset Requests Section */}
        <div className="pending-users">
          <div className="pending-header">
            <h3 style={{color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px'}}>
              🔐 Password Reset Requests 
              <span style={{background: '#dc2626', color: 'white', fontSize: '14px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600'}}>
                {passwordResetRequests.length}
              </span>
            </h3>
          </div>
          
          {passwordResetRequests.length === 0 ? (
            <div className="no-pending" style={{textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #d1d5db'}}>
              <div style={{fontSize: '48px', marginBottom: '15px'}}>✅</div>
              <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Password Reset Requests</h4>
              <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>All password reset requests have been processed</p>
            </div>
          ) : (
            <div className="users-list" style={{display: 'grid', gap: '20px'}}>
              {passwordResetRequests.map(request => (
                <div key={request.id} className="user-card" style={{
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '2px solid #fca5a5',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                  borderLeft: '6px solid #dc2626',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="user-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                        <h4 style={{margin: '0', color: '#1e3c72', fontSize: '20px', fontWeight: '700'}}>{request.fullName}</h4>
                        <span style={{
                          background: request.role === 'FARMER' ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                          color: request.role === 'FARMER' ? '#166534' : '#1e40af',
                          padding: '6px 14px',
                          borderRadius: '25px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: request.role === 'FARMER' ? '1px solid #10b981' : '1px solid #3b82f6'
                        }}>
                          {request.role === 'FARMER' ? '🚜 Farmer' : '🏪 Retailer'}
                        </span>
                      </div>
                      <span className="status-badge" style={{
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>⏳ RESET REQUEST</span>
                    </div>
                  </div>
                  
                  <div className="user-details" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                    <div className="detail-row" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span className="label" style={{color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>📧 Email:</span>
                      <span className="value" style={{color: '#374151', fontSize: '14px', fontWeight: '600'}}>{request.email}</span>
                    </div>
                    <div className="detail-row" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span className="label" style={{color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>📅 Request Date:</span>
                      <span className="value" style={{color: '#374151', fontSize: '14px', fontWeight: '600'}}>{new Date(request.requestDate).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="user-actions" style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                    <button 
                      className="btn-approve" 
                      onClick={() => handleApprovePasswordReset(request.id)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      ✅ Approve & Send Temp Password
                    </button>
                    <button 
                      className="btn-reject" 
                      onClick={() => handleRejectPasswordReset(request.id)}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                      }}
                    >
                      ❌ Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registration Pending Approvals Section */}
        <div className="pending-users" style={{marginTop: '30px'}}>
          <div className="pending-header">
            <h3 style={{color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px'}}>
              📋 Registration Pending Approvals 
              <span style={{background: '#f59e0b', color: 'white', fontSize: '14px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600'}}>
                {pendingUsers.length}
              </span>
            </h3>
          </div>
          
          {pendingUsers.length === 0 ? (
            <div className="no-pending" style={{textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #d1d5db'}}>
              <div style={{fontSize: '48px', marginBottom: '15px'}}>✅</div>
              <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Pending Registration Requests</h4>
              <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>All user registrations have been reviewed and processed</p>
            </div>
          ) : (
            <div className="users-list" style={{display: 'grid', gap: '20px'}}>
              {pendingUsers.map(user => (
                <div key={user.id} className="user-card" style={{
                  background: 'linear-gradient(135deg, #fefbf3 0%, #fef7ed 100%)',
                  border: '2px solid #fed7aa',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
                  borderLeft: '6px solid #f59e0b',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="user-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                        <h4 style={{margin: '0', color: '#1e3c72', fontSize: '20px', fontWeight: '700'}}>{user.fullName}</h4>
                        <span style={{
                          background: user.role === 'FARMER' ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                          color: user.role === 'FARMER' ? '#166534' : '#1e40af',
                          padding: '6px 14px',
                          borderRadius: '25px',
                          fontSize: '13px',
                          fontWeight: '600',
                          border: user.role === 'FARMER' ? '1px solid #10b981' : '1px solid #3b82f6'
                        }}>
                          {user.role === 'FARMER' ? '🚜 Farmer' : '🏪 Retailer'}
                        </span>
                      </div>
                      <span className="status-badge" style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>⏳ PENDING APPROVAL</span>
                    </div>
                  </div>
                  
                  <div className="user-details" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                    <div className="detail-row" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span className="label" style={{color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>📧 Email:</span>
                      <span className="value" style={{color: '#374151', fontSize: '14px', fontWeight: '600'}}>{user.email}</span>
                    </div>
                    <div className="detail-row" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span className="label" style={{color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>📱 Phone:</span>
                      <span className="value" style={{color: '#374151', fontSize: '14px', fontWeight: '600'}}>{user.phone}</span>
                    </div>
                    <div className="detail-row" style={{display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2'}}>
                      <span className="label" style={{color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>📍 Address:</span>
                      <span className="value" style={{color: '#374151', fontSize: '14px', fontWeight: '600'}}>{user.address}</span>
                    </div>
                    {user.documentPath && (
                      <div className="detail-row" style={{display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2'}}>
                        <span className="label" style={{color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>📄 Document:</span>
                        <span className="value" style={{color: '#374151', fontSize: '14px', fontWeight: '600'}}>{user.documentPath}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="user-actions" style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                    <button 
                      className="btn-approve" 
                      onClick={() => handleApproveUser(user.id)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                       Approve Registration
                    </button>
                    <button 
                      className="btn-reject" 
                      onClick={() => handleRejectUser(user.id)}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                      }}
                    >
                       Reject Registration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product and Order Management Buttons */}
        <div style={{display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center'}}>
          <button 
            onClick={() => setActiveSection('products')}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '15px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
            }}
          >
            🌾 Products Listed
          </button>
          
          <button 
            onClick={() => setActiveSection('orders')}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '15px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(6, 182, 212, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.3)';
            }}
          >
            📦 Orders Placed
          </button>
          
          <button 
            onClick={() => setActiveSection('bids')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '15px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
            }}
          >
            💰 Bidding Process
          </button>
        </div>

        {/* Products Listed Section */}
        {activeSection === 'products' && (
          <div style={{marginTop: '30px', background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', padding: '30px', borderRadius: '20px', border: '2px solid #8b5cf6'}}>
            <h3 style={{color: '#6b21a8', fontSize: '24px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              🌾 All Products Listed by Farmers
            </h3>
            <div style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white'}}>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏷️ Product</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📂 Category</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>👨🌾 Farmer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📍 Location</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📊 Quantity</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>💰 Price</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🚚 Delivery</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📈 Status</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📅 Listed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((product, index) => (
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
                      <td style={{padding: '15px 12px', color: '#334155'}}>{new Date(product.createdDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allProducts.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>🌾</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Products Listed</h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>Products will appear here when farmers list them</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Placed Section */}
        {activeSection === 'orders' && (
          <div style={{marginTop: '30px', background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)', padding: '30px', borderRadius: '20px', border: '2px solid #06b6d4'}}>
            <h3 style={{color: '#0e7490', fontSize: '24px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              📦 All Orders Placed by Retailers
            </h3>
            <div style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: 'white'}}>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏷️ Product</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>👨🌾 Farmer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏪 Retailer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📊 Quantity</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>💰 Total Amount</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📈 Status</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📅 Order Date</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🔄 Modified Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order, index) => (
                    <tr key={order.id} style={{borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? 'white' : '#fafbfc'}}>
                      <td style={{padding: '15px 12px', color: '#334155', fontWeight: '500'}}>{order.productName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{order.farmerName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{order.retailerName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{order.quantity}</td>
                      <td style={{padding: '15px 12px', color: '#10b981', fontWeight: '600'}}>₹{order.totalAmount}</td>
                      <td style={{padding: '15px 12px'}}>
                        <span style={{background: order.status === 'PENDING' ? '#fef3c7' : order.status === 'CONFIRMED' ? '#dcfce7' : '#fef2f2', color: order.status === 'PENDING' ? '#92400e' : order.status === 'CONFIRMED' ? '#166534' : '#991b1b', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500'}}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{order.modifiedDate ? new Date(order.modifiedDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allOrders.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Orders Placed</h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>Orders will appear here when retailers place them</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bidding Process Section */}
        {activeSection === 'bids' && (
          <div style={{marginTop: '30px', background: 'linear-gradient(135deg, #fef7cd 0%, #fbbf24 100%)', padding: '30px', borderRadius: '20px', border: '2px solid #f59e0b'}}>
            <h3 style={{color: '#92400e', fontSize: '24px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
              💰 All Bidding Process Activities
            </h3>
            <div style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white'}}>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏷️ Product</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>👨🌾 Farmer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>🏪 Retailer</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>💰 Bid Amount</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📊 Quantity</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📈 Status</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>📅 Bid Date</th>
                    <th style={{padding: '15px 12px', fontWeight: '600', fontSize: '14px'}}>⏰ Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allBids.map((bid, index) => (
                    <tr key={bid.id} style={{borderBottom: '1px solid #f1f5f9', background: index % 2 === 0 ? 'white' : '#fafbfc'}}>
                      <td style={{padding: '15px 12px', color: '#334155', fontWeight: '500'}}>{bid.productName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{bid.farmerName}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{bid.retailerName}</td>
                      <td style={{padding: '15px 12px', color: '#10b981', fontWeight: '600'}}>₹{bid.bidAmount}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{bid.quantity}</td>
                      <td style={{padding: '15px 12px'}}>
                        <span style={{background: bid.status === 'ACTIVE' ? '#dbeafe' : bid.status === 'ACCEPTED' ? '#dcfce7' : '#fef2f2', color: bid.status === 'ACTIVE' ? '#1e40af' : bid.status === 'ACCEPTED' ? '#166534' : '#991b1b', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500'}}>
                          {bid.status}
                        </span>
                      </td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{new Date(bid.bidDate).toLocaleDateString()}</td>
                      <td style={{padding: '15px 12px', color: '#334155'}}>{bid.expiryDate ? new Date(bid.expiryDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allBids.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px 20px'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>💰</div>
                  <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Bids Placed</h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>Bids will appear here when retailers place them</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
      
      {/* Email Notification Popup */}
      {emailNotification && (
        <EmailNotification 
          emailData={emailNotification}
          onClose={() => {
            setEmailNotification(null);
            setMessage('');
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
