# 🚀 Quick Start Guide - Agri-Pulse Application

## ✅ Your Application is Now Fully Responsive!

All pages have been optimized for:
- 📱 Mobile devices (320px - 480px)
- 📱 Tablets (481px - 768px)
- 💻 Laptops (769px - 1024px)
- 🖥️ Desktops (1025px+)

---

## 🔧 How to Start the Application

### Step 1: Start Backend Server

Open a terminal/command prompt and run:

```bash
cd backend
mvn spring-boot:run
```

**OR** use the batch file:
```bash
start-backend.bat
```

✅ Backend will start on: `http://localhost:8080`

---

### Step 2: Start Frontend Server

Open a **NEW** terminal/command prompt and run:

```bash
cd frontend
npm install
npm start
```

**OR** use the batch file:
```bash
start-frontend.bat
```

✅ Frontend will start on: `http://localhost:3000`

---

## 🌐 Access the Application

Once both servers are running:

1. **Open your browser** (Chrome, Firefox, Safari, Edge)
2. **Navigate to:** `http://localhost:3000`
3. **You should see the Landing Page!**

---

## 📱 Test Responsiveness

### On Desktop:
1. Open browser DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Select different devices:
   - iPhone SE
   - iPhone 12 Pro
   - iPad
   - Samsung Galaxy S20
   - Desktop

### On Mobile:
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`
2. On your phone, open browser and go to:
   - `http://YOUR_IP_ADDRESS:3000`

---

## 🔐 Default Login Credentials

### Admin Login:
```
Email: admin@agripulse.com
Password: Admin@123
Admin Code: (any value for testing)
```

### Test User (After Registration):
- Register as Farmer or Retailer
- Wait for admin approval
- Check email for credentials
- Login and reset password

---

## 🐛 Troubleshooting

### Page Not Opening?

**1. Check if Backend is Running:**
```bash
curl http://localhost:8080
```
Or open in browser: `http://localhost:8080`

**2. Check if Frontend is Running:**
```bash
curl http://localhost:3000
```
Or open in browser: `http://localhost:3000`

**3. Port Already in Use?**
- Backend: Change port in `backend/src/main/resources/application.properties`
- Frontend: Set `PORT=3001` before running `npm start`

**4. Dependencies Not Installed?**
```bash
# Backend
cd backend
mvn clean install

# Frontend
cd frontend
npm install
```

**5. Clear Browser Cache:**
- Press `Ctrl+Shift+Delete`
- Clear cached images and files
- Reload page with `Ctrl+F5`

---

## 📋 Responsive Features Added

### ✅ Landing Page
- Stacked navigation on mobile
- Single column registration boxes
- Responsive hero section
- Mobile-friendly features grid
- Optimized footer layout

### ✅ Login Page
- Stacked login forms on mobile
- Full-width buttons
- Larger touch targets
- Readable font sizes

### ✅ Registration Page
- Single column form layout
- Full-width inputs
- Mobile-friendly file upload
- Optimized spacing

### ✅ Admin Dashboard
- Single column stats on mobile
- Responsive charts
- Stacked user cards
- Mobile-friendly tables
- Touch-friendly buttons

### ✅ Farmer/Retailer Dashboard
- Responsive profile cards
- Mobile-optimized stats
- Readable information rows
- Full-width buttons

---

## 🎨 Responsive Breakpoints

```css
/* Tablets and below */
@media (max-width: 1024px) { ... }

/* Mobile devices */
@media (max-width: 768px) { ... }

/* Small mobile devices */
@media (max-width: 480px) { ... }
```

---

## 📞 Need Help?

If the application still doesn't open:

1. **Check Console Errors:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

2. **Verify Node.js and Java:**
   ```bash
   node --version  # Should be 16+
   java --version  # Should be 17+
   mvn --version   # Should be 3.6+
   ```

3. **Check Firewall:**
   - Allow ports 3000 and 8080
   - Disable antivirus temporarily

4. **Try Different Browser:**
   - Chrome
   - Firefox
   - Edge

---

## ✨ What's New

### Responsive Design Updates:
- ✅ All pages now work on mobile devices
- ✅ Touch-friendly buttons and inputs
- ✅ Optimized font sizes for readability
- ✅ Proper spacing and padding
- ✅ Responsive navigation menus
- ✅ Mobile-friendly forms
- ✅ Stacked layouts on small screens
- ✅ Full-width buttons on mobile
- ✅ Responsive charts and graphs
- ✅ Mobile-optimized tables

---

## 🎯 Next Steps

1. ✅ Start both servers
2. ✅ Open `http://localhost:3000`
3. ✅ Test on different screen sizes
4. ✅ Register as Farmer/Retailer
5. ✅ Login as Admin to approve users
6. ✅ Explore all features!

---

**🌾 Enjoy using Agri-Pulse!**
