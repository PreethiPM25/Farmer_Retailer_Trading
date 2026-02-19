// Bidding and Orders Management Service
// This handles all bid and order related logic

const biddingService = {
  // Store for managing bids in memory (can be replaced with backend)
  bidsStorage: new Map(),
  ordersStorage: new Map(),
  
  // Initialize with some mock orders for demo
  initializeMockData: () => {
    // Initialize mock bids for products with realistic 1000-5000 range
    const mockBids = [
      // Product 1 - Premium Basmati Rice
      {
        id: 'bid_1001',
        productId: 1,
        retailerEmail: 'ravi@retail.com',
        retailerName: 'Ravi Kumar',
        bidAmount: 3200,
        timestamp: new Date('2024-01-19T09:15:00'),
        status: 'pending'
      },
      {
        id: 'bid_1002', 
        productId: 1,
        retailerEmail: 'hasini@retail.com',
        retailerName: 'Hasini Reddy',
        bidAmount: 4100,
        timestamp: new Date('2024-01-19T10:30:00'),
        status: 'pending'
      },
      {
        id: 'bid_1003',
        productId: 1,
        retailerEmail: 'nithish@retail.com', 
        retailerName: 'Nithish Sharma',
        bidAmount: 4850,
        timestamp: new Date('2024-01-19T11:45:00'),
        status: 'pending'
      },
      // Product 2 - Organic Wheat
      {
        id: 'bid_2001',
        productId: 2,
        retailerEmail: 'ravi@retail.com',
        retailerName: 'Ravi Kumar',
        bidAmount: 2800,
        timestamp: new Date('2024-01-18T14:20:00'),
        status: 'pending'
      },
      {
        id: 'bid_2002',
        productId: 2,
        retailerEmail: 'hasini@retail.com',
        retailerName: 'Hasini Reddy', 
        bidAmount: 3500,
        timestamp: new Date('2024-01-18T15:10:00'),
        status: 'pending'
      },
      // Product 3 - Fresh Tomatoes
      {
        id: 'bid_3001',
        productId: 3,
        retailerEmail: 'nithish@retail.com',
        retailerName: 'Nithish Sharma',
        bidAmount: 1850,
        timestamp: new Date('2024-01-17T16:30:00'),
        status: 'accepted'
      }
    ];
    
    // Store bids by product ID
    mockBids.forEach(bid => {
      if (!biddingService.bidsStorage.has(bid.productId)) {
        biddingService.bidsStorage.set(bid.productId, []);
      }
      biddingService.bidsStorage.get(bid.productId).push(bid);
    });
    
    const mockOrders = [
      {
        id: 'order_1001',
        productId: 3,
        productName: 'Fresh Tomatoes',
        retailerEmail: 'nithish@retail.com',
        retailerName: 'Nithish Sharma',
        quantity: 150,
        totalAmount: 1850,
        bidAmount: 1850,
        status: 'CONFIRMED',
        orderDate: '2024-01-17T16:45:00',
        createdAt: new Date('2024-01-17T16:45:00'),
        otp: '654321'
      },
      {
        id: 'order_1002',
        productId: 1,
        productName: 'Premium Basmati Rice',
        retailerEmail: 'hasini@retail.com',
        retailerName: 'Hasini Reddy',
        quantity: 200,
        totalAmount: 4100,
        bidAmount: 4100,
        status: 'PENDING',
        orderDate: '2024-01-19T12:30:00',
        createdAt: new Date('2024-01-19T12:30:00'),
        otp: '123456'
      }
    ];
    
    biddingService.ordersStorage.set('murali@farmer.com', mockOrders);
    biddingService.ordersStorage.set('nithish@retail.com', [mockOrders[0]]);
    biddingService.ordersStorage.set('hasini@retail.com', [mockOrders[1]]);
  },
  
  // Place a bid for a product
  placeBid: (productId, retailerEmail, retailerName, bidAmount) => {
    const bid = {
      id: `bid_${Date.now()}`,
      productId,
      retailerEmail,
      retailerName,
      bidAmount: parseFloat(bidAmount),
      timestamp: new Date(),
      status: 'pending'
    };
    
    if (!biddingService.bidsStorage.has(productId)) {
      biddingService.bidsStorage.set(productId, []);
    }
    
    const bids = biddingService.bidsStorage.get(productId);
    bids.push(bid);
    biddingService.bidsStorage.set(productId, bids);
    
    return bid;
  },
  
  // Get all bids for a product
  getProductBids: (productId) => {
    return biddingService.bidsStorage.get(productId) || [];
  },
  
  // Get highest bid for a product
  getHighestBid: (productId) => {
    const bids = biddingService.getProductBids(productId);
    if (bids.length === 0) return { amount: 'N/A', retailerName: 'N/A' };
    const highest = bids.reduce((max, bid) => {
      const bidAmount = bid.bidAmount || bid.amount;
      const maxAmount = max.bidAmount || max.amount;
      return bidAmount > maxAmount ? bid : max;
    });
    return {
      amount: highest.bidAmount || highest.amount,
      retailerName: highest.retailerName
    };
  },
  
  // Get all bids for a retailer
  getRetailerBids: (retailerEmail) => {
    const allBids = [];
    biddingService.bidsStorage.forEach(bids => {
      allBids.push(...bids.filter(b => b.retailerEmail === retailerEmail));
    });
    return allBids;
  },
  
  // Get all bids for a farmer (from their products)
  getFarmerProductBids: (farmerProducts) => {
    const allBids = [];
    farmerProducts.forEach(product => {
      const bids = biddingService.getProductBids(product.id);
      bids.forEach(bid => {
        allBids.push({
          ...bid,
          productName: product.name || 'Unknown Product',
          quantity: bid.quantity || 1,
          bidDate: bid.timestamp || new Date()
        });
      });
    });
    return allBids;
  },
  
  // Accept a bid and create an order
  acceptBid: (bidId, productId, farmerId) => {
    const bids = biddingService.getProductBids(productId);
    const bid = bids.find(b => b.id === bidId);
    
    if (!bid) return null;
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    const order = {
      id: `order_${Date.now()}`,
      bidId,
      productId,
      retailerEmail: bid.retailerEmail,
      retailerName: bid.retailerName,
      farmerId,
      bidAmount: bid.bidAmount,
      otp,
      status: 'pending_otp',
      createdAt: new Date()
    };
    
    if (!biddingService.ordersStorage.has(farmerId)) {
      biddingService.ordersStorage.set(farmerId, []);
    }
    
    const farmerOrders = biddingService.ordersStorage.get(farmerId);
    farmerOrders.push(order);
    biddingService.ordersStorage.set(farmerId, farmerOrders);
    
    bid.status = 'accepted';
    
    return order;
  },
  
  // Verify OTP and confirm order
  verifyOTP: (orderId, farmerId, enteredOTP) => {
    const orders = biddingService.ordersStorage.get(farmerId) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return { success: false, message: 'Order not found' };
    if (order.otp.toString() !== enteredOTP.toString()) {
      return { success: false, message: 'Invalid OTP' };
    }
    
    order.status = 'confirmed';
    order.confirmedAt = new Date();
    
    return { success: true, message: 'Order confirmed successfully', order };
  },
  
  // Get farmer orders
  getFarmerOrders: (farmerId) => {
    // Initialize mock data if not already done
    if (biddingService.ordersStorage.size === 0) {
      biddingService.initializeMockData();
    }
    return biddingService.ordersStorage.get(farmerId) || [];
  },
  
  // Get retailer orders
  getRetailerOrders: (retailerEmail) => {
    // Initialize mock data if not already done
    if (biddingService.ordersStorage.size === 0) {
      biddingService.initializeMockData();
    }
    
    const allOrders = [];
    biddingService.ordersStorage.forEach(orders => {
      allOrders.push(...orders.filter(o => o.retailerEmail === retailerEmail));
    });
    return allOrders;
  },
  
  // Process payment
  processPayment: (orderId, farmerId, amount, paymentMethod) => {
    const orders = biddingService.ordersStorage.get(farmerId) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return { success: false, message: 'Order not found' };
    
    const transaction = {
      id: `txn_${Date.now()}`,
      orderId,
      amount: parseFloat(amount),
      paymentMethod,
      status: 'completed',
      timestamp: new Date(),
      transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    
    if (!order.transactions) {
      order.transactions = [];
    }
    
    order.transactions.push(transaction);
    order.status = 'paid';
    
    return { success: true, transaction };
  }
};

export default biddingService;
