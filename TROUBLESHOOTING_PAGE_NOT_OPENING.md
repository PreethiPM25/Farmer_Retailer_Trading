# 🔧 Troubleshooting: Page Not Opening

## 🎯 Quick Fixes

### ✅ Solution 1: Start Both Servers

**The most common issue is that one or both servers are not running.**

#### Start Backend:
```bash
cd backend
mvn spring-boot:run
```
Wait for: `Started AgriPulseApplication in X seconds`

#### Start Frontend (in a NEW terminal):
```bash
cd frontend
npm start
```
Wait for: `Compiled successfully!`

---

### ✅ Solution 2: Check Ports

**Make sure ports 3000 and 8080 are not in use.**

#### Windows:
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Check what's using port 8080
netstat -ano | findstr :8080

# Kill process if needed (replace PID with actual number)
taskkill /PID <PID> /F
```

#### Mac/Linux:
```bash
# Check ports
lsof -i :3000
lsof -i :8080

# Kill process if needed
kill -9 <PID>
```

---

### ✅ Solution 3: Clear Cache & Restart

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start

# Backend
cd backend
mvn clean install
mvn spring-boot:run
```

---

### ✅ Solution 4: Check Browser

1. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Select "Cached images and files"
   - Click "Clear data"

2. **Hard reload:**
   - Press `Ctrl+F5` (Windows)
   - Press `Cmd+Shift+R` (Mac)

3. **Try incognito/private mode:**
   - `Ctrl+Shift+N` (Chrome)
   - `Ctrl+Shift+P` (Firefox)

4. **Try different browser:**
   - Chrome
   - Firefox
   - Edge
   - Safari

---

## 🔍 Detailed Diagnostics

### Step 1: Verify Prerequisites

```bash
# Check Node.js (should be 16+)
node --version

# Check npm
npm --version

# Check Java (should be 17+)
java --version

# Check Maven (should be 3.6+)
mvn --version
```

**If any are missing or wrong version:**
- Node.js: Download from https://nodejs.org/
- Java 17: Download from https://adoptium.net/
- Maven: Download from https://maven.apache.org/

---

### Step 2: Check Backend Status

#### Test 1: Backend Health Check
```bash
curl http://localhost:8080
```

**Expected:** Some response (even error is OK)
**If fails:** Backend is not running

#### Test 2: Check Backend Logs
Look for errors in the terminal where you ran `mvn spring-boot:run`

**Common errors:**
- Port 8080 already in use
- Database connection failed
- Missing dependencies

---

### Step 3: Check Frontend Status

#### Test 1: Frontend Health Check
```bash
curl http://localhost:3000
```

**Expected:** HTML response
**If fails:** Frontend is not running

#### Test 2: Check Frontend Logs
Look for errors in the terminal where you ran `npm start`

**Common errors:**
- Port 3000 already in use
- Module not found
- Compilation errors

---

### Step 4: Check Network

#### Test 1: Ping Localhost
```bash
ping localhost
```

**Expected:** Replies from 127.0.0.1
**If fails:** Network configuration issue

#### Test 2: Check Firewall
- Windows: Allow ports 3000 and 8080
- Mac: System Preferences → Security → Firewall
- Linux: `sudo ufw allow 3000` and `sudo ufw allow 8080`

---

## 🐛 Common Error Messages

### Error: "Port 3000 is already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Or use different port
set PORT=3001 && npm start  # Windows
PORT=3001 npm start         # Mac/Linux
```

---

### Error: "Port 8080 is already in use"

**Solution:**
Edit `backend/src/main/resources/application.properties`:
```properties
server.port=8081
```

Then update frontend API URL in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

---

### Error: "Cannot find module"

**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install
```

---

### Error: "ECONNREFUSED"

**Cause:** Backend is not running or wrong URL

**Solution:**
1. Make sure backend is running on port 8080
2. Check `frontend/src/services/api.js` has correct URL:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

---

### Error: "Failed to compile"

**Solution:**
1. Check terminal for specific error
2. Fix syntax errors in code
3. Restart frontend:
   ```bash
   Ctrl+C
   npm start
   ```

---

## 🔥 Nuclear Option: Complete Reset

If nothing works, try this complete reset:

```bash
# 1. Stop all servers
# Press Ctrl+C in all terminals

# 2. Clean backend
cd backend
mvn clean
rm -rf target

# 3. Clean frontend
cd ../frontend
rm -rf node_modules
rm -rf build
rm package-lock.json

# 4. Reinstall everything
cd ../backend
mvn clean install

cd ../frontend
npm install

# 5. Start fresh
# Terminal 1:
cd backend
mvn spring-boot:run

# Terminal 2:
cd frontend
npm start
```

---

## 📱 Mobile Access Issues

### Can't access from phone?

**Solution:**

1. **Find your computer's IP:**
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   
   # Mac/Linux
   ifconfig
   # Look for "inet" under your network interface
   ```

2. **Update frontend to allow external access:**
   
   Edit `frontend/package.json`:
   ```json
   "scripts": {
     "start": "HOST=0.0.0.0 react-scripts start"
   }
   ```

3. **On phone, visit:**
   ```
   http://YOUR_IP:3000
   ```

4. **Make sure:**
   - Phone and computer on same WiFi
   - Firewall allows connections
   - No VPN blocking access

---

## 🔍 Browser Console Errors

### How to check:
1. Press F12 (DevTools)
2. Click "Console" tab
3. Look for red errors

### Common console errors:

#### "Failed to fetch"
- Backend not running
- Wrong API URL
- CORS issue

**Solution:**
- Start backend
- Check API URL in `api.js`
- Backend should have CORS enabled

#### "Unexpected token < in JSON"
- Backend returning HTML instead of JSON
- Wrong endpoint

**Solution:**
- Check API endpoint URLs
- Verify backend is running correctly

#### "Module not found"
- Missing dependency
- Import path wrong

**Solution:**
```bash
npm install
```

---

## 📊 Verification Checklist

Use this checklist to verify everything is working:

### Backend:
- [ ] Java 17+ installed
- [ ] Maven 3.6+ installed
- [ ] Backend compiles without errors
- [ ] Backend starts on port 8080
- [ ] Can access http://localhost:8080
- [ ] No errors in backend logs

### Frontend:
- [ ] Node.js 16+ installed
- [ ] npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Frontend compiles without errors
- [ ] Frontend starts on port 3000
- [ ] Can access http://localhost:3000
- [ ] No errors in browser console

### Network:
- [ ] Localhost resolves (ping localhost)
- [ ] Ports 3000 and 8080 not blocked
- [ ] Firewall allows connections
- [ ] No VPN interfering

### Browser:
- [ ] Modern browser (Chrome, Firefox, Edge, Safari)
- [ ] JavaScript enabled
- [ ] Cookies enabled
- [ ] Cache cleared
- [ ] No extensions blocking

---

## 🆘 Still Not Working?

### Collect Information:

1. **Operating System:**
   - Windows 10/11?
   - Mac OS?
   - Linux?

2. **Versions:**
   ```bash
   node --version
   npm --version
   java --version
   mvn --version
   ```

3. **Error Messages:**
   - Backend terminal errors
   - Frontend terminal errors
   - Browser console errors

4. **What you tried:**
   - List all solutions attempted

### Get Help:

1. **Check logs:**
   - Backend: Terminal output
   - Frontend: Terminal output
   - Browser: DevTools Console (F12)

2. **Search for error:**
   - Copy exact error message
   - Search on Google/Stack Overflow

3. **Ask for help:**
   - Provide all information above
   - Include error messages
   - Mention what you tried

---

## ✅ Success Indicators

You'll know it's working when:

1. **Backend terminal shows:**
   ```
   Started AgriPulseApplication in X.XXX seconds
   ```

2. **Frontend terminal shows:**
   ```
   Compiled successfully!
   webpack compiled with 0 errors
   ```

3. **Browser shows:**
   - Landing page loads
   - No errors in console (F12)
   - Can click buttons and navigate

4. **Can access:**
   - http://localhost:3000 (Frontend)
   - http://localhost:8080 (Backend)

---

## 🎉 Quick Start Commands

**Copy and paste these commands:**

### Windows:
```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### Mac/Linux:
```bash
# Terminal 1 - Backend
cd backend
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

---

**🌾 Once both servers are running, open http://localhost:3000 in your browser!**
