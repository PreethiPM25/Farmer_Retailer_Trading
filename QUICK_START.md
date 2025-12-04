# Agri-Pulse Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Prerequisites Check
```bash
java -version    # Should be 17+
mvn -version     # Should be 3.6+
node -v          # Should be 16+
npm -v           # Should be 8+
```

### 2. Configure Email (Important!)

Edit `backend/src/main/resources/application.properties`:
```properties
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_16_DIGIT_APP_PASSWORD
```

**Get App Password**: https://myaccount.google.com/apppasswords

### 3. Start Backend

**Option A - Using Script**:
```bash
cd C:\agri-pulse
start-backend.bat
```

**Option B - Manual**:
```bash
cd C:\agri-pulse\backend
mvn spring-boot:run
```

Wait for: "Started AgriPulseApplication"

### 4. Start Frontend

**Option A - Using Script**:
```bash
cd C:\agri-pulse
start-frontend.bat
```

**Option B - Manual**:
```bash
cd C:\agri-pulse\frontend
npm install
npm start
```

Browser opens automatically at http://localhost:3000

## 🎯 Test the Application

### Step 1: Login as Admin
- URL: http://localhost:3000/login
- Email: `admin@agripulse.com`
- Password: `Admin@123`

### Step 2: Register a Farmer
- Click "Register" button
- Fill form:
  - Name: Test Farmer
  - Email: farmer@test.com
  - Phone: 1234567890
  - Address: Test Address
  - Role: Farmer
- Submit

### Step 3: Approve Registration
- Login as admin
- See pending user in dashboard
- Click "Approve User"
- Check email for credentials

### Step 4: Login as Farmer
- Use credentials from email
- Reset password when prompted
- Access farmer dashboard

## 📊 What You'll See

### Landing Page
- Animated floating shapes
- Blue-green gradient theme
- Login/Register buttons

### Admin Dashboard
- 5 statistics cards
- Line chart (weekly growth)
- Pie chart (user categories)
- Bar chart (registration trends)
- Pending approvals list

### User Dashboard
- Profile information
- Account status
- Last login time
- Registration date

## 🎨 Theme & Design

- **Colors**: Blue-green gradient (#0f766e to #10b981)
- **Animations**: Floating shapes, hover effects, smooth transitions
- **Charts**: Interactive Recharts visualizations
- **Responsive**: Works on desktop and mobile

## 📧 Email Setup (Detailed)

### Gmail Configuration

1. **Enable 2FA**:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy 16-digit password

3. **Update Config**:
   ```properties
   spring.mail.username=agripulse@gmail.com
   spring.mail.password=abcd efgh ijkl mnop
   ```

## 🔧 Common Issues

### Backend won't start
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080
# Kill process if needed
taskkill /PID <PID> /F
```

### Frontend won't start
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Email not sending
- Verify Gmail credentials
- Check 2FA is enabled
- Use App Password, not regular password
- Check backend console for errors

## 📁 Project Structure

```
agri-pulse/
├── backend/          # Spring Boot (Java)
│   ├── src/
│   └── pom.xml
├── frontend/         # React (JavaScript)
│   ├── src/
│   └── package.json
└── *.md             # Documentation
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console

## 🔐 Default Credentials

**Admin**:
- Email: admin@agripulse.com
- Password: Admin@123

## 📚 Documentation

- **README.md**: Project overview
- **SETUP_GUIDE.md**: Detailed setup instructions
- **API_DOCUMENTATION.md**: API endpoints reference
- **PROJECT_STRUCTURE.md**: Code organization

## 🎓 User Flow

1. **Farmer/Retailer** registers → Status: PENDING
2. **Admin** reviews and approves → Email sent
3. **User** receives credentials via email
4. **User** logs in → Redirected to reset password
5. **User** resets password → Status: ACTIVE
6. **User** re-logs in → Access dashboard

## 🛠️ Tech Stack

**Backend**:
- Java 17
- Spring Boot 3.2
- Spring Security (JWT)
- H2 Database
- Maven

**Frontend**:
- React 18
- React Router v6
- Axios
- Recharts
- CSS3

## 📊 Features Checklist

✅ Landing page with animations  
✅ User registration (Farmer/Retailer)  
✅ Admin approval workflow  
✅ Email notifications  
✅ Password reset on first login  
✅ Role-based dashboards  
✅ Admin statistics & charts  
✅ User profile display  
✅ Blue-green theme  
✅ Hover animations  
✅ Responsive design  

## 🚀 Next Steps

1. **Customize**:
   - Change colors in App.css
   - Update logo and branding
   - Modify email templates

2. **Extend**:
   - Add product catalog
   - Implement ordering system
   - Add payment gateway

3. **Deploy**:
   - Build production versions
   - Deploy to cloud (AWS/Azure)
   - Configure domain and SSL

## 💡 Tips

- Keep backend running while developing frontend
- Check browser console for errors (F12)
- Use H2 console to inspect database
- Check backend logs for API errors
- Test email with real Gmail account

## 🆘 Need Help?

1. Check SETUP_GUIDE.md for detailed instructions
2. Review API_DOCUMENTATION.md for API details
3. Check backend console for error messages
4. Check browser console for frontend errors
5. Verify all prerequisites are installed

## 🎉 Success Indicators

✅ Backend starts without errors  
✅ Frontend opens in browser  
✅ Landing page displays correctly  
✅ Admin can login  
✅ Registration works  
✅ Admin can approve users  
✅ Email is received  
✅ User can reset password  
✅ Dashboards display data  

---

**You're all set! Happy coding! 🚀**

For detailed information, see:
- SETUP_GUIDE.md
- API_DOCUMENTATION.md
- PROJECT_STRUCTURE.md
