# Agri-Pulse API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. Register User
**Endpoint**: `POST /auth/register`

**Description**: Register a new farmer or retailer

**Request Body**:
```json
{
  "email": "farmer@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "123 Farm Road, City",
  "role": "FARMER",
  "documentPath": "https://example.com/document.pdf"
}
```

**Response** (Success):
```json
{
  "message": "Registration submitted successfully",
  "success": true
}
```

**Response** (Error):
```json
{
  "message": "Email already registered",
  "success": false
}
```

**Validation Rules**:
- email: Required, valid email format
- fullName: Required, not blank
- phone: Required, not blank
- address: Required, not blank
- role: Required, must be "FARMER" or "RETAILER"
- documentPath: Optional

---

### 2. Login
**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "email": "admin@agripulse.com",
  "password": "Admin@123"
}
```

**Response** (Success):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN",
  "email": "admin@agripulse.com",
  "fullName": "System Admin",
  "passwordReset": true
}
```

**Response** (Error):
```json
{
  "message": "Invalid credentials",
  "success": false
}
```

**Status Codes**:
- 200: Success
- 400: Invalid credentials or account not approved

---

### 3. Reset Password
**Endpoint**: `POST /auth/reset-password`

**Description**: Reset user password (first login or change password)

**Request Body**:
```json
{
  "email": "farmer@example.com",
  "oldPassword": "TempABC123",
  "newPassword": "NewSecure@123"
}
```

**Response** (Success):
```json
{
  "message": "Password reset successfully",
  "success": true
}
```

**Response** (Error):
```json
{
  "message": "Old password is incorrect",
  "success": false
}
```

---

## Admin Endpoints

### 4. Get Pending Users
**Endpoint**: `GET /admin/pending-users`

**Description**: Retrieve all users pending approval

**Response**:
```json
[
  {
    "id": 2,
    "email": "farmer@example.com",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "address": "123 Farm Road, City",
    "documentPath": "https://example.com/document.pdf",
    "role": "FARMER",
    "status": "PENDING",
    "passwordReset": false,
    "registrationDate": "2024-01-15T10:30:00",
    "lastLogin": null,
    "approvalDate": null
  }
]
```

---

### 5. Approve User
**Endpoint**: `POST /admin/approve/{userId}`

**Description**: Approve a pending user registration

**Path Parameter**:
- userId: Long (User ID to approve)

**Example**: `POST /admin/approve/2`

**Response** (Success):
```json
{
  "message": "User approved successfully",
  "success": true
}
```

**Side Effects**:
- User status changed to APPROVED
- Temporary password generated
- Email sent to user with credentials

---

### 6. Get Dashboard Statistics
**Endpoint**: `GET /admin/dashboard-stats`

**Description**: Retrieve comprehensive dashboard statistics

**Response**:
```json
{
  "totalUsers": 25,
  "activeUsers": 18,
  "inactiveUsers": 7,
  "usersNotResetPassword": 3,
  "todayRegistrations": 2,
  "weeklyGrowth": [
    {"day": "Mon", "count": 2},
    {"day": "Tue", "count": 3},
    {"day": "Wed", "count": 1},
    {"day": "Thu", "count": 4},
    {"day": "Fri", "count": 2},
    {"day": "Sat", "count": 1},
    {"day": "Sun", "count": 0}
  ],
  "userCategories": {
    "FARMER": 15,
    "RETAILER": 10
  }
}
```

---

## User Endpoints

### 7. Get User Dashboard
**Endpoint**: `GET /user/dashboard/{email}`

**Description**: Retrieve user-specific dashboard data

**Path Parameter**:
- email: String (User email address)

**Example**: `GET /user/dashboard/farmer@example.com`

**Response**:
```json
{
  "fullName": "John Doe",
  "email": "farmer@example.com",
  "role": "FARMER",
  "status": "ACTIVE",
  "lastLogin": "2024-01-15T14:30:00",
  "registrationDate": "2024-01-10T10:00:00",
  "passwordReset": true
}
```

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "message": "Error description",
  "success": false
}
```

### Common HTTP Status Codes
- **200 OK**: Request successful
- **400 Bad Request**: Invalid input or business logic error
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Data Models

### User Model
```json
{
  "id": "Long",
  "email": "String (unique)",
  "password": "String (encrypted)",
  "fullName": "String",
  "phone": "String",
  "address": "String",
  "documentPath": "String (optional)",
  "role": "Enum (ADMIN, FARMER, RETAILER)",
  "status": "Enum (PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE)",
  "passwordReset": "Boolean",
  "registrationDate": "LocalDateTime",
  "lastLogin": "LocalDateTime",
  "approvalDate": "LocalDateTime"
}
```

### User Roles
- **ADMIN**: System administrator with full access
- **FARMER**: Agricultural producer
- **RETAILER**: Product retailer/buyer

### User Status
- **PENDING**: Registration submitted, awaiting approval
- **APPROVED**: Approved by admin, credentials sent
- **ACTIVE**: User has reset password and is active
- **INACTIVE**: User account deactivated
- **REJECTED**: Registration rejected (future use)

---

## Security

### JWT Token
- Generated on successful login
- Contains user email and role
- Valid for 24 hours (86400000 ms)
- Include in Authorization header: `Bearer <token>`

### Password Encryption
- BCrypt algorithm
- Salt rounds: 10 (default)
- Passwords never stored in plain text

---

## Email Notifications

### Approval Email Template
```
Subject: Agri-Pulse - Registration Approved

Dear User,

Your registration has been approved!

Login Credentials:
Username: farmer@example.com
Temporary Password: TempABC12345

Please login and reset your password immediately.

Best Regards,
Agri-Pulse Team
```

---

## Rate Limiting
Currently no rate limiting implemented. Consider adding for production:
- Login attempts: 5 per 15 minutes
- Registration: 3 per hour per IP
- API calls: 100 per minute per user

---

## CORS Configuration
- Allowed Origins: `http://localhost:3000`
- Allowed Methods: GET, POST, PUT, DELETE
- Allowed Headers: All
- Credentials: Allowed

---

## Testing

### Test Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@agripulse.com","password":"Admin@123"}'
```

### Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "fullName":"Test User",
    "phone":"1234567890",
    "address":"Test Address",
    "role":"FARMER"
  }'
```

---

## Database Access

H2 Console available at: `http://localhost:8080/h2-console`

**Connection Details**:
- JDBC URL: `jdbc:h2:mem:agripulse`
- Username: `sa`
- Password: (empty)

---

## Future API Enhancements

1. **Product Management**
   - POST /api/products
   - GET /api/products
   - PUT /api/products/{id}
   - DELETE /api/products/{id}

2. **Order Management**
   - POST /api/orders
   - GET /api/orders
   - PUT /api/orders/{id}/status

3. **Messaging**
   - POST /api/messages
   - GET /api/messages/conversation/{userId}

4. **Analytics**
   - GET /api/analytics/sales
   - GET /api/analytics/trends

---

**Last Updated**: January 2024
