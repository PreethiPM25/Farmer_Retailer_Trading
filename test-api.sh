#!/bin/bash
# Quick API Test Script

echo "🔍 Testing Agri-Pulse API Endpoints"
echo "======================================"
echo ""

# Test 1: Check if backend is alive
echo "1️⃣ Testing Backend Health (H2 Console)..."
curl -s http://localhost:8080/h2-console | head -20 && echo "✅ Backend responding" || echo "❌ Backend not responding"

echo ""
echo "2️⃣ Testing POST /api/products endpoint..."
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Rice",
    "quantity": 100,
    "unit": "kg",
    "price": 50,
    "availability": "Available",
    "location": "Test Location",
    "farmerEmail": "farmer@example.com"
  }' 2>/dev/null | jq . && echo "✅ POST endpoint working" || echo "❌ POST endpoint failed"

echo ""
echo "3️⃣ Testing GET /api/products/farmer endpoint..."
curl -s http://localhost:8080/api/products/farmer/farmer@example.com | jq . && echo "✅ GET endpoint working" || echo "❌ GET endpoint failed"

echo ""
echo "======================================"
echo "Testing complete!"
