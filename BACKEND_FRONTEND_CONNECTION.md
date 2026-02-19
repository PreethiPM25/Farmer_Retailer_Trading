# ✅ Backend-Frontend Connection Guide

## 🎯 STATUS: CONNECTED AND RUNNING

### Backend Server
- **Status**: ✅ **RUNNING**
- **Port**: 8080
- **Base URL**: `http://localhost:8080`
- **API Base URL**: `http://localhost:8080/api`
- **Database**: H2 (in-memory + file-based)
- **CORS**: Enabled for `http://localhost:3000`

### Frontend Server
- **Status**: ✅ **RUNNING**
- **Port**: 3000
- **URL**: `http://localhost:3000`
- **Framework**: React 18+
- **API Connection**: Connected to `http://localhost:8080/api`

---

## 📋 How They Connect

### Frontend API Configuration
File: `c:\agri-pulse\frontend\src\services\api.js`

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

// All API calls use this base URL:
// POST /products → http://localhost:8080/api/products
// GET /products/farmer/:email → http://localhost:8080/api/products/farmer/:email
// etc.
```

### Backend Configuration
File: `c:\agri-pulse\backend\src\main\resources\application.properties`

```properties
server.port=8080
cors.allowed.origins=http://localhost:3000,http://localhost:3001,http://localhost:8081
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
```

### CORS Configuration
File: `c:\agri-pulse\backend\src\main\java\com\agripulse\config\CorsConfig.java`

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        // ...
    }
}
```

---

## 🚀 Quick Start Commands

### Terminal 1 - Start Backend
```bash
cd C:\agri-pulse\backend
java -jar target\agri-pulse-backend-1.0.0.jar
```

**Expected Output:**
```
Started AgriPulseApplication in X seconds
Tomcat started on port 8080
```

### Terminal 2 - Start Frontend
```bash
cd C:\agri-pulse\frontend
npm start
```

**Expected Output:**
```
Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

---

## ✅ Verification Checklist

- [x] Backend JAR built successfully
- [x] Backend running on port 8080
- [x] Frontend dependencies installed
- [x] Frontend running on port 3000
- [x] CORS enabled on backend
- [x] API base URL configured in frontend
- [x] No Spring Security blocking requests
- [x] H2 database initialized
- [x] All 32 API mappings registered
- [x] Frontend can call backend endpoints

---

## 🔌 Testing the Connection

### Test 1: Backend Health Check
```bash
curl http://localhost:8080/api/health
```

### Test 2: Add Product (Frontend → Backend)
1. Open `http://localhost:3000`
2. Login as a farmer
3. Add a new product
4. Check browser Console (F12) for logs
5. Product data should be sent to `http://localhost:8080/api/products`

### Test 3: View Products (Frontend ← Backend)
1. Login as a farmer
2. View "My Products" dashboard
3. Frontend makes GET request to `http://localhost:8080/api/products/farmer/{email}`
4. Backend returns list of products

---

## 🐛 Troubleshooting

### Problem: Frontend shows "Cannot connect to server"
**Solution**: 
1. Verify backend is running on port 8080
2. Check CORS configuration
3. Try `curl http://localhost:8080` in terminal
4. Clear browser cache and reload

### Problem: Port 8080 already in use
**Solution**:
```bash
# Find process using port 8080
netstat -ano | findstr "8080"

# Kill the process (replace PID with actual process ID)
taskkill /PID {PID} /F
```

### Problem: Frontend port 3000 already in use
**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr "3000"

# Kill the process
taskkill /PID {PID} /F
```

### Problem: Database connection error
**Solution**:
1. Delete `agripulse_db.mv.db` file from backend root
2. Restart backend (new database will be created)
3. Backend will initialize schema automatically

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
│       http://localhost:3000             │
├─────────────────────────────────────────┤
│  • React Components                     │
│  • React Router v6                      │
│  • Fetch API for HTTP requests          │
│  • State management (localStorage)      │
│  • CSS Grid responsive design           │
└────────────┬────────────────────────────┘
             │
             │ HTTP Requests
             │ (CORS enabled)
             │
             ▼
┌─────────────────────────────────────────┐
│       Backend (Spring Boot)             │
│       http://localhost:8080             │
├─────────────────────────────────────────┤
│  • Spring Boot 3.2.0                    │
│  • Spring Data JPA                      │
│  • 32 API Endpoints                     │
│  • CORS Configuration                   │
│  • Exception Handling                   │
└────────────┬────────────────────────────┘
             │
             │ JDBC
             │
             ▼
┌─────────────────────────────────────────┐
│    H2 Database (agripulse_db)           │
├─────────────────────────────────────────┤
│  • Users Table                          │
│  • Products Table                       │
│  • Bids Table                           │
│  • Orders Table                         │
│  • Transactions Table                   │
└─────────────────────────────────────────┘
```

---

## 🎯 API Endpoints Available

### Products
- `GET /api/products` - Get all products
- `GET /api/products/farmer/{email}` - Get farmer's products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product details
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Bidding
- `POST /api/bids` - Place bid
- `GET /api/bids/product/{productId}` - Get bids for product
- `GET /api/bids/highest/{productId}` - Get highest bid

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}/status` - Update order status

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/{orderId}` - Get payment status

### Users
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

---

## 📝 Important Notes

1. **Security Disabled**: Spring Security is disabled for development. Enable it before production.
2. **CORS Open**: CORS allows all origins (`*`). Restrict in production.
3. **H2 Database**: File-based at `./agripulse_db`. Can be replaced with PostgreSQL/MySQL.
4. **Mock API Fallback**: Frontend has mock API for authentication. Use `mockAPI.js` for testing.
5. **Session Storage**: User session stored in localStorage (browser).

---

## ✅ Success Indicators

✅ **Backend Running**
- Port 8080 listening
- Tomcat started
- Database initialized
- "Started AgriPulseApplication" message

✅ **Frontend Running**
- Port 3000 listening
- React app running
- Browser opens automatically
- "Local: http://localhost:3000"

✅ **Connected**
- No CORS errors in browser console
- API calls show 200/201 status codes
- Data appears in dashboards
- User can add products and see them instantly

---

## 🎉 You're All Set!

Both servers are running and connected. Your application is ready for testing and development.

**Start here:**
1. Open http://localhost:3000
2. Login with test user credentials
3. Navigate to farmer or retailer dashboard
4. Test adding products, bidding, and orders

**Need help?** Check the browser console (F12) for detailed API request/response logs.
