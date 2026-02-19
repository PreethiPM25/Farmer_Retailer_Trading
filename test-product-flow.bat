@echo off
echo Testing Product Flow...
echo.

echo 1. Checking if backend is running on port 8081...
netstat -ano | findstr "LISTENING.*:8081" > nul
if %errorlevel% == 0 (
    echo ✅ Backend is running on port 8081
) else (
    echo ❌ Backend is NOT running on port 8081
    echo Starting backend...
    start cmd /k "cd /d C:\agri-pulse\backend && mvn spring-boot:run"
    timeout /t 15
)

echo.
echo 2. Checking if frontend is running on port 3000...
netstat -ano | findstr "LISTENING.*:3000" > nul
if %errorlevel% == 0 (
    echo ✅ Frontend is running on port 3000
) else (
    echo ❌ Frontend is NOT running on port 3000
    echo Starting frontend...
    start cmd /k "cd /d C:\agri-pulse\frontend && npm start"
    timeout /t 10
)

echo.
echo 3. Testing backend API...
curl -s http://localhost:8081/api/products > nul
if %errorlevel% == 0 (
    echo ✅ Backend API is responding
) else (
    echo ❌ Backend API is not responding
)

echo.
echo 4. Opening application in browser...
start http://localhost:3000

echo.
echo ✅ Test complete! 
echo.
echo Next steps:
echo 1. Login as farmer (check console for credentials)
echo 2. Go to Products tab
echo 3. Add a product
echo 4. Check if it appears in the table immediately
echo 5. Check backend console for email logs

pause