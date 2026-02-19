@echo off
REM System Verification Script
echo.
echo ╔═══════════════════════════════════════════╗
echo ║  AGRI-PULSE SYSTEM VERIFICATION           ║
echo ╚═══════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

REM Check Java
echo [1/5] Checking Java Installation...
java -version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Java is installed
) else (
    echo ❌ Java not found - Install JDK 17 or higher
)
echo.

REM Check Node
echo [2/5] Checking Node.js Installation...
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js is installed
) else (
    echo ❌ Node.js not found - Install Node.js LTS
)
echo.

REM Check Backend Files
echo [3/5] Checking Backend Files...
if exist "C:\agri-pulse\backend\target\agri-pulse-backend-1.0.0.jar" (
    echo ✅ Backend JAR built successfully
) else (
    echo ❌ Backend JAR not found - Run: cd C:\agri-pulse\backend ^&^& mvn clean package
)
echo.

REM Check Frontend Files
echo [4/5] Checking Frontend Installation...
if exist "C:\agri-pulse\frontend\node_modules" (
    echo ✅ Frontend node_modules installed
) else (
    echo ❌ node_modules not found - Run: cd C:\agri-pulse\frontend ^&^& npm install
)
echo.

REM Check Database
echo [5/5] Checking Database...
if exist "C:\agri-pulse\backend\agripulse_db.mv.db" (
    echo ✅ Database file exists (data will persist)
) else (
    echo ⚠️  Database will be created on first run
)
echo.

echo ╔═══════════════════════════════════════════╗
echo ║  VERIFICATION COMPLETE                    ║
echo ║  Ready to start system with:              ║
echo ║  START_ALL_SYSTEMS.bat                    ║
echo ╚═══════════════════════════════════════════╝
echo.
pause
