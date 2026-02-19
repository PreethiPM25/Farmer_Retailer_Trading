import React, { useState } from 'react';

export function OrdersSection({ orders, userEmail, userRole, onVerifyOTP, biddingService }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  
  const handleOTPSubmit = async (order) => {
    if (!otpInput) {
      alert('Please enter OTP');
      return;
    }
    
    try {
      // Call API to verify OTP
      const response = await fetch('http://localhost:8080/api/orders/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailerEmail: userEmail,
          otp: otpInput,
          productId: order.productId || '1'
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('✅ OTP verified successfully! Order confirmed.');
        setOtpInput('');
        if (onVerifyOTP) {
          onVerifyOTP(order.id, otpInput);
        }
      } else {
        alert('❌ Invalid OTP. Please try again.');
      }
    } catch (error) {
      alert('❌ Failed to verify OTP. Please try again.');
    }
  };
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #dbeafe 0%, #cffafe 100%)',
      border: '2px solid #0284c7',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h3 style={{
        color: '#0c4a6e',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        📦 {userRole === 'farmer' ? 'My Orders' : 'My Orders'}
      </h3>
      
      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'white',
          borderRadius: '15px',
          border: '2px dashed #0284c7'
        }}>
          <div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div>
          <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Orders Yet</h4>
          <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>
            {userRole === 'farmer' ? 'Start receiving orders from retailers' : 'Place your first bid to create an order'}
          </p>
        </div>
      ) : (
        <div style={{display: 'grid', gap: '15px'}}>
          {orders.map((order) => (
            <div key={order.id} style={{
              background: 'white',
              border: '2px solid #e0f2fe',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
                <div>
                  <h4 style={{margin: '0 0 5px 0', color: '#1f2937', fontSize: '16px', fontWeight: '700'}}>
                    Order #{order.id.substring(6, 12).toUpperCase()}
                  </h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: 
                    order.status === 'confirmed' ? '#dcfce7' :
                    order.status === 'pending_otp' ? '#fef3c7' :
                    order.status === 'paid' ? '#d1fae5' : '#fee2e2',
                  color:
                    order.status === 'confirmed' ? '#166534' :
                    order.status === 'pending_otp' ? '#92400e' :
                    order.status === 'paid' ? '#065f46' : '#991b1b'
                }}>
                  {order.status === 'pending_otp' ? '⏳ Pending OTP' :
                   order.status === 'confirmed' ? '✅ Confirmed' :
                   order.status === 'paid' ? '💳 Paid' : order.status}
                </span>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px'}}>
                <div style={{background: '#f0f9ff', padding: '12px', borderRadius: '10px', border: '1px solid #0284c7'}}>
                  <div style={{fontSize: '12px', color: '#0c4a6e', fontWeight: '600', marginBottom: '4px'}}>RETAILER</div>
                  <div style={{fontSize: '14px', color: '#1f2937', fontWeight: '700'}}>{order.retailerName}</div>
                </div>
                <div style={{background: '#f0f9ff', padding: '12px', borderRadius: '10px', border: '1px solid #0284c7'}}>
                  <div style={{fontSize: '12px', color: '#0c4a6e', fontWeight: '600', marginBottom: '4px'}}>BID AMOUNT</div>
                  <div style={{fontSize: '18px', color: '#10b981', fontWeight: '700'}}>₹{order.bidAmount}</div>
                </div>
              </div>
              
              {order.status === 'pending_otp' && (
                <div style={{background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '10px', padding: '15px', marginBottom: '15px'}}>
                  <div style={{fontSize: '12px', color: '#92400e', fontWeight: '700', marginBottom: '10px'}}>🔐 VERIFY OTP</div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '2px solid #f59e0b',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    />
                    <button
                      onClick={() => handleOTPSubmit(order)}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
              
              {order.transactions && order.transactions.length > 0 && (
                <div style={{background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '10px', fontSize: '12px', color: '#166534'}}>
                  ✅ Transaction ID: {order.transactions[0].transactionId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PaymentTransactionSection({ orders, userEmail, onProcessPayment }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'paid');
  
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      border: '2px solid #f59e0b',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h3 style={{
        color: '#92400e',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        💳 Payment Transactions
      </h3>
      
      {confirmedOrders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'white',
          borderRadius: '15px',
          border: '2px dashed #f59e0b'
        }}>
          <div style={{fontSize: '48px', marginBottom: '15px'}}>💳</div>
          <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>No Payments Yet</h4>
          <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>
            Confirmed orders will appear here for payment
          </p>
        </div>
      ) : (
        <div style={{display: 'grid', gap: '15px'}}>
          {confirmedOrders.map((order) => (
            <div key={order.id} style={{
              background: 'white',
              border: '2px solid #f59e0b',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
                <div>
                  <h4 style={{margin: '0 0 5px 0', color: '#1f2937', fontSize: '16px', fontWeight: '700'}}>
                    Order #{order.id.substring(6, 12).toUpperCase()}
                  </h4>
                  <p style={{margin: '0', color: '#6b7280', fontSize: '14px'}}>
                    Amount: ₹{order.bidAmount}
                  </p>
                </div>
                {order.transactions && order.transactions.length > 0 ? (
                  <span style={{padding: '8px 16px', borderRadius: '20px', background: '#d1fae5', color: '#065f46', fontSize: '12px', fontWeight: '600'}}>
                    ✅ Paid
                  </span>
                ) : (
                  <span style={{padding: '8px 16px', borderRadius: '20px', background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: '600'}}>
                    ⏳ Pending Payment
                  </span>
                )}
              </div>
              
              {(!order.transactions || order.transactions.length === 0) && order.status === 'confirmed' && (
                <div style={{background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '10px', padding: '15px'}}>
                  <div style={{fontSize: '12px', color: '#92400e', fontWeight: '700', marginBottom: '10px'}}>PAYMENT METHOD</div>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #f59e0b',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    <option value="credit_card">💳 Credit Card</option>
                    <option value="debit_card">🏦 Debit Card</option>
                    <option value="upi">📱 UPI</option>
                    <option value="wallet">👜 Wallet</option>
                  </select>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('http://localhost:8080/api/orders/process-payment', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            orderId: order.id,
                            amount: order.bidAmount,
                            paymentMethod: paymentMethod
                          })
                        });
                        
                        const result = await response.json();
                        
                        if (response.ok) {
                          alert(`✅ Payment processed successfully! Transaction ID: ${result.transactionId}`);
                          if (onProcessPayment) {
                            onProcessPayment(order.id, order.bidAmount, paymentMethod);
                          }
                        } else {
                          alert('❌ Payment failed. Please try again.');
                        }
                      } catch (error) {
                        alert('❌ Payment processing failed. Please try again.');
                      }
                    }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '14px',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    💳 Process Payment
                  </button>
                </div>
              )}
              
              {order.transactions && order.transactions.length > 0 && (
                <div style={{background: '#d1fae5', border: '1px solid #86efac', borderRadius: '10px', padding: '12px'}}>
                  <div style={{fontSize: '12px', color: '#065f46', fontWeight: '700', marginBottom: '8px'}}>✅ TRANSACTION DETAILS</div>
                  <div style={{fontSize: '13px', color: '#047857', display: 'grid', gap: '6px'}}>
                    <div><strong>ID:</strong> {order.transactions[0].transactionId}</div>
                    <div><strong>Amount:</strong> ₹{order.transactions[0].amount}</div>
                    <div><strong>Method:</strong> {order.transactions[0].paymentMethod.replace('_', ' ').toUpperCase()}</div>
                    <div><strong>Date:</strong> {new Date(order.transactions[0].timestamp).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default { OrdersSection, PaymentTransactionSection };
