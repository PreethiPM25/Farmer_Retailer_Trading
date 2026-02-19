# 🚀 Payment System - Quick Start Guide

## What's New?

A complete payment processing system has been added to the Agri-Pulse retailer dashboard featuring:

✅ **Razorpay Integration** - Credit/Debit cards, wallets, net banking  
✅ **UPI Payments** - Google Pay, PhonePe, Paytm support  
✅ **Auto Invoice Generation** - PDF invoices with all transaction details  
✅ **Email Notifications** - Automatic alerts to retailer and farmer  
✅ **Payment History** - Track all payment transactions  

## Setup Instructions

### Step 1: Install Dependencies

```bash
# Backend - Maven dependencies already added to pom.xml
cd backend
mvn clean install

# Frontend - Install NPM packages
cd frontend
npm install
```

### Step 2: Configure Razorpay Keys

Edit `backend/src/main/resources/application.properties`:

```properties
# Razorpay Configuration
razorpay.key.id=rzp_test_YOUR_KEY_ID
razorpay.key.secret=YOUR_KEY_SECRET
```

Get keys from: https://dashboard.razorpay.com/app/settings/api-keys

### Step 3: Update Frontend Razorpay Key

Edit `frontend/src/components/PaymentSection.js` (Line ~16):

```javascript
const RAZORPAY_KEY = 'rzp_test_YOUR_KEY'; // Replace with actual key
```

### Step 4: Run the Application

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm start
```

## Using the Payment System

### For Retailers

1. **Login** to retailer dashboard
2. **Click "💳 Payments"** tab in navigation
3. **Select an order** and click "💳 Pay Now"
4. **Choose payment method:**
   - 🏦 Razorpay (Cards/Wallet)
   - 📱 UPI (Google Pay, PhonePe, Paytm)
5. **Complete payment**
6. **Invoice auto-downloads** as PDF
7. **Check email** for payment confirmation

### For Farmers

- Receives **payment notification email** when retailer completes payment
- Can track **payment history** in their dashboard
- Receives **invoice copy** for records
- Can check payment status anytime

## Test Credentials

### Razorpay Test Cards (Sandbox Mode)

| Type | Number | Expiry | CVV |
|------|--------|--------|-----|
| Visa | 4111 1111 1111 1111 | 12/25 | 123 |
| Mastercard | 5555 5555 5555 4444 | 12/25 | 123 |

### UPI Test IDs
- `testuser@okhdfcbank`
- `demo@icici`
- `example@ybl`

## API Endpoints

### Create Payment
```bash
POST /api/payments/razorpay/create-order
{
  "orderId": 1
}
```

### Complete Payment
```bash
POST /api/payments/{paymentId}/complete-razorpay
{
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "xxx",
  "upiId": "optional@bank"
}
```

### Get Payment History
```bash
GET /api/payments/retailer/{email}
GET /api/payments/farmer/{email}
```

## File Structure

### Backend
```
backend/
├── src/main/java/com/agripulse/
│   ├── model/
│   │   └── Payment.java (NEW)
│   ├── repository/
│   │   └── PaymentRepository.java (NEW)
│   ├── service/
│   │   ├── PaymentService.java (NEW)
│   │   └── EmailService.java (UPDATED)
│   └── controller/
│       └── PaymentController.java (NEW)
└── pom.xml (UPDATED)
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   └── PaymentSection.js (NEW)
│   └── pages/
│       └── RetailerDashboard.js (UPDATED)
└── package.json (UPDATED)
```

## Features in Detail

### 💳 Razorpay Payment

- **Supported Methods:** Credit Card, Debit Card, Wallet, Netbanking
- **Checkout Modal:** Secure Razorpay hosted payment page
- **Signature Verification:** Payment verification for security
- **Instant Confirmation:** Real-time payment status

### 📱 UPI Payment

- **Supported Apps:** Google Pay, PhonePe, Paytm, WhatsApp Pay
- **UPI ID Input:** Simple username@bank format
- **Instant Settlement:** Fast transaction processing
- **Lightweight:** No additional installation needed

### 📄 Invoice Generation

**Includes:**
- Invoice Number (INV-TIMESTAMP-UUID)
- Transaction ID & Date
- Product Details (Name, Quantity, Unit Price, Total)
- Retailer & Farmer Information
- Payment Method & Status
- Agri-Pulse Branding

**Format:** PDF (Auto-downloads after payment)

### 📧 Email Notifications

**To Retailer:**
```
✅ Payment Successful & Invoice Generated
- Payment confirmation
- Invoice number
- Transaction details
```

**To Farmer:**
```
✅ Payment Received
- Amount received notification
- Product information
- Invoice reference
- Credit timeline
```

## Database Schema

**Table:** `payments`

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary Key |
| transaction_id | BIGINT | Transaction Reference |
| order_id | BIGINT | Order Reference |
| product_id | BIGINT | Product Reference |
| retailer_email | VARCHAR(255) | Retailer Email |
| farmer_email | VARCHAR(255) | Farmer Email |
| product_name | VARCHAR(255) | Product Name |
| quantity | DOUBLE | Order Quantity |
| unit_price | DOUBLE | Unit Price |
| total_amount | DOUBLE | Total Amount |
| payment_method | VARCHAR(50) | RAZORPAY/UPI |
| razorpay_order_id | VARCHAR(255) | Razorpay Order ID |
| razorpay_payment_id | VARCHAR(255) | Razorpay Payment ID |
| razorpay_signature | VARCHAR(500) | Payment Signature |
| upi_id | VARCHAR(255) | UPI ID |
| payment_status | VARCHAR(50) | PENDING/COMPLETED/FAILED |
| payment_date | TIMESTAMP | Payment Timestamp |
| invoice_number | VARCHAR(255) | Invoice Number |
| invoice_data | LONGTEXT | Invoice JSON Data |
| created_at | TIMESTAMP | Creation Time |
| updated_at | TIMESTAMP | Update Time |

## Troubleshooting

### ❌ Razorpay Not Loading
- Verify Razorpay key in component
- Check browser console for errors
- Ensure internet connection

### ❌ Payment Failed
- Check amount is valid
- Verify card/UPI details
- Check Razorpay dashboard

### ❌ Invoice Not Downloading
- Install jsPDF: `npm install jspdf`
- Check browser download settings
- Verify backend is running

### ❌ Emails Not Sending
- Configure mail settings in `application.properties`
- Check email service is enabled
- Verify recipient addresses

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure Razorpay keys
3. ✅ Run backend & frontend
4. ✅ Test payment flow
5. ✅ Check email notifications
6. ✅ Verify invoice generation

## Security Notes

⚠️ **Important:**
- Never commit API keys to version control
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement proper error handling
- Always verify signatures server-side
- Keep dependencies updated

## Support & Documentation

Full documentation: `PAYMENT_SYSTEM_IMPLEMENTATION.md`

## Version Info

- **Version:** 1.0.0
- **Last Updated:** January 14, 2026
- **Status:** Production Ready ✅

---

Happy Payments! 🎉
