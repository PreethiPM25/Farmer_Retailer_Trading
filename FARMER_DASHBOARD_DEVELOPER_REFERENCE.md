# 🔧 Farmer Dashboard - Developer Quick Reference

## File Location
```
frontend/src/pages/FarmerDashboard.js
```

## Key State Variables

```javascript
// Form control
const [showAddProduct, setShowAddProduct] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
const [activeTab, setActiveTab] = useState('products');

// Product data
const [newProduct, setNewProduct] = useState({
  name: '',              // String - product name
  quantity: '',          // Number - quantity
  unit: 'kg',           // String - 'kg' | 'ton' | 'quintal'
  price: '',            // Number - price per unit
  availability: 'Available', // String - 'Available' | 'Out of Stock'
  imagePath: '',        // String/Base64 - image data
  deliveryDays: '',     // Number - days to deliver
  location: ''          // String - location
});

// Data lists
const [products, setProducts] = useState([]);
const [orders, setOrders] = useState([]);
const [bids, setBids] = useState([]);
const [userData, setUserData] = useState(null);
```

## Key Functions

### `handleImageUpload(e)`
**Purpose:** Handle image file selection and preview
**Parameters:** Event object from file input
**Returns:** Updates imagePreview state and newProduct.imagePath
**Usage:**
```html
<input 
  type="file" 
  accept="image/*"
  onChange={handleImageUpload}
/>
```

### `handleAddProduct(e)`
**Purpose:** Submit product form to backend
**Parameters:** Form submit event
**Returns:** Calls productAPI.addProduct() and resets form
**Note:** Already integrated with API

### `handleDeleteProduct(id)`
**Purpose:** Delete product with confirmation
**Parameters:** Product ID
**Returns:** Calls productAPI.deleteProduct() after user confirms

### `loadProducts()`
**Purpose:** Fetch farmer's products from API
**API Call:** `productAPI.getFarmerProducts(user.email)`
**Updates:** setProducts state

### `loadBids()`
**Purpose:** Fetch farmer's bids from API
**API Call:** `bidAPI.getFarmerBids(user.email)`
**Updates:** setBids state

### `loadOrders()`
**Purpose:** Fetch farmer's orders from API
**API Call:** `orderAPI.getFarmerOrders(user.email)`
**Updates:** setOrders state

---

## Tab Navigation

```javascript
// Switch tabs with:
setActiveTab('products')  // Product management
setActiveTab('bids')      // Bidding process
setActiveTab('orders')    // Orders received

// Check current tab with:
if (activeTab === 'products') { ... }
```

---

## Form Field Updates

```javascript
// Update individual fields:
setNewProduct({...newProduct, name: value})
setNewProduct({...newProduct, quantity: value})
setNewProduct({...newProduct, unit: value})
setNewProduct({...newProduct, price: value})
setNewProduct({...newProduct, availability: value})
setNewProduct({...newProduct, deliveryDays: value})
setNewProduct({...newProduct, location: value})

// Reset entire form:
setNewProduct({
  name: '', quantity: '', unit: 'kg', price: '', 
  availability: 'Available', imagePath: '', 
  deliveryDays: '', location: ''
});
setImagePreview(null);
```

---

## Color Constants (for reference)

```javascript
// Navigation
const PURPLE_GRADIENT = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
const NEON_GREEN = '#00ff88';
const NEON_GREEN_DARK = '#00cc66';

// Products
const PRODUCTS_HEADER = 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)';
const PRODUCTS_BG = 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)';

// Bidding
const BIDDING_HEADER = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
const BIDDING_BG = 'linear-gradient(135deg, #fef7cd 0%, #fbbf24 100%)';

// Orders
const ORDERS_HEADER = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
const ORDERS_BG = 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';

// Status
const STATUS_AVAILABLE = { bg: '#dcfce7', text: '#166534' };
const STATUS_OUT_OF_STOCK = { bg: '#fef2f2', text: '#991b1b' };
const STATUS_ACTIVE = { bg: '#dbeafe', text: '#1e40af' };
const STATUS_ACCEPTED = { bg: '#dcfce7', text: '#166534' };
const STATUS_PENDING = { bg: '#fef3c7', text: '#92400e' };
const STATUS_CONFIRMED = { bg: '#dcfce7', text: '#166534' };
```

---

## Responsive Grid

```javascript
// Form layout (2 rows × 4 columns)
const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '25px'
};

// Adapts to screen size:
// Desktop: 4 columns
// Tablet: 2-3 columns
// Mobile: 1 column
```

---

## Event Handlers

```javascript
// Form submission
<form onSubmit={handleAddProduct}>
  {/* fields */}
</form>

// Image upload
<input 
  type="file" 
  accept="image/*"
  onChange={handleImageUpload}
/>

// Tab switching
<button onClick={() => setActiveTab('products')}>Products</button>

// Toggle form
<button onClick={() => setShowAddProduct(!showAddProduct)}>
  {showAddProduct ? '✕ Cancel' : '➕ Add Product'}
</button>

// Input focus states
<input
  onFocus={(e) => e.target.style.borderColor = '#667eea'}
  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
/>

// Button hover effects
<button
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 136, 0.4)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 255, 136, 0.25)';
  }}
>
  Button Text
</button>

// Row hover effects
<tr
  onMouseEnter={(e) => {
    e.currentTarget.style.background = '#f0f4ff';
    e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(102, 126, 234, 0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    e.currentTarget.style.boxShadow = 'none';
  }}
>
  {/* row content */}
</tr>
```

---

## Common Patterns

### Display Empty State
```javascript
{items.length === 0 && (
  <div style={{textAlign: 'center', padding: '50px 20px'}}>
    <div style={{fontSize: '48px', marginBottom: '15px'}}>📦</div>
    <h4 style={{margin: '0 0 8px 0', color: '#1a3a2a'}}>No Items</h4>
    <p style={{margin: '0', color: '#64748b'}}>Message here</p>
  </div>
)}
```

### Display Status Badge
```javascript
<span style={{
  background: status === 'Available' ? '#dcfce7' : '#fef2f2',
  color: status === 'Available' ? '#166534' : '#991b1b',
  padding: '8px 14px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '700',
  border: status === 'Available' ? '1px solid #86efac' : '1px solid #fca5a5'
}}>
  {status === 'Available' ? '✅ Available' : '❌ Out of Stock'}
</span>
```

### Format Currency
```javascript
<td style={{color: '#00cc66', fontWeight: '700'}}>
  ₹{product.price}
</td>
```

### Format Date
```javascript
<td>
  {new Date(bid.bidDate).toLocaleDateString()}
</td>
```

---

## API Integration Points

### Products
```javascript
// Add product
await productAPI.addProduct({
  ...newProduct,
  farmerEmail: user.email
});

// Delete product
await productAPI.deleteProduct(id);

// Get products
const response = await productAPI.getFarmerProducts(user.email);
```

### Bids
```javascript
// Get bids
const response = await bidAPI.getFarmerBids(user.email);

// Accept bid
await bidAPI.acceptBid(bid.id);
```

### Orders
```javascript
// Get orders
const response = await orderAPI.getFarmerOrders(user.email);
```

---

## CSS Inline Style Patterns

### Card Style
```javascript
{
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
  border: '3px solid #667eea',
  borderRadius: '25px',
  padding: '35px',
  boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)',
  position: 'relative',
  overflow: 'hidden'
}
```

### Button Style
```javascript
{
  background: 'linear-gradient(135deg, #00ff88 0%, #00cc66 100%)',
  color: '#1a3a2a',
  border: 'none',
  padding: '13px 28px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '15px',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  boxShadow: '0 8px 25px rgba(0, 255, 136, 0.3)'
}
```

### Input Style
```javascript
{
  padding: '14px 16px',
  border: '2px solid #cbd5e1',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.3s ease',
  background: '#ffffff'
}
```

### Table Header
```javascript
{
  padding: '18px 16px',
  fontWeight: '800',
  fontSize: '14px',
  textAlign: 'left'
}
```

### Table Cell
```javascript
{
  padding: '16px 16px',
  borderBottom: '1px solid #e2e8f0'
}
```

---

## Debugging Tips

### Check State
```javascript
console.log('Products:', products);
console.log('Bids:', bids);
console.log('Orders:', orders);
console.log('Form Data:', newProduct);
```

### Check Tab Status
```javascript
console.log('Active Tab:', activeTab);
console.log('Show Form:', showAddProduct);
console.log('Image Preview:', imagePreview);
```

### Verify API Calls
```javascript
// Open browser DevTools > Network tab
// Look for:
// - GET /products/farmer
// - GET /bids/farmer
// - GET /orders/farmer
// - POST /products
```

### Test Image Upload
```javascript
console.log('Image Preview Data:', imagePreview);
// Should show data:image/png;base64,... if successful
```

---

## Performance Optimization

### Currently Optimized
✅ Minimal re-renders (state-based only)
✅ Efficient event handling
✅ No unnecessary animations
✅ Optimized CSS selectors
✅ Base64 image encoding (for preview)

### Future Improvements
- Lazy load images
- Virtual scrolling for large tables
- Debounce search/filter
- Memoize components
- Implement pagination

---

## Testing Checklist

```
[ ] Form fields accept input
[ ] Image upload shows preview
[ ] Delete button works with confirmation
[ ] Add product submits to backend
[ ] Tab navigation works
[ ] Hover effects trigger
[ ] Status badges display correctly
[ ] Empty states show messages
[ ] Responsive layout works
[ ] All colors display correctly
[ ] Animations are smooth
[ ] API calls succeed
```

---

**Last Updated:** December 15, 2025
**Version:** 1.0
**Status:** Ready for Development
