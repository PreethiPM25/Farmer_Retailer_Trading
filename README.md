# Agri-Pulse - Farmer to Retailer Platform

A comprehensive web application connecting farmers directly with retailers, featuring role-based dashboards and admin approval workflow.

## Features

### 🎯 Core Functionality
- **3 User Roles**: Admin, Farmer, Retailer
- **Registration System**: Farmers and retailers can register with document upload
- **Admin Approval**: Admin reviews and approves registrations
- **Email Notifications**: Automatic credential delivery via Gmail
- **Password Management**: Mandatory password reset on first login
- **Role-Based Dashboards**: Separate dashboards for each user type

### 📊 Admin Dashboard
- Total registered users
- Active/Inactive user counts
- Users who haven't reset passwords
- Today's new registrations
- Weekly growth line chart
- User category pie chart
- Registration trends bar chart
- Pending approval management

### 👤 User Dashboards (Farmer/Retailer)
- Profile information
- Account status
- Last login timestamp
- Registration date
- Password reset status

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **H2 Database** (In-memory)
- **Spring Mail** (Gmail SMTP)
- **Maven**

### Frontend
- **React 18**
- **React Router v6**
- **Axios** (HTTP Client)
- **Recharts** (Data Visualization)
- **CSS3** (Animations & Gradients)

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6+
- Gmail account with App Password

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure email in `src/main/resources/application.properties`:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

3. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

Frontend will start on `http://localhost:3000`

## Default Admin Credentials

```
Email: admin@agripulse.com
Password: Admin@123
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Reset password

### Admin
- `GET /api/admin/pending-users` - Get pending approvals
- `POST /api/admin/approve/{userId}` - Approve user
- `GET /api/admin/dashboard-stats` - Get dashboard statistics

### User
- `GET /api/user/dashboard/{email}` - Get user dashboard data

## User Flow

1. **Registration**: Farmer/Retailer registers with details
2. **Admin Review**: Admin sees pending request in dashboard
3. **Approval**: Admin approves and system sends email with credentials
4. **First Login**: User logs in with temporary password
5. **Password Reset**: User must reset password
6. **Re-login**: User logs in with new password
7. **Dashboard Access**: User accesses role-specific dashboard

## Design Theme

- **Primary Colors**: Blue-Green gradient (#0f766e to #10b981)
- **Animations**: Floating shapes, hover effects, smooth transitions
- **Responsive**: Mobile-friendly design
- **Modern UI**: Cards, gradients, shadows, and animations

## Database Schema

### User Entity
- id (Primary Key)
- email (Unique)
- password (Encrypted)
- fullName
- phone
- address
- documentPath
- role (ADMIN/FARMER/RETAILER)
- status (PENDING/APPROVED/ACTIVE/INACTIVE)
- passwordReset (boolean)
- registrationDate
- lastLogin
- approvalDate

## Security Features

- Password encryption (BCrypt)
- JWT token authentication
- Role-based access control
- CORS configuration
- Input validation

## Email Configuration

To enable email functionality:

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password: Google Account → Security → App Passwords
3. Use App Password in application.properties

## Future Enhancements

- Product listing and ordering
- Real-time chat between farmers and retailers
- Payment gateway integration
- Advanced analytics and reporting
- Mobile application
- Multi-language support

## License

MIT License - Free to use and modify

## Support

For issues and questions, please create an issue in the repository.

---

**Developed with ❤️ for connecting Farmers and Retailers**
