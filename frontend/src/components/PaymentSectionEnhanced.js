import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function PaymentSectionEnhanced({ orders, userEmail, userRole }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadProducts();
    loadPayments();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/payments/retailer/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
      setPayments([]);
    }
  };

  const handlePurchaseNow = (product) => {
    setSelectedProduct(product);
    setUpiId('');
    setPaymentStatus('');
    setPaymentSuccess(false);
    setShowUPIModal(true);
  };

  const validateUPI = (upi) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    return upiRegex.test(upi);
  };

  const handleUPIPayment = async (e) => {
    e.preventDefault();

    if (!upiId.trim()) {
      setPaymentStatus('❌ Please enter UPI ID');
      return;
    }

    if (!validateUPI(upiId)) {
      setPaymentStatus('❌ Invalid UPI ID format (e.g., username@bank)');
      return;
    }

    setLoading(true);
    setPaymentStatus('⏳ Processing UPI Payment...');

    try {
      // Simulate payment processing (2 second delay)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate invoice data
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const invoiceData = {
        invoiceNumber,
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        product: selectedProduct,
        upiId,
        amount: selectedProduct.price || 0,
        retailerEmail: userEmail,
        transactionId: `TXN-${Date.now()}`,
        paymentMethod: 'UPI'
      };

      setGeneratedInvoice(invoiceData);
      setPaymentStatus('✅ Payment Successful! Generating Invoice...');
      setPaymentSuccess(true);

      // Auto-download invoice after 1 second
      setTimeout(() => {
        downloadInvoicePDF(invoiceData);
      }, 1000);

      // Save payment to backend
      await savePaymentToDB(invoiceData);

      // Reload payments
      loadPayments();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('❌ Payment failed. Please try again.');
      setPaymentSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const savePaymentToDB = async (invoiceData) => {
    try {
      const payload = {
        transactionId: invoiceData.transactionId,
        orderId: null,
        productId: selectedProduct.id || selectedProduct._id,
        retailerEmail: userEmail,
        retailerName: userEmail.split('@')[0],
        farmerEmail: selectedProduct.farmerEmail || 'farmer@agripulse.com',
        farmerName: selectedProduct.farmerName || 'Farmer',
        productName: selectedProduct.name || selectedProduct.productName,
        quantity: 1,
        unitPrice: selectedProduct.price,
        totalAmount: selectedProduct.price,
        paymentMethod: 'UPI',
        upiId: invoiceData.upiId,
        paymentStatus: 'COMPLETED',
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceData: JSON.stringify(invoiceData)
      };

      const response = await fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('Failed to save payment to database');
      }
    } catch (error) {
      console.warn('Error saving payment:', error);
    }
  };

  const downloadInvoicePDF = (invoiceData) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with green background
    pdf.setFillColor(0, 168, 107);
    pdf.rect(0, 0, pageWidth, 30, 'F');

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Agri-Pulse', pageWidth / 2, 15, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text('Agricultural Marketplace', pageWidth / 2, 22, { align: 'center' });

    // Reset text color
    pdf.setTextColor(0, 0, 0);
    yPosition = 45;

    // Invoice Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('INVOICE', 20, yPosition);
    yPosition += 10;

    // Invoice details
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Invoice Date: ${invoiceData.date}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Invoice Time: ${invoiceData.time}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Transaction ID: ${invoiceData.transactionId}`, 20, yPosition);
    yPosition += 10;

    // Bill To Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('BILL TO:', 20, yPosition);
    yPosition += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Name: ${userEmail.split('@')[0]}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Email: ${userEmail}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`UPI ID: ${invoiceData.upiId}`, 20, yPosition);
    yPosition += 10;

    // From Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('FROM:', 20, yPosition);
    yPosition += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Farmer: ${invoiceData.product.farmerName || 'Agri-Pulse Farmer'}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Product: ${invoiceData.product.name || invoiceData.product.productName}`, 20, yPosition);
    yPosition += 10;

    // Product Details Table
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('PRODUCT DETAILS:', 20, yPosition);
    yPosition += 8;

    // Table headers
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(20, yPosition - 4, pageWidth - 40, 6, 'F');
    pdf.text('Description', 22, yPosition);
    pdf.text('Qty', 100, yPosition);
    pdf.text('Unit Price', 120, yPosition);
    pdf.text('Amount', 160, yPosition);
    yPosition += 8;

    // Table data
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(invoiceData.product.name || invoiceData.product.productName, 22, yPosition);
    pdf.text('1', 100, yPosition);
    pdf.text(`₹${invoiceData.product.price}`, 120, yPosition);
    pdf.text(`₹${invoiceData.product.price}`, 160, yPosition);
    yPosition += 10;

    // Total Amount Box
    pdf.setFillColor(200, 200, 200);
    pdf.rect(120, yPosition - 4, 60, 10, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Total Amount:', 125, yPosition + 2);
    pdf.text(`₹${invoiceData.product.price}`, 160, yPosition + 2, { align: 'right' });
    yPosition += 15;

    // Payment Information
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('PAYMENT INFORMATION:', 20, yPosition);
    yPosition += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`UPI ID: ${invoiceData.upiId}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Payment Status: Completed`, 20, yPosition);
    yPosition += 10;

    // Footer
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'Thank you for your business! This invoice is valid without signature.',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Download PDF
    pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '15px',
      borderBottom: '2px solid #00a86b',
      paddingBottom: '10px',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    },
    productCard: {
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    productCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
    productImage: {
      width: '100%',
      height: '150px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px',
    },
    productName: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px',
    },
    productPrice: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#00a86b',
      marginBottom: '8px',
    },
    productFarmer: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '10px',
    },
    purchaseButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#00a86b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      transition: 'background-color 0.3s',
    },
    purchaseButtonHover: {
      backgroundColor: '#008c54',
    },
    modal: {
      display: showUPIModal ? 'block' : 'none',
      position: 'fixed',
      zIndex: 1000,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
      backgroundColor: '#fefefe',
      margin: '5% auto',
      padding: '30px',
      border: '1px solid #888',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    closeButton: {
      fontSize: '28px',
      fontWeight: 'bold',
      cursor: 'pointer',
      color: '#aaa',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#00a86b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    submitButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    statusMessage: {
      marginTop: '15px',
      padding: '12px',
      borderRadius: '4px',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    statusSuccess: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    statusError: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
    statusPending: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: '1px solid #ffeeba',
    },
    paymentsList: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '15px',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    paymentItem: {
      padding: '12px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paymentItemLast: {
      borderBottom: 'none',
    },
    paymentInfo: {
      flex: 1,
    },
    paymentDate: {
      fontSize: '12px',
      color: '#666',
    },
    paymentBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: '#d4edda',
      color: '#155724',
    },
  };

  return (
    <div style={styles.container}>
      {/* Available Products Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🛒 Available Products</div>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No products available
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div
                key={product.id || product._id}
                style={styles.productCard}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.productCardHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.productCard)}
              >
                <div style={styles.productImage}>
                  {product.image ? <img src={product.image} alt={product.name} /> : '📦 Product Image'}
                </div>
                <div style={styles.productName}>{product.name || product.productName}</div>
                <div style={styles.productPrice}>₹{product.price || 0}</div>
                <div style={styles.productFarmer}>
                  🌾 {product.farmerName || product.farmerEmail || 'Agri-Pulse Farmer'}
                </div>
                <button
                  style={styles.purchaseButton}
                  onMouseEnter={(e) => Object.assign(e.target.style, styles.purchaseButtonHover)}
                  onMouseLeave={(e) => Object.assign(e.target.style, styles.purchaseButton)}
                  onClick={() => handlePurchaseNow(product)}
                >
                  💳 Purchase Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPI Payment Modal */}
      <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setShowUPIModal(false)}>
        <div style={styles.modalContent}>
          <div style={styles.modalHeader}>
            <h2 style={{ margin: 0 }}>📱 UPI Payment</h2>
            <span
              style={styles.closeButton}
              onClick={() => {
                setShowUPIModal(false);
                setPaymentStatus('');
              }}
            >
              ×
            </span>
          </div>

          {selectedProduct && (
            <>
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Product:</strong> {selectedProduct.name || selectedProduct.productName}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Amount:</strong> ₹{selectedProduct.price || 0}
                </div>
                <div>
                  <strong>Seller:</strong> {selectedProduct.farmerName || selectedProduct.farmerEmail || 'Agri-Pulse Farmer'}
                </div>
              </div>

              <form onSubmit={handleUPIPayment}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>UPI ID *</label>
                  <input
                    type="text"
                    placeholder="e.g., yourname@paytm or yourname@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Test UPIs: testuser@okhdfcbank, demo@icici, example@ybl
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    ...(loading ? styles.submitButtonDisabled : {}),
                  }}
                  disabled={loading}
                >
                  {loading ? '⏳ Processing...' : '💳 Pay Now'}
                </button>

                {paymentStatus && (
                  <div
                    style={{
                      ...styles.statusMessage,
                      ...(paymentSuccess
                        ? styles.statusSuccess
                        : paymentStatus.includes('⏳')
                        ? styles.statusPending
                        : styles.statusError),
                    }}
                  >
                    {paymentStatus}
                  </div>
                )}

                {paymentSuccess && generatedInvoice && (
                  <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#155724' }}>
                      ✅ Invoice Generated!
                    </div>
                    <div style={{ fontSize: '12px', color: '#155724', marginBottom: '10px' }}>
                      Invoice Number: {generatedInvoice.invoiceNumber}
                    </div>
                    <div style={{ fontSize: '12px', color: '#155724' }}>
                      The invoice has been downloaded to your device.
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>

      {/* Payment History Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>📋 Payment History</div>
        {payments.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No payments yet
          </div>
        ) : (
          <div style={styles.paymentsList}>
            {payments.map((payment, index) => (
              <div
                key={payment.id || index}
                style={{
                  ...styles.paymentItem,
                  ...(index === payments.length - 1 ? styles.paymentItemLast : {}),
                }}
              >
                <div style={styles.paymentInfo}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    Invoice: {payment.invoiceNumber}
                  </div>
                  <div style={styles.paymentDate}>
                    {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style={{ marginRight: '10px', textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#00a86b', marginBottom: '4px' }}>
                    ₹{payment.totalAmount}
                  </div>
                  <div style={styles.paymentBadge}>
                    {payment.paymentStatus === 'COMPLETED' ? '✅ Completed' : '⏳ Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
