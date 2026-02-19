@echo off
echo ========================================
echo    STARTING AGRI-PULSE BACKEND
echo ========================================

cd /d "c:\agri-pulse\backend"

echo Cleaning previous build...
call mvn clean

echo Building project...
call mvn compile

echo Starting Spring Boot application...
call mvn spring-boot:run

pause