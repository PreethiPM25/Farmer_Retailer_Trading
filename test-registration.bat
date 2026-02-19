@echo off
echo Testing Registration API...
echo.

curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"testuser@test.com\",\"fullName\":\"Test User\",\"phone\":\"1234567890\",\"address\":\"Test Address\",\"role\":\"FARMER\",\"documentPath\":null}"

echo.
echo.
echo If you see success:true above, backend is working!
echo If you see error, check if backend is running.
pause
