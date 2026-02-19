@echo off
title Agri-Pulse Backend Service
:loop
cd /d "C:\agri-pulse\backend"
echo [%date% %time%] Starting Agri-Pulse Backend...
java -jar target/agri-pulse-backend-1.0.0.jar
echo [%date% %time%] Backend exited, restarting in 5 seconds...
timeout /t 5 /nobreak
goto loop
