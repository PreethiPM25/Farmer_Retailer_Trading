@echo off
echo ========================================
echo    TESTING PRODUCT ADDITION FIX
echo ========================================
echo.

echo 🔍 Testing if backend is running...
netstat -ano | findstr ":8080" >nul
if %errorlevel% neq 0 (
    echo ❌ Backend not running on port 8080
    echo 📝 Please run FIX_PRODUCT_ERROR.bat first
    pause
    exit /b 1
)
echo ✅ Backend is running on port 8080

echo.
echo 🧪 Testing product addition API...
curl -X POST "http://localhost:8080/api/products" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test Rice\",\"quantity\":100,\"unit\":\"kg\",\"price\":50,\"availability\":\"Available\",\"location\":\"Punjab\",\"deliveryDays\":7,\"farmerEmail\":\"farmer@example.com\"}"

echo.
echo.
echo 📋 WHAT TO DO NOW:
echo 1. If you see product data above = ✅ API FIXED!
echo 2. If you see error message = ❌ Still has issues
echo 3. Go to http://localhost:3001 and test the form
echo 4. Login with: farmer@example.com / password123
echo 5. Try adding a product through the web form
echo.

pause