# 🚀 QUICK START GUIDE

## Step 1: Start Backend (MUST DO FIRST!)

**Option A: Using the batch file**
```
Double-click: START-BACKEND.bat
```

**Option B: Manual command**
```bash
cd C:\agri-pulse\backend
mvn spring-boot:run
```

**Wait until you see:** `Started AgriPulseApplication` (takes ~20 seconds)

## Step 2: Start Frontend

Open a NEW terminal:
```bash
cd C:\agri-pulse\frontend
npm start
```

## Step 3: Login Credentials

### Admin
- Email: `pmpreethi25@gmail.com`
- Password: `Admin@123`
- Dashboard: http://localhost:3000/admin/dashboard

### Farmer
- Email: `preeths.252005@gmail.com`
- Password: `Murali@123`
- Dashboard: http://localhost:3000/farmer/dashboard

### Retailer
- Email: `paviii.061984@gmail.com`
- Password: `Pavi@123`
- Dashboard: http://localhost:3000/retailer/dashboard

## Troubleshooting

### "Invalid credentials" error
- ✅ Make sure backend is running (check for "Started AgriPulseApplication" message)
- ✅ Wait 20 seconds after backend starts
- ✅ Check browser console (F12) for error details

### "Network Error" or "Cannot connect"
- ✅ Backend is not running - start it first!
- ✅ Check if port 8080 is free: `netstat -ano | findstr :8080`

### Port 8080 already in use
```bash
for /f "tokens=5" %a in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do taskkill /F /PID %a
```

## Test Backend (Optional)

Open `test-login.html` in browser and click the test buttons to verify backend is working.

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- H2 Database Console: http://localhost:8080/h2-console
