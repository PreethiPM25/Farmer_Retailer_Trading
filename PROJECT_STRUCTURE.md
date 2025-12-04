# Agri-Pulse Project Structure

```
agri-pulse/
│
├── backend/                                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/agripulse/
│   │   │   │   ├── AgriPulseApplication.java  # Main application class
│   │   │   │   ├── config/
│   │   │   │   │   └── SecurityConfig.java    # Security & CORS configuration
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java    # Authentication endpoints
│   │   │   │   │   ├── AdminController.java   # Admin management endpoints
│   │   │   │   │   └── UserController.java    # User dashboard endpoints
│   │   │   │   ├── dto/
│   │   │   │   │   ├── RegistrationRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── PasswordResetRequest.java
│   │   │   │   │   └── DashboardStats.java
│   │   │   │   ├── model/
│   │   │   │   │   └── User.java              # User entity
│   │   │   │   ├── repository/
│   │   │   │   │   └── UserRepository.java    # JPA repository
│   │   │   │   ├── security/
│   │   │   │   │   └── JwtUtil.java           # JWT token utility
│   │   │   │   └── service/
│   │   │   │       ├── EmailService.java      # Email sending service
│   │   │   │       └── UserService.java       # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties     # Configuration
│   │   └── test/                              # Test files
│   └── pom.xml                                # Maven dependencies
│
├── frontend/                                   # React Frontend
│   ├── public/
│   │   └── index.html                         # HTML template
│   ├── src/
│   │   ├── components/                        # Reusable components (future)
│   │   ├── pages/
│   │   │   ├── LandingPage.js                 # Home/Landing page
│   │   │   ├── LoginPage.js                   # Login page
│   │   │   ├── RegistrationPage.js            # Registration form
│   │   │   ├── ResetPassword.js               # Password reset page
│   │   │   ├── AdminDashboard.js              # Admin dashboard with charts
│   │   │   ├── FarmerDashboard.js             # Farmer dashboard
│   │   │   └── RetailerDashboard.js           # Retailer dashboard
│   │   ├── services/
│   │   │   └── api.js                         # API service layer
│   │   ├── styles/
│   │   │   └── App.css                        # Global styles
│   │   ├── App.js                             # Main app component
│   │   └── index.js                           # React entry point
│   └── package.json                           # npm dependencies
│
├── README.md                                   # Project overview
├── API_DOCUMENTATION.md                        # API endpoints documentation
├── SETUP_GUIDE.md                             # Setup instructions
├── PROJECT_STRUCTURE.md                        # This file
├── start-backend.bat                          # Windows script to start backend
└── start-frontend.bat                         # Windows script to start frontend
```

## Key Components

### Backend Architecture

#### Controllers (REST API Layer)
- **AuthController**: Handles registration, login, password reset
- **AdminController**: Manages user approvals and dashboard stats
- **UserController**: Provides user-specific dashboard data

#### Services (Business Logic Layer)
- **UserService**: Core business logic for user management
- **EmailService**: Handles email notifications via Gmail SMTP

#### Repositories (Data Access Layer)
- **UserRepository**: JPA repository with custom queries for statistics

#### Security
- **JwtUtil**: JWT token generation and validation
- **SecurityConfig**: Spring Security configuration with BCrypt

#### DTOs (Data Transfer Objects)
- Request/Response objects for API communication
- Validation annotations for input validation

### Frontend Architecture

#### Pages (Route Components)
- **LandingPage**: Marketing page with animations
- **LoginPage**: Authentication form
- **RegistrationPage**: User registration form
- **ResetPassword**: Password change form
- **AdminDashboard**: Statistics, charts, user approvals
- **FarmerDashboard**: Farmer profile and info
- **RetailerDashboard**: Retailer profile and info

#### Services
- **api.js**: Axios-based API client with organized endpoints

#### Styles
- **App.css**: Comprehensive CSS with animations, gradients, hover effects

## Data Flow

### Registration Flow
```
User → RegistrationPage → authAPI.register() → AuthController
→ UserService.register() → UserRepository.save() → Database
```

### Login Flow
```
User → LoginPage → authAPI.login() → AuthController
→ UserService.login() → JwtUtil.generateToken() → Response with JWT
```

### Approval Flow
```
Admin → AdminDashboard → adminAPI.approveUser() → AdminController
→ UserService.approveUser() → EmailService.sendCredentials() → Gmail SMTP
```

### Dashboard Flow
```
User → Dashboard → userAPI.getDashboard() → UserController
→ UserService.getUserDashboard() → UserRepository → Response
```

## Technology Stack Details

### Backend Dependencies
- **spring-boot-starter-web**: REST API
- **spring-boot-starter-data-jpa**: Database ORM
- **spring-boot-starter-security**: Authentication & Authorization
- **spring-boot-starter-mail**: Email functionality
- **spring-boot-starter-validation**: Input validation
- **h2database**: In-memory database
- **jjwt**: JWT token library
- **lombok**: Reduce boilerplate code

### Frontend Dependencies
- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **recharts**: Data visualization (charts)
- **react-scripts**: Build tools

## Design Patterns Used

### Backend
1. **MVC Pattern**: Controller → Service → Repository
2. **DTO Pattern**: Separate request/response objects
3. **Repository Pattern**: Data access abstraction
4. **Dependency Injection**: Spring IoC container
5. **Builder Pattern**: JWT token creation

### Frontend
1. **Component-Based Architecture**: Reusable React components
2. **Service Layer Pattern**: Centralized API calls
3. **Container/Presentational**: Smart vs dumb components
4. **Hooks Pattern**: useState, useEffect for state management

## Security Features

1. **Password Encryption**: BCrypt hashing
2. **JWT Authentication**: Stateless token-based auth
3. **CORS Protection**: Configured allowed origins
4. **Input Validation**: Jakarta validation annotations
5. **SQL Injection Prevention**: JPA parameterized queries

## Database Schema

### users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address VARCHAR(500),
    document_path VARCHAR(500),
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    password_reset BOOLEAN DEFAULT FALSE,
    registration_date TIMESTAMP,
    last_login TIMESTAMP,
    approval_date TIMESTAMP
);
```

## API Endpoints Summary

### Public Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/reset-password

### Admin Endpoints
- GET /api/admin/pending-users
- POST /api/admin/approve/{userId}
- GET /api/admin/dashboard-stats

### User Endpoints
- GET /api/user/dashboard/{email}

## Environment Configuration

### Development
- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- Database: H2 in-memory

### Production (Recommended)
- Backend: https://api.agripulse.com
- Frontend: https://agripulse.com
- Database: MySQL/PostgreSQL

## Build & Deployment

### Backend Build
```bash
mvn clean package
# Creates: target/agri-pulse-backend-1.0.0.jar
```

### Frontend Build
```bash
npm run build
# Creates: build/ directory with optimized static files
```

## Future Enhancements

### Planned Features
1. Product catalog management
2. Order placement and tracking
3. Real-time messaging
4. Payment gateway integration
5. Advanced analytics
6. Mobile responsive improvements
7. Multi-language support
8. File upload for documents
9. Notification system
10. User profile editing

### Technical Improvements
1. Add Redis for caching
2. Implement refresh tokens
3. Add rate limiting
4. Implement logging (SLF4J)
5. Add unit tests
6. Add integration tests
7. Implement CI/CD pipeline
8. Add API documentation (Swagger)
9. Implement WebSocket for real-time updates
10. Add monitoring (Prometheus/Grafana)

---

**Last Updated**: January 2024
