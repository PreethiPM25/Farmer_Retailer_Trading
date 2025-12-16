// Mock API using localStorage
import { sendEmailJS } from './emailJSService';

const USERS_KEY = 'agripulse_users';
const STATS_KEY = 'agripulse_stats';

// Initialize default data
const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers = [
      {
        id: 1,
        email: 'pmpreethi25@gmail.com',
        fullName: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE',
        passwordReset: true,
        password: 'admin123'
      },
      {
        id: 2,
        email: 'preeths.252005@gmail.com',
        fullName: 'Preethi Farmer',
        role: 'FARMER',
        status: 'APPROVED',
        passwordReset: true,
        password: 'farmer123',
        phone: '9876543210',
        address: 'Farm Address, Village'
      },
      {
        id: 3,
        email: 'paviii.061984@gmail.com',
        fullName: 'Pavi Retailer',
        role: 'RETAILER',
        status: 'APPROVED',
        passwordReset: true,
        password: 'retailer123',
        phone: '9876543211',
        address: 'Shop Address, City'
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

const getUsers = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const mockAPI = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        
        // Check duplicate email
        if (users.find(u => u.email === data.email)) {
          reject({ response: { data: { message: 'Email already registered. Please use a different email or login.' } } });
          return;
        }
        
        const newUser = {
          id: Date.now(),
          ...data,
          status: 'PENDING',
          passwordReset: false,
          passwordResetRequested: false,
          passwordResetStatus: 'NONE'
        };
        
        users.push(newUser);
        saveUsers(users);
        
        resolve({ data: { message: 'Registration successful! Admin will review your request.', success: true } });
      }, 500);
    });
  },

  login: (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.email === data.email);
        
        if (!user) {
          reject({ response: { data: { message: 'User not found' } } });
          return;
        }
        
        if (user.status === 'PENDING') {
          reject({ response: { data: { message: 'Account pending admin approval' } } });
          return;
        }
        
        // Check if user has temporary password
        if (user.tempPassword && data.password === user.tempPassword) {
          resolve({
            data: {
              token: 'mock-jwt-token',
              role: user.role,
              email: user.email,
              fullName: user.fullName,
              passwordReset: false,
              status: user.status,
              requiresPasswordReset: true
            }
          });
          return;
        }
        
        // Regular password check
        if (data.password !== user.password) {
          reject({ response: { data: { message: 'Invalid credentials' } } });
          return;
        }
        
        resolve({
          data: {
            token: 'mock-jwt-token',
            role: user.role,
            email: user.email,
            fullName: user.fullName,
            passwordReset: user.passwordReset,
            status: user.status
          }
        });
      }, 500);
    });
  },

  getPendingUsers: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const pending = users.filter(u => u.status === 'PENDING');
        resolve({ data: pending });
      }, 300);
    });
  },

  approveUser: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.id == userId);
        if (user) {
          user.status = 'APPROVED';
          saveUsers(users);
        }
        resolve({ data: { message: 'User approved successfully!', success: true } });
      }, 300);
    });
  },

  getDashboardStats: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const farmers = users.filter(u => u.role === 'FARMER').length;
        const retailers = users.filter(u => u.role === 'RETAILER').length;
        
        resolve({
          data: {
            totalUsers: users.length - 1,
            activeUsers: users.filter(u => u.status === 'ACTIVE' || u.status === 'APPROVED').length,
            inactiveUsers: 0,
            usersNotResetPassword: 0,
            todayRegistrations: 0,
            weeklyGrowth: [
              { day: 'Mon', count: 2 },
              { day: 'Tue', count: 1 },
              { day: 'Wed', count: 3 },
              { day: 'Thu', count: 2 },
              { day: 'Fri', count: 4 },
              { day: 'Sat', count: 1 },
              { day: 'Sun', count: 2 }
            ],
            userCategories: { FARMER: farmers, RETAILER: retailers }
          }
        });
      }, 300);
    });
  },

  getUserDashboard: (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
          reject({ response: { data: { message: 'User not found' } } });
          return;
        }
        
        resolve({
          data: {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            lastLogin: '2024-01-15T10:30:00',
            registrationDate: '2024-01-10T09:00:00',
            passwordReset: user.passwordReset
          }
        });
      }, 300);
    });
  },

  forgotPassword: (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
          reject({ response: { data: { message: 'User not found with this email' } } });
          return;
        }
        
        // Add password reset request to user
        const updatedUsers = users.map(u => 
          u.email === email ? { 
            ...u, 
            passwordResetRequested: true, 
            passwordResetDate: new Date().toISOString(),
            passwordResetStatus: 'REQUESTED'
          } : u
        );
        saveUsers(updatedUsers);
        
        resolve({
          data: {
            message: 'Password reset request sent to admin. Please wait for approval.',
            success: true
          }
        });
      }, 500);
    });
  },

  getPasswordResetRequests: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const resetRequests = users
          .filter(u => u.passwordResetRequested && u.passwordResetStatus === 'REQUESTED')
          .map(u => ({
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            role: u.role,
            requestDate: u.passwordResetDate
          }));
        
        resolve({ data: resetRequests });
      }, 300);
    });
  },

  approvePasswordReset: async (userId) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const users = getUsers();
        const user = users.find(u => u.id === userId);
        const tempPassword = 'Temp' + Math.random().toString(36).substring(2, 8);
        
        const updatedUsers = users.map(u => 
          u.id === userId ? { 
            ...u, 
            passwordResetRequested: false,
            passwordResetStatus: 'APPROVED',
            tempPassword: tempPassword
          } : u
        );
        saveUsers(updatedUsers);
        
        // Send email using EmailJS service
        try {
          const emailResult = await sendEmailJS(user.email, user.fullName, tempPassword);
          
          if (emailResult.success) {
            resolve({
              data: {
                message: `✅ Email sent successfully to ${user.email}`,
                success: true,
                tempPassword: tempPassword,
                userEmail: user.email,
                userName: user.fullName,
                userRole: user.role,
                emailSent: true
              }
            });
          } else {
            resolve({
              data: {
                message: `⚠️ Email failed to send. Temp password: ${tempPassword}`,
                success: true,
                tempPassword: tempPassword,
                userEmail: user.email,
                emailSent: false,
                emailError: emailResult.error
              }
            });
          }
        } catch (error) {
          resolve({
            data: {
              message: `⚠️ Email sending failed. Temp password: ${tempPassword}`,
              success: true,
              tempPassword: tempPassword,
              userEmail: user.email,
              emailSent: false,
              emailError: error.message
            }
          });
        }
      }, 300);
    });
  },

  rejectPasswordReset: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const updatedUsers = users.map(u => 
          u.id === userId ? { 
            ...u, 
            passwordResetRequested: false,
            passwordResetStatus: 'REJECTED'
          } : u
        );
        saveUsers(updatedUsers);
        
        resolve({
          data: {
            message: 'Password reset request rejected.',
            success: true
          }
        });
      }, 300);
    });
  },

  updatePassword: (email, newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const updatedUsers = users.map(u => 
          u.email === email ? { 
            ...u, 
            password: newPassword,
            passwordReset: true,
            tempPassword: null
          } : u
        );
        saveUsers(updatedUsers);
        
        resolve({
          data: {
            message: 'Password updated successfully!',
            success: true
          }
        });
      }, 300);
    });
  }
};