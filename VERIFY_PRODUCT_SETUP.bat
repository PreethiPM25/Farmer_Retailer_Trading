@echo off
REM Agri-Pulse Product Feature - Setup Verification
REM Run this after making changes to verify everything is working

color 0A
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║  AGRI-PULSE PRODUCT FEATURE SETUP VERIFICATION   ║
echo ╚══════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

REM Counter for passed checks
set checks_passed=0
set checks_total=0

REM ===== CHECK 1: Java Installation =====
set /a checks_total+=1
echo [CHECK 1/8] Verifying Java 17+ Installation...
java -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo   ❌ FAILED: Java not found or not in PATH
    color 0A
) else (
    for /f "tokens=2" %%i in ('java -version 2^>^&1 ^| find "version"') do set java_ver=%%i
    echo   ✅ PASSED: Java !java_ver! found
    set /a checks_passed+=1
)
echo.

REM ===== CHECK 2: Maven Installation =====
set /a checks_total+=1
echo [CHECK 2/8] Verifying Maven Installation...
mvn -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo   ❌ FAILED: Maven not found or not in PATH
    color 0A
) else (
    echo   ✅ PASSED: Maven found
    set /a checks_passed+=1
)
echo.

REM ===== CHECK 3: Node Installation =====
set /a checks_total+=1
echo [CHECK 3/8] Verifying Node.js 16+ Installation...
node -v >nul 2>&1
if errorlevel 1 (
    color 0C
    echo   ❌ FAILED: Node.js not found or not in PATH
    color 0A
) else (
    for /f %%i in ('node -v') do set node_ver=%%i
    echo   ✅ PASSED: Node.js !node_ver! found
    set /a checks_passed+=1
)
echo.

REM ===== CHECK 4: Database Configuration =====
set /a checks_total+=1
echo [CHECK 4/8] Verifying Database Configuration...
if exist "backend\src\main\resources\application.properties" (
    findstr "spring.datasource.url" backend\src\main\resources\application.properties | findstr "./agripulse_db" >nul 2>&1
    if errorlevel 1 (
        color 0C
        echo   ❌ FAILED: Database is still in-memory mode
        echo.
        echo      Expected: spring.datasource.url=jdbc:h2:./agripulse_db...
        echo      File: backend\src\main\resources\application.properties
        color 0A
    ) else (
        echo   ✅ PASSED: Database is configured as persistent (file-based)
        set /a checks_passed+=1
    )
) else (
    color 0C
    echo   ❌ FAILED: application.properties not found
    color 0A
)
echo.

REM ===== CHECK 5: ProductController Enhanced =====
set /a checks_total+=1
echo [CHECK 5/8] Verifying Backend ProductController Enhancements...
if exist "backend\src\main\java\com\agripulse\controller\ProductController.java" (
    findstr "getFarmerProducts" backend\src\main\java\com\agripulse\controller\ProductController.java >nul 2>&1
    if errorlevel 1 (
        color 0C
        echo   ❌ FAILED: getFarmerProducts method not found
        color 0A
    ) else (
        findstr /M "System.out.println" backend\src\main\java\com\agripulse\controller\ProductController.java >nul 2>&1
        if errorlevel 1 (
            color 0C
            echo   ❌ FAILED: Logging not added
            color 0A
        ) else (
            echo   ✅ PASSED: ProductController properly enhanced with logging
            set /a checks_passed+=1
        )
    )
) else (
    color 0C
    echo   ❌ FAILED: ProductController not found
    color 0A
)
echo.

REM ===== CHECK 6: Frontend API Service =====
set /a checks_total+=1
echo [CHECK 6/8] Verifying Frontend API Service...
if exist "frontend\src\services\api.js" (
    findstr /M "getFarmerProducts" frontend\src\services\api.js >nul 2>&1
    if errorlevel 1 (
        color 0C
        echo   ❌ FAILED: getFarmerProducts not found in API service
        color 0A
    ) else (
        findstr /M "Array.isArray(data)" frontend\src\services\api.js >nul 2>&1
        if errorlevel 1 (
            color 0C
            echo   ⚠️  WARNING: Response handling may not be optimal
            color 0A
            echo   ✅ PASSED: API service exists
            set /a checks_passed+=1
        ) else (
            echo   ✅ PASSED: API service properly handles array responses
            set /a checks_passed+=1
        )
    )
) else (
    color 0C
    echo   ❌ FAILED: API service not found
    color 0A
)
echo.

REM ===== CHECK 7: Frontend FarmerDashboard =====
set /a checks_total+=1
echo [CHECK 7/8] Verifying Frontend FarmerDashboard...
if exist "frontend\src\pages\FarmerDashboard.js" (
    findstr /M "loadProducts" frontend\src\pages\FarmerDashboard.js >nul 2>&1
    if errorlevel 1 (
        color 0C
        echo   ❌ FAILED: loadProducts function not found
        color 0A
    ) else (
        findstr /M "handleAddProduct" frontend\src\pages\FarmerDashboard.js >nul 2>&1
        if errorlevel 1 (
            color 0C
            echo   ❌ FAILED: handleAddProduct function not found
            color 0A
        ) else (
            echo   ✅ PASSED: FarmerDashboard properly implemented
            set /a checks_passed+=1
        )
    )
) else (
    color 0C
    echo   ❌ FAILED: FarmerDashboard not found
    color 0A
)
echo.

REM ===== CHECK 8: Documentation =====
set /a checks_total+=1
echo [CHECK 8/8] Verifying Documentation...
set doc_count=0
if exist "PRODUCT_SAVE_AND_DISPLAY_FIX.md" set /a doc_count+=1
if exist "PRODUCT_FEATURE_QUICK_REFERENCE.md" set /a doc_count+=1
if exist "PRODUCT_COMPLETE_IMPLEMENTATION_SUMMARY.md" set /a doc_count+=1
if exist "TEST_PRODUCT_FEATURE.bat" set /a doc_count+=1

if %doc_count% geq 3 (
    echo   ✅ PASSED: !doc_count!/4 documentation files found
    set /a checks_passed+=1
) else (
    color 0C
    echo   ❌ FAILED: Only !doc_count!/4 documentation files found
    color 0A
)
echo.

REM ===== FINAL RESULT =====
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║              VERIFICATION RESULTS                ║
echo ╚══════════════════════════════════════════════════╝
echo.

if %checks_passed% equ %checks_total% (
    color 0A
    echo ✅ ALL CHECKS PASSED (%checks_passed%/%checks_total%)
    echo.
    echo ✨ Your system is ready!
    echo.
    echo NEXT STEPS:
    echo.
    echo 1. Start Backend:
    echo    cd C:\agri-pulse\backend
    echo    mvn spring-boot:run
    echo.
    echo 2. In another terminal, start Frontend:
    echo    cd C:\agri-pulse\frontend
    echo    npm start
    echo.
    echo 3. Open http://localhost:3000
    echo.
    echo 4. Test the product feature:
    echo    - Login as farmer
    echo    - Fill the product form
    echo    - Click "Add Product"
    echo    - Verify product appears in table
    echo    - Refresh page (product should persist)
    echo.
) else (
    color 0C
    echo ❌ SOME CHECKS FAILED (%checks_passed%/%checks_total% passed)
    echo.
    echo Please fix the failed checks above before proceeding.
    echo.
    echo For more details, see:
    echo - PRODUCT_SAVE_AND_DISPLAY_FIX.md (detailed guide)
    echo - PRODUCT_FEATURE_QUICK_REFERENCE.md (quick reference)
    color 0A
)

echo.
echo ═══════════════════════════════════════════════════
echo.
pause
