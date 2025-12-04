# Agri-Pulse Setup Guide

Complete step-by-step guide to set up and run the Agri-Pulse application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Email Configuration](#email-configuration)
5. [Running the Application](#running-the-application)
6. [Testing the Application](#testing-the-application)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Java Development Kit (JDK) 17 or higher**
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Verify installation: `java -version`

2. **Apache Maven 3.6+**
   - Download: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -version`

3. **Node.js 16+ and npm**
   - Download: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

4. **Git (Optional)**
   - Download: https://git-scm.com/downloads

5. **Gmail Account**
   - Required for email notifications
   - Must enable 2-Factor Authentication
   - Must generate App Password

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd C:\agri-pulse\backend
```

### Step 2: Configure Email Settings

Edit `src/main/resources/application.properties`:

```properties
# Replace with your Gmail credentials
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-digit-app-password
```

### Step 3: Build the Project
```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile the code
- Run tests
- Create executable JAR file

### Step 4: Verify Build
Look for "BUILD SUCCESS" message in console.

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd C:\agri-pulse\frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- React and React DOM
- React Router
- Axios
- Recharts
- Other dependencies

### Step 3: Verify Installation
Check that `node_modules` folder is created.

---

## Email Configuration

### Gmail App Password Setup

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow setup instructions

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-digit password

3. **Update Backend Configuration**
   - Open `backend/src/main/resources/application.properties`
   - Replace `your-email@gmail.com` with your Gmail
   - Replace `your-app-password` with generated password

**Example**:
```properties
spring.mail.username=agripulse@gmail.com
spring.mail.password=abcd efgh ijkl mnop
```

---

## Running the Application

### Option 1: Run Both Services Separately

#### Terminal 1 - Backend
```bash
cd C:\agri-pulse\backend
mvn spring-boot:run
```

Wait for message: "Started AgriPulseApplication"
Backend runs on: http://localhost:8080

#### Terminal 2 - Frontend
```bash
cd C:\agri-pulse\frontend
npm start
```

Wait for message: "Compiled successfully!"
Frontend runs on: http://localhost:3000

### Option 2: Using IDE

#### Backend (IntelliJ IDEA / Eclipse)
1. Import project as Maven project
2. Right-click `AgriPulseApplication.java`
3. Select "Run"

#### Frontend (VS Code)
1. Open terminal in VS Code
2. Navigate to frontend folder
3. Run `npm start`

---

## Testing the Application

### 1. Access Landing Page
Open browser: http://localhost:3000

You should see:
- Agri-Pulse logo
- Welcome message
- Login and Register buttons
- Animated floating shapes

### 2. Test Admin Login

**Credentials**:
- Email: `admin@agripulse.com`
- Password: `Admin@123`

**Steps**:
1. Click "Login" button
2. Enter admin credentials
3. Click "Login"
4. Should redirect to Admin Dashboard

**Expected Result**:
- Dashboard with statistics
- Charts (Line, Pie, Bar)
- Pending users section

### 3. Test User Registration

**Steps**:
1. Click "Register" button
2. Fill in form:
   - Full Name: John Farmer
   - Email: john@farmer.com
   - Phone: 1234567890
   - Address: 123 Farm Road
   - Role: Farmer
   - Document: (optional)
3. Click "Register"

**Expected Result**:
- Success message
- Redirect to login page

### 4. Test Admin Approval

**Steps**:
1. Login as admin
2. Scroll to "Pending User Approvals"
3. Find John Farmer
4. Click "Approve User"

**Expected Result**:
- Success alert
- Email sent to john@farmer.com
- User removed from pending list

### 5. Test First Login & Password Reset

**Steps**:
1. Check email for temporary password
2. Login with email and temp password
3. Should redirect to Reset Password page
4. Enter old password (temp password)
5. Enter new password twice
6. Click "Reset Password"

**Expected Result**:
- Success message
- Redirect to login
- Can login with new password

### 6. Test User Dashboard

**Steps**:
1. Login with new password
2. View dashboard

**Expected Result**:
- Profile information displayed
- Account status shown
- Last login timestamp

---

## Troubleshooting

### Backend Issues

#### Issue: Port 8080 already in use
**Solution**:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Change port in application.properties
server.port=8081
```

#### Issue: Maven build fails
**Solution**:
```bash
# Clear Maven cache
mvn clean
mvn dependency:purge-local-repository
mvn clean install
```

#### Issue: Database error
**Solution**:
- H2 is in-memory, restarts fresh each time
- Check H2 console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:agripulse`

### Frontend Issues

#### Issue: npm install fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

#### Issue: Port 3000 already in use
**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
set PORT=3001 && npm start
```

#### Issue: API calls fail (CORS error)
**Solution**:
- Ensure backend is running
- Check backend console for errors
- Verify CORS configuration in SecurityConfig.java

### Email Issues

#### Issue: Email not sending
**Solution**:
1. Verify Gmail credentials in application.properties
2. Ensure 2FA is enabled
3. Use App Password, not regular password
4. Check Gmail "Less secure app access" (if needed)
5. Check backend console for email errors

#### Issue: Email goes to spam
**Solution**:
- Mark as "Not Spam" in Gmail
- Add sender to contacts
- Configure SPF/DKIM (production)

### Login Issues

#### Issue: Admin login fails
**Solution**:
- Verify credentials: admin@agripulse.com / Admin@123
- Check backend logs
- Verify database initialization

#### Issue: User can't login after approval
**Solution**:
- Check email for credentials
- Verify user status is APPROVED
- Check backend logs for errors

---

## Development Tips

### Hot Reload

**Backend**:
- Use Spring Boot DevTools
- Add to pom.xml:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

**Frontend**:
- React hot reload enabled by default
- Save file to see changes instantly

### Debugging

**Backend**:
- Add breakpoints in IDE
- Run in debug mode
- Check console logs

**Frontend**:
- Use browser DevTools (F12)
- Check Console tab for errors
- Use React DevTools extension

### Database Inspection

Access H2 Console:
1. Go to: http://localhost:8080/h2-console
2. JDBC URL: `jdbc:h2:mem:agripulse`
3. Username: `sa`
4. Password: (leave empty)
5. Click "Connect"

---

## Production Deployment

### Backend

1. **Build JAR**:
```bash
mvn clean package
```

2. **Run JAR**:
```bash
java -jar target/agri-pulse-backend-1.0.0.jar
```

3. **Use Production Database**:
- Replace H2 with MySQL/PostgreSQL
- Update application.properties

### Frontend

1. **Build Production**:
```bash
npm run build
```

2. **Deploy**:
- Upload `build` folder to web server
- Configure nginx/Apache
- Set environment variables

### Environment Variables

**Backend**:
```bash
export SPRING_MAIL_USERNAME=your-email@gmail.com
export SPRING_MAIL_PASSWORD=your-app-password
export JWT_SECRET=your-secret-key
```

**Frontend**:
```bash
export REACT_APP_API_URL=https://api.agripulse.com
```

---

## Next Steps

1. **Customize Branding**
   - Update logo and colors
   - Modify landing page content

2. **Add Features**
   - Product catalog
   - Order management
   - Payment integration

3. **Enhance Security**
   - Add rate limiting
   - Implement refresh tokens
   - Add input sanitization

4. **Improve UX**
   - Add loading spinners
   - Improve error messages
   - Add notifications

---

## Support

For issues:
1. Check this guide
2. Review error messages
3. Check backend/frontend logs
4. Search online for specific errors

---

**Happy Coding! 🚀**
