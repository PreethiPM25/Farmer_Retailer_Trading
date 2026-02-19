import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

export function PaymentSection({ orders, userEmail, userRole }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  
  // Razorpay configuration
  const RAZORPAY_KEY = 'rzp_test_your_key'; // Replace with actual key
  
  useEffect(() => {
    loadPayments();
    loadRazorpayScript();
  }, []);
  
  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };
  
  const loadPayments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payments/${userRole}/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };
  
  const handleInitiatePayment = async (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setPaymentStatus('');
    setUpiId('');
  };
  
  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create Razorpay order
      const orderResponse = await fetch('http://localhost:8080/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder.id })
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create Razorpay order');
      }
      
      const orderData = await orderResponse.json();
      
      // Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: Math.round(selectedOrder.totalAmount * 100),
        currency: 'INR',
        name: 'Agri-Pulse',
        description: `Payment for ${selectedOrder.productName}`,
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          await handleRazorpaySuccess(response, orderData.paymentId);
        },
        prefill: {
          email: userEmail,
          contact: '9999999999'
        },
        theme: {
          color: '#00a86b'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      setPaymentStatus('❌ Failed to initiate Razorpay payment');
      alert('Failed to initiate Razorpay payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRazorpaySuccess = async (response, paymentId) => {
    try {
      setLoading(true);
      
      // Complete payment on backend
      const completeResponse = await fetch(`http://localhost:8080/api/payments/${paymentId}/complete-razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          upiId: upiId || 'N/A'
        })
      });
      
      if (!completeResponse.ok) {
        throw new Error('Failed to complete payment');
      }
      
      const paymentResult = await completeResponse.json();
      
      setPaymentStatus('✅ Payment completed successfully!');
      alert('✅ Payment successful! Invoice has been generated.');
      
      // Download invoice
      await downloadInvoice(paymentResult.invoiceNumber);
      
      // Reload payments
      loadPayments();
      setTimeout(() => setShowPaymentModal(false), 1000);
    } catch (error) {
      console.error('Error completing payment:', error);
      setPaymentStatus('❌ Error completing payment');
      alert('Error completing payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUPIPayment = async (e) => {
    e.preventDefault();
    
    if (!upiId || !upiId.includes('@')) {
      alert('❌ Please enter a valid UPI ID');
      return;
    }
    
    setLoading(true);
    
    try {
      // Initiate UPI payment
      const initiateResponse = await fetch('http://localhost:8080/api/payments/upi/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          upiId: upiId
        })
      });
      
      if (!initiateResponse.ok) {
        throw new Error('Failed to initiate UPI payment');
      }
      
      const paymentData = await initiateResponse.json();
      
      // Simulate UPI payment (In real scenario, integrate with UPI gateway)
      setPaymentStatus('📱 UPI payment initiated. Please complete payment on your UPI app...');
      
      // Simulate UPI payment completion after 2 seconds
      setTimeout(async () => {
        try {
          const completeResponse = await fetch(`http://localhost:8080/api/payments/${paymentData.paymentId}/complete-upi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionRef: 'UPI-' + Date.now()
            })
          });
          
          if (!completeResponse.ok) {
            throw new Error('Failed to complete UPI payment');
          }
          
          const paymentResult = await completeResponse.json();
          
          setPaymentStatus('✅ UPI Payment completed successfully!');
          alert('✅ UPI Payment successful! Invoice has been generated.');
          
          // Download invoice
          await downloadInvoice(paymentResult.invoiceNumber);
          
          // Reload payments
          loadPayments();
          setTimeout(() => setShowPaymentModal(false), 1000);
        } catch (error) {
          console.error('Error completing UPI payment:', error);
          setPaymentStatus('❌ Error completing UPI payment');
        }
      }, 2000);
    } catch (error) {
      console.error('Error initiating UPI payment:', error);
      setPaymentStatus('❌ Failed to initiate UPI payment');
      alert('Failed to initiate UPI payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const downloadInvoice = async (invoiceNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/api/payments/invoice/${invoiceNumber}`);
      if (response.ok) {
        const paymentData = await response.json();
        generateInvoicePDF(paymentData);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };
  
  const generateInvoicePDF = (payment) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Header
    pdf.setFillColor(0, 166, 107);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('🌾 AGRI-PULSE', 10, 20);
    
    pdf.setFontSize(10);
    pdf.text('Invoice', pageWidth - 30, 20);
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    
    // Invoice details
    let yPos = 50;
    pdf.text(`Invoice Number: ${payment.invoiceNumber}`, 10, yPos);
    yPos += 10;
    pdf.text(`Invoice Date: ${new Date(payment.paymentDate).toLocaleDateString()}`, 10, yPos);
    
    // Bill to section
    yPos += 20;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('BILL TO:', 10, yPos);
    
    yPos += 10;
    pdf.setFont(undefined, 'normal');
    pdf.text(`Name: ${payment.retailerName || 'Customer'}`, 10, yPos);
    yPos += 7;
    pdf.text(`Email: ${payment.retailerEmail}`, 10, yPos);
    
    // Product details table
    yPos += 20;
    pdf.setFont(undefined, 'bold');
    pdf.text('PRODUCT DETAILS:', 10, yPos);
    
    yPos += 10;
    // Table header
    pdf.setFillColor(230, 230, 230);
    pdf.rect(10, yPos - 5, 190, 8, 'F');
    
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('Description', 12, yPos);
    pdf.text('Quantity', 80, yPos);
    pdf.text('Unit Price', 120, yPos);
    pdf.text('Amount', 160, yPos);
    
    yPos += 10;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    pdf.text(payment.productName, 12, yPos);
    pdf.text(payment.quantity.toString(), 80, yPos);
    pdf.text(`₹${payment.unitPrice.toFixed(2)}`, 120, yPos);
    pdf.text(`₹${payment.totalAmount.toFixed(2)}`, 160, yPos);
    
    // Total section
    yPos += 20;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(80, yPos - 5, 120, 8, 'F');
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Total Amount:', 120, yPos);
    pdf.text(`₹${payment.totalAmount.toFixed(2)}`, 160, yPos);
    
    // Payment info
    yPos += 20;
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(11);
    pdf.text('PAYMENT INFORMATION:', 10, yPos);
    
    yPos += 10;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    pdf.text(`Payment Method: ${payment.paymentMethod}`, 10, yPos);
    yPos += 7;
    pdf.text(`Transaction ID: ${payment.razorpayPaymentId || payment.upiId}`, 10, yPos);
    yPos += 7;
    pdf.text(`Status: ${payment.paymentStatus}`, 10, yPos);
    
    // Farmer details
    yPos += 20;
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(11);
    pdf.text('FARMER DETAILS:', 10, yPos);
    
    yPos += 10;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    pdf.text(`Name: ${payment.farmerName}`, 10, yPos);
    yPos += 7;
    pdf.text(`Email: ${payment.farmerEmail}`, 10, yPos);
    
    // Footer
    yPos = pageHeight - 30;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, yPos, pageWidth, 30, 'F');
    
    pdf.setFontSize(9);
    pdf.text('Thank you for using Agri-Pulse!', pageWidth / 2, yPos + 8, { align: 'center' });
    pdf.text('For support, contact: support@agripulse.com', pageWidth / 2, yPos + 15, { align: 'center' });
    
    // Save PDF
    pdf.save(`Invoice-${payment.invoiceNumber}.pdf`);
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
        💳 Payments
      </h3>
      
      {/* Available Orders for Payment */}
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{
          color: '#1f2937',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '15px'
        }}>
          Available Orders for Payment
        </h4>
        
        {orders && orders.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                background: 'white',
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                padding: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)'
              }}>
                <div>
                  <h5 style={{ margin: '0 0 5px 0', color: '#1f2937', fontWeight: '600' }}>
                    {order.productName}
                  </h5>
                  <p style={{ margin: '0 0 3px 0', color: '#6b7280', fontSize: '13px' }}>
                    Amount: <strong>₹{order.totalAmount?.toFixed(2) || order.price?.toFixed(2)}</strong>
                  </p>
                  <p style={{ margin: '0', color: '#6b7280', fontSize: '13px' }}>
                    Quantity: {order.quantity || order.bidQuantity}
                  </p>
                </div>
                <button
                  onClick={() => handleInitiatePayment(order)}
                  style={{
                    background: 'linear-gradient(135deg, #00a86b 0%, #00885c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  💳 Pay Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            border: '2px dashed #0284c7',
            color: '#6b7280'
          }}>
            No orders available for payment
          </div>
        )}
      </div>
      
      {/* Payment History */}
      <div>
        <h4 style={{
          color: '#1f2937',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '15px'
        }}>
          Payment History
        </h4>
        
        {payments && payments.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {payments.map((payment) => (
              <div key={payment.id} style={{
                background: 'white',
                border: '2px solid #e0f2fe',
                borderRadius: '12px',
                padding: '15px',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#1f2937', fontWeight: '600' }}>
                      {payment.productName}
                    </h5>
                    <p style={{ margin: '0 0 3px 0', color: '#6b7280', fontSize: '13px' }}>
                      Invoice: <strong>{payment.invoiceNumber}</strong>
                    </p>
                    <p style={{ margin: '0 0 3px 0', color: '#6b7280', fontSize: '13px' }}>
                      Amount: <strong>₹{payment.totalAmount?.toFixed(2)}</strong>
                    </p>
                    <p style={{ margin: '0', color: '#6b7280', fontSize: '13px' }}>
                      Method: {payment.paymentMethod}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: payment.paymentStatus === 'COMPLETED' ? '#dcfce7' : '#fce7f3',
                      color: payment.paymentStatus === 'COMPLETED' ? '#166534' : '#be185d'
                    }}>
                      {payment.paymentStatus === 'COMPLETED' ? '✅ Completed' : '⏳ ' + payment.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            border: '2px dashed #0284c7',
            color: '#6b7280'
          }}>
            No payment history yet
          </div>
        )}
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ color: '#0c4a6e', marginTop: '0', marginBottom: '20px' }}>
              💳 Payment Options
            </h2>
            
            {/* Product Details */}
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #00a86b',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>Order Details</h4>
              <p style={{ margin: '5px 0', color: '#374151' }}>
                <strong>Product:</strong> {selectedOrder.productName}
              </p>
              <p style={{ margin: '5px 0', color: '#374151' }}>
                <strong>Quantity:</strong> {selectedOrder.quantity || selectedOrder.bidQuantity}
              </p>
              <p style={{ margin: '5px 0', color: '#374151' }}>
                <strong>Amount:</strong> ₹{(selectedOrder.totalAmount || selectedOrder.price * (selectedOrder.quantity || selectedOrder.bidQuantity)).toFixed(2)}
              </p>
            </div>
            
            {/* Payment Method Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '10px',
                border: paymentMethod === 'RAZORPAY' ? '2px solid #00a86b' : '2px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                background: paymentMethod === 'RAZORPAY' ? '#f0fdf4' : 'white'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                  🏦 Razorpay (Card/Wallet)
                </span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: paymentMethod === 'UPI' ? '2px solid #00a86b' : '2px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                background: paymentMethod === 'UPI' ? '#f0fdf4' : 'white'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: '10px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '600', color: '#1f2937' }}>
                  📱 UPI (Google Pay, PhonePe, Paytm)
                </span>
              </label>
            </div>
            
            {/* UPI ID Input */}
            {paymentMethod === 'UPI' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="username@bankname"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}
            
            {/* Payment Status */}
            {paymentStatus && (
              <div style={{
                background: paymentStatus.includes('✅') ? '#f0fdf4' : '#fef2f2',
                color: paymentStatus.includes('✅') ? '#166534' : '#991b1b',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {paymentStatus}
              </div>
            )}
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              {paymentMethod === 'RAZORPAY' ? (
                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #00a86b 0%, #00885c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? '⏳ Processing...' : '💳 Pay with Razorpay'}
                </button>
              ) : (
                <button
                  onClick={handleUPIPayment}
                  disabled={loading || !upiId}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: loading || !upiId ? '#9ca3af' : 'linear-gradient(135deg, #00a86b 0%, #00885c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading || !upiId ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? '⏳ Processing...' : '📱 Pay with UPI'}
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentStatus('');
                  setUpiId('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
