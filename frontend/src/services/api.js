import { mockAPI } from './mockApi';

const API_BASE_URL = 'http://localhost:8080/api';

export const authAPI = {
  register: (data) => mockAPI.register(data),
  login: (data) => mockAPI.login(data),
  forgotPassword: (email) => mockAPI.forgotPassword(email),
  updatePassword: (email, newPassword) => mockAPI.updatePassword(email, newPassword),
  resetPassword: (data) => Promise.resolve({ data: { message: 'Mock reset password', success: true } }),
};

export const userAPI = {
  getDashboard: (email) => mockAPI.getUserDashboard(email),
};

export const productAPI = {
  addProduct: (data) => {
    console.log('🌐 API: Sending POST to /products with:', data);
    console.log('🌐 API: Full URL:', `${API_BASE_URL}/products`);
    return fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        quantity: parseFloat(data.quantity),
        unit: data.unit,
        price: parseFloat(data.price),
        availability: data.availability,
        location: data.location,
        farmerEmail: data.farmerEmail,
        imagePath: data.imagePath,
        deliveryDays: data.deliveryDays ? parseInt(data.deliveryDays) : 7,
        bidTimeframeDays: 7,
        category: 'General'
      })
    })
    .then(res => {
      console.log('🌐 API: POST response status:', res.status, res.statusText);
      console.log('🌐 API: Response headers:', res.headers);
      if (!res.ok) {
        console.error('🌐 API: Response not OK:', res.status);
        return res.text().then(text => {
          console.error('🌐 API: Error response body:', text);
          throw new Error(`Server error: ${res.status} ${text}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log('🌐 API: POST response data received:', data);
      if (!data) {
        throw new Error('Empty response from server');
      }
      return { data };
    })
    .catch(err => {
      console.error('🌐 API: POST error:', err);
      console.error('🌐 API: Error message:', err.message);
      throw err;
    });
  },
  getFarmerProducts: (email) => {
    console.log('🌐 API: Sending GET to /products/farmer/' + email);
    console.log('🌐 API: Full URL:', `${API_BASE_URL}/products/farmer/${email}`);
    return fetch(`${API_BASE_URL}/products/farmer/${email}`)
      .then(res => {
        console.log('🌐 API: GET response status:', res.status, res.statusText);
        if (!res.ok) {
          console.error('🌐 API: Response not OK:', res.status);
          return res.text().then(text => {
            console.error('🌐 API: Error response body:', text);
            throw new Error(`Server error: ${res.status} ${text}`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('🌐 API: GET response data received:', data);
        // Handle case where backend returns array directly
        const productsArray = Array.isArray(data) ? data : (data?.data || []);
        console.log('🌐 API: Products array:', productsArray);
        return { data: productsArray };
      })
      .catch(err => {
        console.error('🌐 API: GET error:', err);
        console.error('🌐 API: GET error message:', err.message);
        throw err;
      });
  },
  getAllProducts: () => {
    console.log('🌐 API: Sending GET to /products');
    return fetch(`${API_BASE_URL}/products`)
      .then(res => {
        console.log('🌐 API: GET /products response status:', res.status);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('🌐 API: GET /products response data:', data);
        const productsArray = Array.isArray(data) ? data : (data?.data || []);
        return { data: productsArray };
      })
      .catch(err => {
        console.error('🌐 API: GET /products error:', err);
        throw err;
      });
  },
  searchProducts: (params) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/products/search?${query}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  updateProduct: (id, data) => {
    return fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => ({ data }));
  },
  deleteProduct: (id) => {
    return fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(data => ({ data }));
  },
};

export const bidAPI = {
  placeBid: (data) => Promise.resolve({ data: { message: 'Bid placed', success: true } }),
  getProductBids: (productId) => Promise.resolve({ data: [] }),
  getFarmerBids: (email) => {
    return fetch(`${API_BASE_URL}/bids/farmer/${email}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  getRetailerBids: (email) => Promise.resolve({ data: [] }),
  getDailyHighestBids: (productId) => Promise.resolve({ data: [] }),
  acceptBid: (bidId) => Promise.resolve({ data: { message: 'Bid accepted', success: true } }),
};

export const adminAPI = {
  getPendingUsers: () => mockAPI.getPendingUsers(),
  approveUser: (userId) => mockAPI.approveUser(userId),
  getDashboardStats: () => mockAPI.getDashboardStats(),
  getPasswordResetRequests: () => mockAPI.getPasswordResetRequests(),
  approvePasswordReset: (userId) => mockAPI.approvePasswordReset(userId),
  rejectPasswordReset: (userId) => mockAPI.rejectPasswordReset(userId),
  getAllProducts: () => {
    console.log('🌐 API: Admin fetching all products');
    return fetch(`${API_BASE_URL}/products`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const productsArray = Array.isArray(data) ? data : (data?.data || []);
        return { data: productsArray };
      })
      .catch(err => {
        console.error('🌐 API: Admin getAllProducts error:', err);
        throw err;
      });
  },
  getAllOrders: () => Promise.resolve({ data: [] }),
  getAllBids: () => Promise.resolve({ data: [] }),
};

export const orderAPI = {
  placeOrder: (data) => Promise.resolve({ data: { message: 'Order placed', success: true } }),
  getFarmerOrders: (email) => {
    return fetch(`${API_BASE_URL}/orders/farmer/${email}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  getRetailerOrders: (email) => Promise.resolve({ data: [] }),
  updateOrder: (id, data) => Promise.resolve({ data: { message: 'Order updated', success: true } }),
  cancelOrder: (id) => Promise.resolve({ data: { message: 'Order cancelled', success: true } }),
};

export default {};
