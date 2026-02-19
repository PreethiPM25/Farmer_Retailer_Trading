@echo off
echo ========================================
echo    FIXING PRODUCT ADDITION ERROR
echo ========================================
echo.

echo Step 1: Stopping existing backend...
taskkill /f /im java.exe >nul 2>&1
echo ✅ Backend stopped

echo.
echo Step 2: Going to backend directory...
cd /d "c:\agri-pulse\backend"

echo.
echo Step 3: Rebuilding backend with fixes...
mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)
echo ✅ Build successful

echo.
echo Step 4: Starting backend with detailed logging...
echo ⚡ Backend starting on http://localhost:8080
echo 📝 Watch for detailed product addition logs
echo.
mvn spring-boot:run

pause