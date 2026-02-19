@echo off
echo Testing backend connection...
timeout /t 2 /nobreak > nul
curl -s http://localhost:8080/api/products
if %errorlevel% == 0 (
    echo.
    echo ✅ Backend is working!
) else (
    echo ❌ Backend not responding
)
pause