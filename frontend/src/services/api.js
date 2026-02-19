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
    
    const productData = {
      name: data.name?.trim(),
      category: data.category?.trim() || 'General',
      quantity: parseFloat(data.quantity) || 0,
      unit: data.unit || 'kg',
      basePrice: parseFloat(data.basePrice) || 0,
      minBidPrice: data.minBidPrice ? parseFloat(data.minBidPrice) : null,
      harvestDate: data.harvestDate || null,
      deliveryArea: data.deliveryArea?.trim() || null,
      imagePath: data.imagePath || '',
      bidEndDate: data.bidEndDate || null,
      farmerEmail: data.farmerEmail?.trim(),
      status: 'Active',
      availability: 'Available'
    };
    
    console.log('🌐 API: Processed data:', productData);
    
    return fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(productData)
    })
    .then(res => {
      console.log('🌐 API: Response status:', res.status);
      if (!res.ok) {
        return res.text().then(text => {
          console.error('🌐 API: Error response:', text);
          throw new Error(`Backend error: ${res.status} - ${text}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log('🌐 API: Success response:', data);
      return { data };
    })
    .catch(err => {
      console.error('🌐 API: Request failed:', err);
      if (err.message.includes('Failed to fetch')) {
        throw new Error('❌ Backend not running! Please start backend with: mvn spring-boot:run');
      }
      throw err;
    });
  },
  getFarmerProducts: (email) => {
    console.log('🌐 API: Getting farmer products for:', email);
    return fetch(`${API_BASE_URL}/products/farmer/${email}`, {
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      console.log('🌐 API: Response status:', res.status);
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('🌐 API: Products received:', data);
      return { data: Array.isArray(data) ? data : [] };
    })
    .catch(err => {
      console.error('🌐 API: Error:', err);
      if (err.message.includes('Failed to fetch')) {
        throw new Error('❌ Backend not running!');
      }
      throw err;
    });
  },
  getAllProducts: () => {
    console.log('🌐 API: Getting all products');
    return fetch(`${API_BASE_URL}/products`, {
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('🌐 API: All products:', data?.length || 0);
      return { data: Array.isArray(data) ? data : [] };
    })
    .catch(err => {
      console.error('🌐 API: Error:', err);
      if (err.message.includes('Failed to fetch')) {
        throw new Error('❌ Backend not running!');
      }
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
  pauseProduct: (id) => {
    return fetch(`${API_BASE_URL}/products/${id}/pause`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(data => ({ data }));
  },
  resumeProduct: (id) => {
    return fetch(`${API_BASE_URL}/products/${id}/resume`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(data => ({ data }));
  },
};

export const bidAPI = {
  placeBid: (data) => {
    console.log('🌐 API: Placing bid with data:', data);
    return fetch(`${API_BASE_URL}/bids/place`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      console.log('🌐 API: Response status:', res.status);
      if (!res.ok) {
        return res.text().then(text => {
          console.error('🌐 API: Error response:', text);
          throw new Error(`Failed to place bid: ${res.status}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log('🌐 API: Bid placed successfully:', data);
      return { data };
    })
    .catch(err => {
      console.error('🌐 API: Error placing bid:', err);
      throw err;
    });
  },
  getProductBids: (productId) => {
    return fetch(`${API_BASE_URL}/bids/product/${productId}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  getFarmerBids: (email) => {
    return fetch(`${API_BASE_URL}/bids/farmer/${email}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  getRetailerBids: (email) => {
    return fetch(`${API_BASE_URL}/bids/retailer/${email}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  getDailyHighestBids: (productId) => {
    return fetch(`${API_BASE_URL}/bids/daily-highest/${productId}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  acceptBid: (bidId) => {
    return fetch(`${API_BASE_URL}/bids/accept/${bidId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(data => ({ data }));
  },
  getHighestBid: (productId) => {
    return fetch(`${API_BASE_URL}/bids/highest/${productId}`)
      .then(res => res.json())
      .then(data => ({ data }));
  },
  confirmOrder: (bidId) => {
    console.log('🌐 API: Farmer confirming order from bid:', bidId);
    return fetch(`${API_BASE_URL}/bids/confirm-order/${bidId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Order confirmed and email sent:', data);
      return { data };
    })
    .catch(err => {
      console.error('❌ Error confirming order:', err);
      throw err;
    });
  },
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
  createOrder: (bidId, productId) => {
    console.log('🌐 API: Creating order from bid:', { bidId, productId });
    return fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bidId, productId })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Order created:', data);
      return { data };
    })
    .catch(err => {
      console.error('❌ Error creating order:', err);
      throw err;
    });
  },
  confirmOrder: (orderId, otp) => {
    console.log('🌐 API: Confirming order:', orderId);
    return fetch(`${API_BASE_URL}/orders/${orderId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Order confirmed:', data);
      return { data };
    })
    .catch(err => {
      console.error('❌ Error confirming order:', err);
      throw err;
    });
  },
  payOrder: (orderId, paymentMethod) => {
    console.log('🌐 API: Processing payment for order:', orderId);
    return fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Payment processed:', data);
      return { data };
    })
    .catch(err => {
      console.error('❌ Error processing payment:', err);
      throw err;
    });
  },
  completeOrder: (orderId) => {
    console.log('🌐 API: Completing order:', orderId);
    return fetch(`${API_BASE_URL}/orders/${orderId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Order completed:', data);
      return { data };
    })
    .catch(err => {
      console.error('❌ Error completing order:', err);
      throw err;
    });
  },
  getFarmerOrders: (email) => {
    console.log('🌐 API: Getting farmer orders for:', email);
    return fetch(`${API_BASE_URL}/orders/farmer/${email}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Farmer orders:', data);
        return { data: Array.isArray(data) ? data : [] };
      })
      .catch(err => {
        console.error('❌ Error fetching farmer orders:', err);
        throw err;
      });
  },
  getRetailerOrders: (email) => {
    console.log('🌐 API: Getting retailer orders for:', email);
    return fetch(`${API_BASE_URL}/orders/retailer/${email}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Retailer orders:', data);
        return { data: Array.isArray(data) ? data : [] };
      })
      .catch(err => {
        console.error('❌ Error fetching retailer orders:', err);
        throw err;
      });
  },
  getOrder: (orderId) => {
    console.log('🌐 API: Getting order:', orderId);
    return fetch(`${API_BASE_URL}/orders/${orderId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Order details:', data);
        return { data };
      })
      .catch(err => {
        console.error('❌ Error fetching order:', err);
        throw err;
      });
  },
};

export const transactionAPI = {
  createTransaction: (orderId) => {
    console.log('🌐 API: Creating transaction for order:', orderId);
    return fetch(`${API_BASE_URL}/transactions/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Transaction created:', data);
      return { data };
    })
    .catch(err => {
      console.error('❌ Error creating transaction:', err);
      throw err;
    });
  },
  processTransaction: (transactionId, paymentMethod, paymentTransactionId) => {
    console.log('🌐 API: Processing transaction:', transactionId);
    return fetch(`${API_BASE_URL}/transactions/${transactionId}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethod, paymentTransactionId })
    })
    .then(res => {
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('✅ Transaction processed:', data);
      return { data };
    })
    .catch(err => {
      console.error('❌ Error processing transaction:', err);
      throw err;
    });
  },
  getFarmerTransactions: (email) => {
    console.log('🌐 API: Getting farmer transactions for:', email);
    return fetch(`${API_BASE_URL}/transactions/farmer/${email}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Farmer transactions:', data);
        return { data: Array.isArray(data) ? data : [] };
      })
      .catch(err => {
        console.error('❌ Error fetching farmer transactions:', err);
        throw err;
      });
  },
  getRetailerTransactions: (email) => {
    console.log('🌐 API: Getting retailer transactions for:', email);
    return fetch(`${API_BASE_URL}/transactions/retailer/${email}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Retailer transactions:', data);
        return { data: Array.isArray(data) ? data : [] };
      })
      .catch(err => {
        console.error('❌ Error fetching retailer transactions:', err);
        throw err;
      });
  },
  getTransaction: (transactionId) => {
    console.log('🌐 API: Getting transaction:', transactionId);
    return fetch(`${API_BASE_URL}/transactions/${transactionId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Transaction details:', data);
        return { data };
      })
      .catch(err => {
        console.error('❌ Error fetching transaction:', err);
        throw err;
      });
  },
};

export default { authAPI, userAPI, productAPI, bidAPI, orderAPI, transactionAPI, adminAPI };
