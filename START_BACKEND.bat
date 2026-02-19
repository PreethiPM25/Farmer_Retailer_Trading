@echo off
echo Starting Agri-Pulse Backend Server...
cd /d "c:\agri-pulse\backend"
echo Current directory: %cd%
echo.
echo Looking for Java...
where java >nul 2>&1
if %errorlevel% neq 0 (
    echo Java not found in PATH. Trying common locations...
    if exist "C:\Program Files\Java\jdk-17\bin\java.exe" (
        set JAVA_CMD="C:\Program Files\Java\jdk-17\bin\java.exe"
    ) else if exist "C:\Program Files\Java\jdk-11\bin\java.exe" (
        set JAVA_CMD="C:\Program Files\Java\jdk-11\bin\java.exe"
    ) else if exist "C:\Program Files\OpenJDK\jdk-17\bin\java.exe" (
        set JAVA_CMD="C:\Program Files\OpenJDK\jdk-17\bin\java.exe"
    ) else (
        echo ERROR: Java not found! Please install Java 17 or add it to PATH
        pause
        exit /b 1
    )
) else (
    set JAVA_CMD=java
)

echo Using Java: %JAVA_CMD%
echo.
echo Starting Spring Boot application...
%JAVA_CMD% -Dserver.port=3001 -jar target\agri-pulse-backend-1.0.0.jar
pause