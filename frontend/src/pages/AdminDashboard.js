import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getPendingUsers()
      ]);
      setStats(statsRes.data);
      setPendingUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await adminAPI.approveUser(userId);
      loadDashboard();
      alert('User approved successfully!');
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!stats) return <div>Loading...</div>;

  const COLORS = ['#0f766e', '#059669', '#10b981', '#34d399'];
  const pieData = Object.entries(stats.userCategories).map(([name, value]) => ({ name, value }));

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h2>🌾 Admin Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {user?.fullName}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Registered</div>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">Currently Active</div>
          </div>
          <div className="stat-card">
            <h3>Inactive Users</h3>
            <div className="stat-value">{stats.inactiveUsers}</div>
            <div className="stat-label">Not Active</div>
          </div>
          <div className="stat-card">
            <h3>Password Not Reset</h3>
            <div className="stat-value">{stats.usersNotResetPassword}</div>
            <div className="stat-label">Pending Action</div>
          </div>
          <div className="stat-card">
            <h3>Today's Registrations</h3>
            <div className="stat-value">{stats.todayRegistrations}</div>
            <div className="stat-label">New Today</div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h3>Weekly Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.weeklyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0f766e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>User Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label outerRadius={100} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Registration Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.weeklyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pending-users">
          <h3>Pending User Approvals ({pendingUsers.length})</h3>
          {pendingUsers.length === 0 ? (
            <p>No pending approvals</p>
          ) : (
            pendingUsers.map(user => (
              <div key={user.id} className="user-card">
                <h4>{user.fullName}</h4>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Document:</strong> {user.documentPath || 'Not provided'}</p>
                <button className="btn-approve" onClick={() => handleApprove(user.id)}>
                  Approve User
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
