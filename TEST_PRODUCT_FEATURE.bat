@echo off
REM Test Products Feature - Windows Batch Script
REM This script helps verify that product addition and display is working correctly

echo.
echo ============================================
echo   AGRI-PULSE PRODUCT FEATURE TEST
echo ============================================
echo.

REM Check Java
echo [1/5] Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found. Please install Java 17+
    exit /b 1
) else (
    echo ✅ Java is installed
)

REM Check Maven
echo [2/5] Checking Maven installation...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Maven not found. Please install Maven.
    exit /b 1
) else (
    echo ✅ Maven is installed
)

REM Check Node
echo [3/5] Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 16+
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check database file
echo [4/5] Checking database status...
if exist "backend\agripulse_db.mv.db" (
    echo ✅ Database file found (persistent storage)
) else (
    echo ⓘ Database will be created on first run
)

REM Check application properties
echo [5/5] Checking backend configuration...
findstr "spring.datasource.url" backend\src\main\resources\application.properties | findstr "./agripulse_db" >nul 2>&1
if errorlevel 1 (
    echo ❌ Database is still in-memory mode. Check application.properties
    exit /b 1
) else (
    echo ✅ Database is in file-based persistent mode
)

echo.
echo ============================================
echo   ✅ ALL CHECKS PASSED - READY TO TEST
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Start Backend:
echo    cd C:\agri-pulse\backend
echo    mvn spring-boot:run
echo.
echo 2. In another terminal, Start Frontend:
echo    cd C:\agri-pulse\frontend
echo    npm start
echo.
echo 3. Open http://localhost:3000
echo.
echo 4. Login with farmer credentials
echo.
echo 5. Add a test product in the "Product Details" section
echo.
echo 6. Verify it appears in "Products Listed" table
echo.
echo 7. Refresh page - product should still be there (database persistence)
echo.
echo 8. Check console logs for debug information (look for 🔍, ✅, ❌ icons)
echo.
echo ============================================
echo   TESTING TIPS
echo ============================================
echo.
echo Browser Console:
echo - Press F12 to open Developer Tools
echo - Go to Console tab
echo - Look for logs with 🌐 (API calls), ✅ (success), ❌ (errors)
echo.
echo Backend Logs:
echo - Watch the terminal where mvn spring-boot:run is running
echo - Look for 📝 (product addition), 🔍 (product fetching), 📧 (emails)
echo.
echo Database Verification:
echo - Visit http://localhost:8080/h2-console
echo - JDBC URL: jdbc:h2:./agripulse_db
echo - Username: sa
echo - Password: (leave blank)
echo - Run: SELECT * FROM PRODUCTS;
echo.
echo ============================================
pause
