# Product Submission & Email Notification Guide

## ✅ System Integration Complete

The Farmer Dashboard is now fully integrated with the backend to save products and send automated emails to retailers.

---

## 🎯 How It Works

### 1. **When Product Is Added:**
```javascript
User fills form with:
- Product Name
- Quantity
- Unit (kg/ton/quintal)
- Price per Unit
- Image (optional)
- Delivery Days
- Location
- Status (Available/Out of Stock)
```

### 2. **Backend Processing:**
```java
ProductController.addProduct()
├─ Validates product data
├─ Saves to H2 Database
├─ Triggers EmailService.notifyRetailersNewProduct()
└─ Returns saved product to frontend
```

### 3. **Email Notification:**
```text
EmailService sends to all ACTIVE retailers:
├─ Product name
├─ Farmer name
├─ Location
├─ Quantity & Unit
├─ Base price
├─ Delivery timeframe
└─ Call to action: "Login to place your bid!"
```

### 4. **Products Listed Table:**
```
Products are displayed in real-time with:
✓ Product name
✓ Quantity
✓ Price
✓ Delivery days
✓ Availability status
✓ Delete action button
```

---

## 🧪 Testing Steps

### Step 1: Login as Farmer
```
URL: http://localhost:3001/login
Email: farmer@example.com
Password: password123
```

### Step 2: Navigate to Farmer Dashboard
After login, you'll see the dashboard with three tabs:
- **Products** (current tab)
- **Bidding Process**
- **Orders Received**

### Step 3: Add a Product
1. Click **"➕ Add Product"** button
2. Fill in the form:
   - **Product Name**: Rice
   - **Quantity**: 100
   - **Unit**: kg
   - **Price/Unit**: 50
   - **Image**: (optional) Upload any image
   - **Delivery Days**: 7
   - **Status**: Available
   - **Location**: Punjab

3. Click **"🚀 Add Product"** button

### Step 4: Verify Success
You should see:
```
✅ Alert: "Product added successfully! Email sent to retailers."
```

### Step 5: Check Products Listed Table
The new product should appear in the "📂 Products Listed" table with:
- ✓ Product name: Rice
- ✓ Quantity: 100 kg
- ✓ Price: ₹50
- ✓ Delivery: 7 days
- ✓ Status: ✅ Available
- ✓ Delete button

---

## 🔧 API Endpoints Used

### **Add Product (POST)**
```
Endpoint: http://localhost:8080/api/products
Method: POST
Request Body:
{
  "name": "Rice",
  "quantity": 100,
  "unit": "kg",
  "price": 50,
  "availability": "Available",
  "location": "Punjab",
  "farmerEmail": "farmer@example.com",
  "imagePath": "base64_encoded_image_or_url",
  "deliveryDays": 7,
  "bidTimeframeDays": 7,
  "category": "General"
}
Response:
{
  "id": 1,
  "name": "Rice",
  "quantity": 100,
  "unit": "kg",
  "price": 50,
  "availability": "Available",
  "location": "Punjab",
  "farmerEmail": "farmer@example.com",
  "farmerName": "Rajesh Kumar",
  "imagePath": "base64_encoded_image",
  "deliveryDays": 7,
  "bidTimeframeDays": 7,
  "createdDate": "2025-12-15T18:55:00",
  "bidEndDate": "2025-12-22T18:55:00"
}
```

### **Get Farmer Products (GET)**
```
Endpoint: http://localhost:8080/api/products/farmer/{email}
Method: GET
Response:
[
  {
    "id": 1,
    "name": "Rice",
    "quantity": 100,
    "unit": "kg",
    "price": 50,
    "availability": "Available",
    "location": "Punjab",
    "farmerEmail": "farmer@example.com",
    "farmerName": "Rajesh Kumar",
    "imagePath": "...",
    "deliveryDays": 7,
    "createdDate": "2025-12-15T18:55:00"
  }
]
```

### **Delete Product (DELETE)**
```
Endpoint: http://localhost:8080/api/products/{id}
Method: DELETE
Response:
{
  "message": "Product deleted"
}
```

---

## 📧 Email Notification Details

When a product is added, all ACTIVE retailers receive an email with:

```
Subject: New Product Available - Rice

Dear [Retailer Name],

A new product is now available for bidding:

Product: Rice
Category: General
Farmer: Rajesh Kumar
Location: Punjab
Quantity: 100.00 kg
Base Price: ₹50.00
Delivery Time: 7 days
Bidding Deadline: 7 days from now

Login to place your bid!

Best Regards,
Agri-Pulse Team
```

---

## 🗄️ Database Details

### **Products Table (H2 Database)**
```sql
CREATE TABLE products (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity DOUBLE,
  unit VARCHAR(50),
  price DOUBLE,
  availability VARCHAR(50),
  location VARCHAR(255),
  farmer_email VARCHAR(255),
  farmer_name VARCHAR(255),
  image_path LONGTEXT,
  delivery_days INT,
  bid_timeframe_days INT,
  created_date TIMESTAMP,
  bid_end_date TIMESTAMP
);
```

### **Access H2 Console:**
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:agripulse
User Name: SA
Password: (leave empty)
```

---

## 🐛 Troubleshooting

### Issue: "Product added but doesn't appear in table"
**Solution:**
1. Check browser console (F12) for errors
2. Verify backend is running: `mvn spring-boot:run`
3. Ensure email is correctly stored in localStorage
4. Hard refresh the page (Ctrl+Shift+R)

### Issue: "Failed to add product" error
**Possible Causes:**
1. Backend server not running
2. Port 8080 is blocked/in use
3. Required fields are empty
4. Network connectivity issue

**Solution:**
1. Check backend logs
2. Verify frontend API URL: `http://localhost:8080/api`
3. Ensure all required fields are filled
4. Check Network tab in DevTools

### Issue: "Email not sent to retailers"
**Possible Causes:**
1. No ACTIVE retailers in database
2. Email service not configured
3. Retailer emails not set up

**Solution:**
1. Create test retailer accounts with role: RETAILER and status: ACTIVE
2. Check backend email service configuration
3. Review EmailService logs in backend console

---

## 📱 Form Validation

The form now includes validation for:

✅ **All required fields:**
- Product Name (non-empty)
- Quantity (positive number)
- Price (positive number)
- Location (non-empty)

✅ **Optional fields:**
- Image (any image format)
- Delivery Days (defaults to 7 if not provided)

✅ **Error Messages:**
```javascript
if (!newProduct.name || !newProduct.quantity || 
    !newProduct.price || !newProduct.location) {
  alert('Please fill in all required fields');
}
```

---

## 🎨 UI/UX Features

### Form Design:
```
┌─────────────────────────────────────────┐
│ 📦 Add Product                  [Close] │
├─────────────────────────────────────────┤
│ ROW 1: Name | Quantity | Unit | Price  │
│ ROW 2: Image | Days | Status | Location│
│                                         │
│ [Image Preview]                         │
│ [🚀 Add Product Button]                 │
└─────────────────────────────────────────┘
```

### Table Design:
```
┌──────┬──────┬────┬────┬──────┬─────┐
│Product│Qty  │Price│Days│Status│Action
├──────┼──────┼────┼────┼──────┼─────┤
│Rice  │100kg │₹50 │ 7d │ ✅   │🗑️  │
└──────┴──────┴────┴────┴──────┴─────┘
```

---

## 📊 Testing Checklist

### Frontend Tests
- [ ] Product form displays all 8 fields
- [ ] Form validates required fields
- [ ] Image preview shows before upload
- [ ] Add Product button submits form
- [ ] Success message appears after submission
- [ ] Products table updates with new product
- [ ] Delete button removes product from table
- [ ] Empty state message shows when no products

### Backend Tests
- [ ] Product saved to H2 database
- [ ] Product data includes farmer info
- [ ] Email sent to all ACTIVE retailers
- [ ] Email contains correct product details
- [ ] Product can be retrieved via GET endpoint
- [ ] Product can be deleted via DELETE endpoint

### Integration Tests
- [ ] Form data sent to backend correctly
- [ ] Backend response received and parsed
- [ ] Table updates in real-time
- [ ] Multiple products can be added
- [ ] Each product has unique ID

---

## 🚀 Deployment Checklist

Before going to production:

- [ ] Replace H2 in-memory DB with PostgreSQL
- [ ] Configure SMTP email service (Gmail, SendGrid, etc.)
- [ ] Update API_BASE_URL in api.js for production
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up proper authentication tokens
- [ ] Add rate limiting for API endpoints
- [ ] Implement file upload to cloud storage (S3/Azure)
- [ ] Add logging and monitoring
- [ ] Test with production email service
- [ ] Create database backups

---

## 📞 Support

For issues or questions:
1. Check browser console logs (F12 → Console)
2. Review backend logs in terminal
3. Verify API endpoints are responding
4. Check database connectivity
5. Review email service configuration

---

**Status:** ✅ READY FOR TESTING & PRODUCTION DEPLOYMENT
