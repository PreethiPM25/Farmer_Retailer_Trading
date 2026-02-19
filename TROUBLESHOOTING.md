# 🔧 TROUBLESHOOTING GUIDE

## Problem: Pending Approvals Not Showing

### Solution Steps:

1. **CHECK BACKEND IS RUNNING**
   ```bash
   # Run this command:
   netstat -ano | findstr :8080
   
   # You should see: TCP 0.0.0.0:8080 ... LISTENING
   # If not, backend is NOT running!
   ```

2. **START BACKEND**
   ```bash
   cd C:\agri-pulse\backend
   mvn spring-boot:run
   
   # WAIT for: "Started AgriPulseApplication"
   ```

3. **TEST BACKEND** (Double-click: TEST-BACKEND.bat)
   - Should show JSON data
   - If error, backend is not running

4. **REGISTER A NEW USER**
   - Go to: http://localhost:3000/register
   - Fill form and submit
   - Check browser console (F12) for errors

5. **CHECK ADMIN DASHBOARD**
   - Login as admin: pmpreethi25@gmail.com / Admin@123
   - Go to admin dashboard
   - Check browser console (F12) for errors
   - Should see pending user

## Problem: Email Not Sending

### Current Email Configuration:
- **From Email**: preeths.252005@gmail.com
- **App Password**: eaidlnrogovhrrhj
- **SMTP**: Gmail (smtp.gmail.com:587)

### Email Sends When:
1. Admin approves a PENDING user
2. Temporary password is generated
3. Email sent to user's registered email

### To Test Email:
1. Register with YOUR email address
2. Login as admin
3. Approve the registration
4. Check YOUR email inbox (and spam folder!)

## Problem: Password Reset Not Working

### Check:
1. Backend running?
2. Browser console for errors?
3. Network tab shows API calls?

## Common Errors:

### "Network Error" or "ERR_CONNECTION_REFUSED"
- ❌ Backend is NOT running
- ✅ Start backend: `cd backend && mvn spring-boot:run`

### "Invalid credentials"
- ❌ Wrong email/password
- ✅ Use exact credentials:
  - Admin: pmpreethi25@gmail.com / Admin@123
  - Farmer: preeths.252005@gmail.com / Murali@123
  - Retailer: paviii.061984@gmail.com / Pavi@123

### "Port 8080 already in use"
```bash
# Kill existing process:
for /f "tokens=5" %a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do taskkill /F /PID %a
```

## Debug Mode:

1. **Open Browser Console** (F12)
2. **Go to Console tab**
3. **Try the action** (register/login/approve)
4. **Check console messages** - they show exactly what's happening!

## Still Not Working?

Check these in order:
1. ✅ Backend running? (`netstat -ano | findstr :8080`)
2. ✅ Frontend running? (http://localhost:3000)
3. ✅ Browser console shows errors?
4. ✅ Network tab shows API calls?
5. ✅ Backend terminal shows errors?

## Quick Reset:

```bash
# 1. Kill everything
taskkill /F /IM java.exe
taskkill /F /IM node.exe

# 2. Start backend
cd C:\agri-pulse\backend
mvn spring-boot:run

# 3. Wait for "Started AgriPulseApplication"

# 4. Start frontend (NEW terminal)
cd C:\agri-pulse\frontend
npm start
```

## Contact Info:
If still having issues, check the browser console and backend terminal for specific error messages!
