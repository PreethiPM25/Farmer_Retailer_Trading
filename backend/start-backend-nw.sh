#!/bin/bash
# Start Agri-Pulse Backend - No Wait
echo "========================================="
echo "Starting Agri-Pulse Backend Server..."
echo "========================================="
cd C:\agri-pulse\backend
java -jar target/agri-pulse-backend-1.0.0.jar &
sleep 2
echo "✅ Backend started in background (PID: $!)"
