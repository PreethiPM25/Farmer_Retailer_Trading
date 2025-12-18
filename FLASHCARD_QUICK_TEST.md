# 🎯 Professional Flashcard - Quick Test Guide

## ✅ Live Testing Environment

**Frontend**: http://localhost:3001/farmer/dashboard  
**Backend**: http://localhost:8080  
**Database**: File-based H2 (Persistent)

---

## 🧪 Quick Test Steps

### 1️⃣ **Login to Farmer Dashboard**
```
Email: farmer@agripulse.com
Password: farmer@123
```

### 2️⃣ **Add a Test Product**
Navigate to "Product Details" tab and fill:

```
Product Name: Organic Rice
Quantity: 50
Unit: kg
Price: 40
Delivery Days: 3
Location: Haryana
Status: Available
Image URL: https://via.placeholder.com/380x240?text=Organic+Rice
```

Click **"Add Product"**

### 3️⃣ **Verify Flashcard Display**
Look for in "Product Listed" section:

✅ **Image Hero Section**
- 240px tall image display
- Green gradient background (if no image)
- Status badge on image overlay

✅ **Product Number Badge**
- Top-right corner: `#1`
- Black background with blur effect

✅ **Status Badge**
- Bottom-left on image
- Green "✅ In Stock" or Red "❌ Out of Stock"

✅ **Product Name**
- Large bold text (22px, weight 800)

✅ **Detail Grid** (2x2 format)
- **Quantity** (Blue): `50 kg`
- **Price** (Green): `₹40.00`
- **Delivery** (Yellow): `3 days`
- **Location** (Pink): `Haryana`

✅ **Delete Button**
- Red gradient button
- Text: "🗑️ Remove Product"
- Full width at bottom of card

---

## 📱 Responsive Testing

### Desktop (3+ columns)
- Minimum card width: 380px
- Automatic wrapping
- Gap between cards: 30px

### Tablet (2 columns)
- Two cards per row
- Responsive spacing

### Mobile (1 column)
- Single card per row
- Full-width display

---

## 🎨 Design Verification

### Colors
| Element | Color | Gradient |
|---------|-------|----------|
| Header Image | Green | `#00ff88` to `#00cc66` |
| Quantity Box | Blue | `#e0f2fe` to `#cffafe` |
| Price Box | Green | `#dcfce7` to `#bbf7d0` |
| Delivery Box | Yellow | `#fef3c7` to `#fde68a` |
| Location Box | Pink | `#fdf2f8` to `#fbcfe8` |

### Animations
- Hover Effect: Card lifts up (-8px)
- Shadow Enhancement: Blue-green glow on hover
- Smooth Transition: 0.3s duration

---

## 🔄 Database Integration Test

### Add Multiple Products
Repeat steps 1-3 with different products:

```
Product 2:
- Name: Fresh Tomatoes
- Quantity: 100, Unit: kg
- Price: 25, Delivery: 1, Location: Punjab

Product 3:
- Name: Wheat Grain
- Quantity: 200, Unit: kg
- Price: 30, Delivery: 2, Location: Uttar Pradesh
```

Expected: All products display in responsive grid

---

## 🗑️ Delete Functionality Test

1. Click **"🗑️ Remove Product"** on any card
2. Product should disappear immediately from UI
3. Refresh page - product should remain deleted
4. Check backend logs for confirmation

---

## 🐛 Troubleshooting

### Issue: Flashcards not displaying
**Solution**: 
- Ensure backend is running (`npm run mvn spring-boot:run`)
- Check browser console for API errors
- Verify farmer email is correct

### Issue: Images not loading
**Solution**:
- Use valid image URLs
- Check CORS settings
- Use placeholder service: https://via.placeholder.com/

### Issue: Grid not responsive
**Solution**:
- Clear browser cache
- Restart npm server
- Check CSS grid properties in DevTools

---

## 📊 Expected Results

| Test Case | Status | Evidence |
|-----------|--------|----------|
| Flashcard renders | ✅ Pass | Visual display |
| Image displays | ✅ Pass | 240px hero image |
| Badges show | ✅ Pass | Product #, Status |
| Details grid | ✅ Pass | 2x2 layout |
| Delete works | ✅ Pass | Product removed |
| Responsive | ✅ Pass | Wraps on resize |
| Hover effects | ✅ Pass | Smooth animation |

---

## 🎥 Live Preview Commands

```bash
# Terminal 1: Start Backend
cd c:\agri-pulse\backend
mvn spring-boot:run

# Terminal 2: Start Frontend
cd c:\agri-pulse\frontend
npm start

# Open Browser
http://localhost:3001/farmer/dashboard
```

---

## 📝 Notes

- Database persists between restarts
- Use same farmer email for consistent testing
- Images use external URLs (no upload yet)
- All data saved to `./agripulse_db`

---

**Status**: ✅ Ready for Testing  
**Last Updated**: December 17, 2025
