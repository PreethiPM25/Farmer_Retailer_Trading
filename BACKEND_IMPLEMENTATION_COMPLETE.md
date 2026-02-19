# Agri-Pulse Backend Complete Implementation Guide

## ✅ COMPLETED TASKS

### 1. ✅ Database Persistence (CRITICAL FIX)
- **Changed H2 Configuration**: From `jdbc:h2:mem:agripulse` (in-memory) to `jdbc:h2:file:./agripulse_db` (file-based)
- **Updated DDL Mode**: From `create-drop` to `update` to preserve data on restart
- **Result**: All products, bids, orders, and transactions are now permanently stored

### 2. ✅ Models Created/Enhanced
- **Product**: Stores farmer products with all details (quantity, price, image path, etc.)
- **Bid**: Stores retailer bids on products
- **Order**: Tracks order status from creation to completion
- **Transaction**: Tracks payment transactions with status and details

### 3. ✅ Services Implemented
- **BidService**: Place bids, accept/reject, get highest bid
- **OrderService**: Create orders, confirm with OTP, mark as paid, complete
- **TransactionService**: Create transactions, process payments
- **EmailService**: Enhanced with order confirmation and payment notification emails

### 4. ✅ REST API Endpoints Created

#### Product Endpoints
```
POST   /api/products                - Add new product
GET    /api/products                - Get all products
GET    /api/products/farmer/{email} - Get farmer's products
PUT    /api/products/{id}           - Update product
DELETE /api/products/{id}           - Delete product
```

#### Bid Endpoints
```
POST   /api/bids/place              - Place new bid
GET    /api/bids/product/{id}       - Get bids for product
GET    /api/bids/farmer/{email}     - Get farmer's received bids
GET    /api/bids/retailer/{email}   - Get retailer's placed bids
POST   /api/bids/{bidId}/accept     - Accept bid (sends OTP)
POST   /api/bids/{bidId}/reject     - Reject bid
GET    /api/bids/highest/{productId}- Get highest bid for product
```

#### Order Endpoints
```
POST   /api/orders/create           - Create order from accepted bid
POST   /api/orders/{id}/confirm     - Confirm order with OTP
POST   /api/orders/{id}/pay         - Process payment
POST   /api/orders/{id}/complete    - Mark order as complete
GET    /api/orders/farmer/{email}   - Get farmer's orders
GET    /api/orders/retailer/{email} - Get retailer's orders
GET    /api/orders/{id}             - Get single order
```

#### Transaction Endpoints
```
POST   /api/transactions/create             - Create transaction from order
POST   /api/transactions/{id}/process       - Process payment
GET    /api/transactions/farmer/{email}     - Get farmer's transactions
GET    /api/transactions/retailer/{email}   - Get retailer's transactions
GET    /api/transactions/order/{orderId}    - Get transactions for order
GET    /api/transactions/{id}               - Get single transaction
```

### 5. ✅ CORS Configuration
- **Global CORS** configured in `CorsConfig.java`
- **Allows**: All origins, all HTTP methods (GET, POST, PUT, DELETE)
- **Each Controller** has `@CrossOrigin(origins = "*")` for redundancy

### 6. ✅ Frontend API Integration
Updated `/frontend/src/services/api.js` with:
- New order creation endpoints
- Order confirmation and payment processing
- Transaction creation and processing
- Proper error handling and logging

---

## 🚀 COMPLETE WORKFLOW

### FARMER WORKFLOW

**1. Add Products**
```javascript
POST /api/products
{
  "name": "Wheat",
  "quantity": 100,
  "unit": "kg",
  "price": 25.50,
  "category": "Grain",
  "location": "Punjab",
  "farmerEmail": "farmer@example.com"
}
// Response: Product saved, stored in database permanently
```

**2. View Product Bids**
```javascript
GET /api/bids/farmer/{farmerEmail}
// Returns all bids received for farmer's products
```

**3. Accept Best Bid**
```javascript
POST /api/bids/{bidId}/accept
// Response: OTP generated and sent to retailer via email
```

**4. View Orders**
```javascript
GET /api/orders/farmer/{farmerEmail}
// Shows orders with status: PENDING_OTP, CONFIRMED, PAID, COMPLETED
```

**5. View Transactions**
```javascript
GET /api/transactions/farmer/{farmerEmail}
// Shows payment transactions and status
```

---

### RETAILER WORKFLOW

**1. Browse Products**
```javascript
GET /api/products
// Get all products with highest bid info
```

**2. Place Bid**
```javascript
POST /api/bids/place
{
  "productId": 1,
  "productName": "Wheat",
  "bidAmount": 30.00,
  "quantity": 50,
  "retailerEmail": "retailer@example.com",
  "retailerName": "RetailCorp",
  "farmerEmail": "farmer@example.com"
}
// Response: Bid saved and farmer notified via email
```

**3. View My Bids**
```javascript
GET /api/bids/retailer/{retailerEmail}
// Shows all placed bids with status
```

**4. Confirm Order with OTP**
When farmer accepts bid, order is created:
```javascript
POST /api/orders/{orderId}/confirm
{
  "otp": "123456"
}
// Response: Order status changes to CONFIRMED
```

**5. Complete Payment**
```javascript
POST /api/orders/{orderId}/pay
{
  "paymentMethod": "CREDIT_CARD"
}
// Response: Transaction created, payment status COMPLETED
```

**6. View Transactions**
```javascript
GET /api/transactions/retailer/{retailerEmail}
// Shows all payment transactions with details
```

---

## 📊 DATABASE SCHEMA

### Products Table
- `id`: Auto-increment ID
- `name`, `quantity`, `unit`, `price`, `category`
- `farmer_email`, `farmer_name`, `location`
- `image_path`, `availability`
- `delivery_days`, `bid_timeframe_days`
- `created_date`, `bid_end_date`

### Bids Table
- `id`: Auto-increment ID
- `product_id`, `product_name`
- `retailer_email`, `retailer_name`
- `farmer_email`
- `bid_amount`, `quantity`, `status`
- `bid_date`, `expiry_date`

### Orders Table
- `id`: Auto-increment ID
- `product_id`, `retailer_email`, `farmer_email`
- `quantity`, `price`, `total_amount`
- `status` (PENDING_OTP, CONFIRMED, PAID, COMPLETED)
- `otp`, `otp_generated_at`
- `order_date`, `modified_date`

### Transactions Table
- `id`: Auto-increment ID
- `order_id`, `product_id`
- `retailer_email`, `farmer_email`
- `quantity`, `unit_price`, `total_amount`, `bid_amount`
- `payment_method`, `transaction_id`
- `transaction_status` (PENDING, COMPLETED, FAILED)
- `transaction_date`, `completion_date`

---

## ⚙️ CONFIGURATION

### Application Properties
```properties
# Database
spring.datasource.url=jdbc:h2:file:./agripulse_db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.jpa.hibernate.ddl-auto=update

# Server
server.port=8080

# Email (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

---

## 🔄 OTP & EMAIL FLOW

**When Farmer Accepts Bid:**
1. Bid status → ACCEPTED
2. OTP generated (6-digit random number)
3. Email sent to retailer with OTP
4. Retailer enters OTP to confirm order
5. Order status → CONFIRMED

**When Retailer Confirms with OTP:**
1. Order created with status PENDING_OTP
2. Confirmation email sent
3. Order status → CONFIRMED

**When Payment is Processed:**
1. Transaction created
2. Payment method stored
3. Transaction status → COMPLETED
4. Payment confirmation emails sent to both parties

---

## 📧 EMAIL TEMPLATES

**New Bid Notification (to Farmer)**
```
Subject: New Bid Received - [Product Name]
Body:
  - Product details
  - Retailer name and bid amount
  - Quantity bidded
  - Link to accept/reject
```

**OTP Email (to Retailer)**
```
Subject: Order Confirmation OTP - [Product Name]
Body:
  - Product details
  - Accepted bid amount
  - OTP code
  - Valid for 24 hours
```

**Order Confirmation (to Retailer)**
```
Subject: Order Confirmed - [Product Name]
Body:
  - Order ID
  - Product details
  - Confirmed bid amount
  - Link to make payment
```

**Payment Confirmation (to Both)**
```
Subject: Payment Successful - [Product Name]
Body:
  - Amount paid
  - Transaction ID
  - Order ID
  - Order status
```

---

## 🧪 TESTING CHECKLIST

### Backend Testing
- [x] Product addition and persistence across restarts
- [x] Bid placement and retrieval
- [x] Highest bid calculation
- [x] Order creation from bid
- [x] OTP generation and verification
- [x] Payment processing
- [x] Transaction tracking
- [x] CORS headers present in responses

### Frontend Testing
- [ ] Product form submission
- [ ] Bid placement from retailer dashboard
- [ ] Bid acceptance from farmer dashboard
- [ ] OTP input and confirmation
- [ ] Payment transaction page
- [ ] Order status updates in real-time

---

## 📝 NOTES

### Important: Database Location
- Database file is created at: `C:\agri-pulse\backend\agripulse_db.mv.db`
- Do NOT delete this file to maintain data
- File-based storage ensures data persistence

### Port Configuration
- Backend runs on: `http://localhost:8080`
- Frontend runs on: `http://localhost:3000`
- Both configured with CORS enabled

### Email Configuration
- Email service is optional for development
- If email fails, system continues (logged as warning)
- In production, configure valid SMTP credentials

---

## 🔧 TROUBLESHOOTING

### Backend Won't Start
```bash
# Kill any existing Java process
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force

# Rebuild and start
cd C:\agri-pulse\backend
mvn clean package -DskipTests
java -jar target/agri-pulse-backend-1.0.0.jar
```

### Products Not Persisting
- Check if database file exists: `C:\agri-pulse\backend\agripulse_db.mv.db`
- Verify `spring.jpa.hibernate.ddl-auto=update` in properties
- Check application logs for SQL errors

### CORS Errors
- Verify `@CrossOrigin(origins = "*")` on controllers
- Check `CorsConfig.java` is present
- Clear browser cache and try again

### Emails Not Sending
- Verify Gmail credentials are correct
- Check if "Less secure apps" is enabled
- Use app-specific password instead of account password

---

## 📚 API DOCUMENTATION

### Sample Curl Commands

**Add Product**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wheat",
    "quantity": 100,
    "unit": "kg",
    "price": 25.50,
    "farmerEmail": "farmer@example.com"
  }'
```

**Place Bid**
```bash
curl -X POST http://localhost:8080/api/bids/place \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "bidAmount": 30.00,
    "quantity": 50,
    "retailerEmail": "retailer@example.com",
    "retailerName": "RetailCorp",
    "farmerEmail": "farmer@example.com"
  }'
```

**Accept Bid**
```bash
curl -X POST http://localhost:8080/api/bids/1/accept
```

**Create Order**
```bash
curl -X POST http://localhost:8080/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "bidId": 1,
    "productId": 1
  }'
```

**Confirm Order**
```bash
curl -X POST http://localhost:8080/api/orders/1/confirm \
  -H "Content-Type: application/json" \
  -d '{"otp": "123456"}'
```

**Process Payment**
```bash
curl -X POST http://localhost:8080/api/orders/1/pay \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "CREDIT_CARD"}'
```

---

## 🎯 NEXT STEPS

1. **Start Backend**
   ```bash
   java -jar C:\agri-pulse\backend\target\agri-pulse-backend-1.0.0.jar
   ```

2. **Start Frontend**
   ```bash
   cd C:\agri-pulse\frontend
   npm start
   ```

3. **Test Bidding Flow**
   - Register farmer and add product
   - Register retailer and place bid
   - Farmer accepts bid
   - Retailer confirms with OTP
   - Process payment
   - Verify order and transaction records

4. **Monitor Backend Logs**
   - Check console for debug messages
   - Verify database operations
   - Monitor email sending

---

## ✨ FEATURES COMPLETED

✅ Product Management with Database Persistence  
✅ Bidding System with Highest Bid Tracking  
✅ Order Management with Status Tracking  
✅ OTP-Based Confirmation  
✅ Payment Transaction System  
✅ Email Notifications  
✅ CORS Configuration  
✅ Frontend API Integration  
✅ Comprehensive Error Handling  
✅ Logging & Debug Output  

---

**Created**: 2025-12-21  
**Status**: ✅ COMPLETE AND READY FOR TESTING
