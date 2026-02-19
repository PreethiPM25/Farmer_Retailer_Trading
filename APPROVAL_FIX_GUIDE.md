# Approval Flow - Fixed & Enhanced

## What Was Fixed

### 1. Enhanced Logging
- **Registration**: Now logs every new user registration with status
- **Approval**: Logs user details, temp password, and email status
- **Email**: Shows success/failure with detailed error messages

### 2. Better Error Handling
- Approval now returns temp password even if email fails
- Admin dashboard shows temp password in success message
- Email errors are caught and displayed

### 3. Admin Dashboard Improvements
- Shows temp password after approval
- Displays email status (sent/failed)
- Extended message display time to 5 seconds
- Real-time refresh every 5 seconds

## How to Test the Complete Flow

### Step 1: Start the Application
```bash
# Run this script
RESTART_WITH_FIXES.bat
```

### Step 2: Register a New User
1. Open http://localhost:3000
2. Click "Register"
3. Fill in details:
   - Full Name: Test Farmer
   - Email: testfarmer@example.com
   - Phone: 9876543210
   - Address: Test Farm Address
   - Role: Farmer
   - Upload any document
4. Click "Register"
5. You should see: "Registration successful! Admin will review your request."

### Step 3: Check Backend Logs
Look for this in the backend console:
```
=== NEW REGISTRATION ===
Email: testfarmer@example.com
Role: FARMER
✓ User registered with ID: 4
✓ Status: PENDING
✓ Pending approval count: 1
```

### Step 4: Admin Approval
1. Open http://localhost:3000/admin/dashboard
2. Login with:
   - Email: pmpreethi25@gmail.com
   - Password: Admin@123
3. You should see "Pending User Approvals (1)"
4. Click "✓ Approve User" button

### Step 5: Check Approval Results

**In Admin Dashboard:**
You'll see a success message like:
```
✓ User approved successfully! | Email: testfarmer@example.com | Temp Password: Tempabcd1234 | Email sent successfully!
```

**In Backend Console:**
```
=== USER APPROVAL ===
User ID: 4
Email: testfarmer@example.com
Temp Password: Tempabcd1234
Status: APPROVED
✓ Email sent successfully to: testfarmer@example.com
```

### Step 6: Check Email
The user should receive an email at testfarmer@example.com with:
- Subject: "Agri-Pulse - Registration Approved"
- Username: testfarmer@example.com
- Temporary Password: Tempabcd1234

### Step 7: User Login
1. User logs in with temp password
2. System forces password reset
3. User sets new password
4. User can now access their dashboard

## Troubleshooting

### No Pending Users Showing?
**Cause**: No new registrations or all already approved
**Solution**: Register a new user first

### Email Not Sending?
**Cause**: Gmail configuration issue
**Check**:
1. application.properties has correct email/password
2. Gmail App Password is valid (not regular password)
3. 2FA is enabled on Gmail account

**Workaround**: Even if email fails, the temp password is shown in admin dashboard

### Backend Not Running?
**Check**: 
```bash
curl http://localhost:8080/api/admin/dashboard-stats
```
If it fails, restart backend:
```bash
cd backend
mvn spring-boot:run
```

### Frontend Not Showing Pending Users?
**Check**:
1. Backend is running (port 8080)
2. Frontend is running (port 3000)
3. Browser console for errors (F12)
4. Refresh the page or click "🔄 Refresh" button

## Email Configuration

Current configuration in `backend/src/main/resources/application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=preeths.252005@gmail.com
spring.mail.password=eaidlnrogovhrrhj
```

To use your own email:
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update application.properties with your email and app password
4. Restart backend

## API Endpoints

### Check Pending Users
```bash
curl http://localhost:8080/api/admin/pending-users
```

### Approve User
```bash
curl -X POST http://localhost:8080/api/admin/approve/USER_ID
```

### Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","fullName":"Test User","phone":"1234567890","address":"Test Address","role":"FARMER","documentPath":"test.pdf"}'
```

## Quick Test Script

Run this to test the complete flow:
```bash
TEST_APPROVAL_FLOW.bat
```

This will:
1. Check if backend is running
2. Show current pending users
3. Register a test farmer
4. Show updated pending users
5. Guide you to approve via admin dashboard

## Success Indicators

✓ Registration creates user with PENDING status
✓ Admin dashboard shows pending user count
✓ Approval generates temp password
✓ Email is sent (or temp password shown if email fails)
✓ User can login with temp password
✓ User is forced to reset password
✓ User becomes ACTIVE after password reset

## Support

If issues persist:
1. Check backend console logs
2. Check browser console (F12)
3. Verify email configuration
4. Ensure both backend and frontend are running
5. Try the test scripts provided
