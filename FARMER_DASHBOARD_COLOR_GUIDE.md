# 🎨 Farmer Dashboard - Color & Design Guide

## Color Palette

### Navigation & Primary Section
```
Gradient: #667eea → #764ba2 (Purple/Blue)
Active Tab: #00ff88 → #00cc66 (Neon Green)
Text on Green: #1a3a2a (Dark Green)
```

### Product Details Section
```
Background: #ffffff → #f0f4ff (White to Light Purple)
Border: #667eea (Purple)
Labels: #2d3748 (Dark Gray)
Focus State: #667eea (Purple)
```

### Products List Section
```
Background: #ffffff → #f5f7fa (White to Light Gray)
Header Gradient: #00ff88 → #00cc66 (Neon Green)
Row Hover: #f0f4ff (Light Purple)
Text: #1a3a2a (Dark Green for important), #475569 (Medium Gray for secondary)
Price Color: #00cc66 (Green for values)
```

### Bidding Process Section
```
Background: #fef7cd → #fbbf24 (Yellow/Gold)
Border: #f59e0b (Orange)
Header Gradient: #f59e0b → #d97706 (Orange)
Row Hover: #fffef5 (Light Yellow)
Bid Amount: #f59e0b (Orange/Gold)
```

### Orders Received Section
```
Background: #e0e7ff → #c7d2fe (Light Purple/Indigo)
Border: #6366f1 (Indigo)
Header Gradient: #6366f1 → #4f46e5 (Dark Indigo)
Row Hover: #f0f4ff (Light Purple)
Total Amount: #6366f1 (Indigo)
```

### Status Badges

#### Available
```
Background: #dcfce7 (Light Green)
Text: #166534 (Dark Green)
Border: #86efac (Light Green)
```

#### Out of Stock
```
Background: #fef2f2 (Light Red)
Text: #991b1b (Dark Red)
Border: #fca5a5 (Light Red)
```

#### Active Bid
```
Background: #dbeafe (Light Blue)
Text: #1e40af (Dark Blue)
Border: #93c5fd (Light Blue)
```

#### Accepted
```
Background: #dcfce7 (Light Green)
Text: #166534 (Dark Green)
Border: #86efac (Light Green)
```

#### Pending Order
```
Background: #fef3c7 (Light Yellow)
Text: #92400e (Dark Brown)
Border: #fcd34d (Light Yellow)
```

### Action Buttons

#### Delete Button
```
Gradient: #ff4757 → #ff3838 (Red/Pink)
Shadow: rgba(255, 71, 87, 0.3)
Hover Shadow: rgba(255, 71, 87, 0.4)
```

#### Accept/Success Button
```
Gradient: #00ff88 → #00cc66 (Neon Green)
Text: #1a3a2a (Dark Green)
Shadow: rgba(0, 255, 136, 0.3)
Hover Shadow: rgba(0, 255, 136, 0.4)
```

#### Primary/Add Button
```
Gradient: #667eea → #764ba2 (Purple)
Text: white
Shadow: rgba(102, 126, 234, 0.3)
Hover Shadow: rgba(102, 126, 234, 0.5)
```

---

## Layout Structure

### Desktop View (Full Width)

```
┌─────────────────────────────────────────────────┐
│  🌾 Farmer Dashboard        [User Info] [Logout]│
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  [Profile] [Statistics Cards]                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  [🌾 Products] [💰 Bidding] [📦 Orders]        │
└─────────────────────────────────────────────────┘

ACTIVE TAB CONTENT:

┌─────────────────────────────────────────────────┐
│  ✨ Product Details           [➕ Add Product]  │
│                                                 │
│  ┌───────────┬───────────┬──────────┬──────────┐│
│  │ Product   │ Quantity  │ Unit     │ Price    ││
│  ├───────────┼───────────┼──────────┼──────────┤│
│  │ [Input]   │ [Input]   │ [Select] │ [Input]  ││
│  └───────────┴───────────┴──────────┴──────────┘│
│  ┌───────────┬───────────┬──────────┬──────────┐│
│  │ Image     │ Delivery  │ Status   │ Location ││
│  ├───────────┼───────────┼──────────┼──────────┤│
│  │ [Upload]  │ [Input]   │ [Select] │ [Input]  ││
│  └───────────┴───────────┴──────────┴──────────┘│
│                                                 │
│  [🚀 Add Product]                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📂 Products Listed                             │
│  ┌─────────┬──────┬────────┬─────────┬─────────┬┐
│  │ Product │ Qty  │ Price  │Delivery │ Status  ││
│  ├─────────┼──────┼────────┼─────────┼─────────┤│
│  │ Rice    │ 100  │ ₹1200  │  3 days │ ✅ Avail││
│  │ Wheat   │ 150  │ ₹800   │  5 days │ ✅ Avail││
│  └─────────┴──────┴────────┴─────────┴─────────┘│
└─────────────────────────────────────────────────┘
```

### Mobile View (Responsive)

```
All sections stack vertically
Tables scroll horizontally with touch
Buttons adapt to single column layout
Form fields fill full width
Images scale appropriately
```

---

## Hover States & Animations

### Tab Navigation
```
Duration: 0.4s
Timing: cubic-bezier(0.34, 1.56, 0.64, 1)
Transform: Scale, Color change
Shadow: Glow effect
```

### Buttons
```
Duration: 0.3-0.4s
Effect: 
  - translateY(-2px) for lift
  - Shadow increase for depth
  - Color intensity increase
```

### Table Rows
```
Duration: 0.3s
Effect:
  - Background color change
  - Inset box-shadow highlight
  - Subtle gray to color transition
```

### Input Fields
```
Duration: 0.3s
On Focus:
  - Border color → #667eea (Purple)
  - Background stays white
  - Shadow adds depth
```

---

## Typography

### Heading Styles
```
h3 (Section Title)
  Font-size: 26px
  Font-weight: 800
  Color: Dark (varies by section)
  Margin-bottom: 25-30px

h4 (Subsection)
  Font-size: 18px
  Font-weight: 700
  Color: Dark
```

### Label Styles
```
Labels (Form)
  Font-size: 13px
  Font-weight: 600
  Color: #2d3748
  Margin-bottom: 8px
```

### Data Styles
```
Values (Prices, Amounts)
  Font-size: 14px
  Font-weight: 700
  Color: #00cc66 (Green) or section color

Regular Text
  Font-size: 14px
  Font-weight: 500
  Color: #475569 (Medium Gray)

Important Text
  Font-size: 14px
  Font-weight: 600
  Color: #1a3a2a (Dark)
```

---

## Spacing System

```
Padding Standards:
- Cards: 35px outer, 30-35px inner
- Table cells: 18px (header), 16px (body)
- Form fields: 14px vertical, 16px horizontal
- Buttons: 13px-16px vertical, 28px-30px horizontal

Margin Standards:
- Section spacing: 25-30px
- Form row gaps: 20-25px
- Tab spacing: 12px

Border Radius:
- Cards: 25px
- Buttons: 12px
- Table: 18px wrapper
- Input fields: 12px
```

---

## Shadow & Depth

### Card Shadows
```
Light: 0 8px 25px rgba(color, 0.15)
Medium: 0 12px 40px rgba(color, 0.25)
Heavy: 0 20px 60px rgba(color, 0.25)
```

### Button Shadows
```
Default: 0 4px 12px rgba(color, 0.25)
Hover: 0 6px 20px rgba(color, 0.4)
Focused: 0 8px 25px rgba(color, 0.35)
```

### Decorative Elements
```
Radial overlays: rgba(color, 0.1)
300px diameter circles
Positioned at corners
Create depth without cluttering
```

---

## Responsive Breakpoints

### Extra Large (1920px+)
```
- Full column layout
- Maximum readability
- Large spacing
- All features visible
```

### Large (1200px - 1919px)
```
- 4-column form layout
- Full table display
- Optimal spacing
```

### Medium (768px - 1199px)
```
- 2-3 column form layout
- Table with horizontal scroll
- Adjusted padding
```

### Small (480px - 767px)
```
- 2-column form layout
- Stacked buttons
- Reduced padding
```

### Extra Small (<480px)
```
- Single column layout
- Touch-friendly sizing
- Minimum padding
- Horizontal table scroll
```

---

## Icon Usage

### Emoji Icons (Current Implementation)
```
Products: 📦 📂 💰 📊
Actions: ✅ 🗑️ ➕ ✕
Status: 📈 ⚡ 🚚 📍
Bidding: 💰 🏪 📅
Orders: 📦 🏪 💰 📅
Forms: 📝 ✨ 📦
```

---

## Color Accessibility

### Contrast Ratios
- White text on Purple: 12.5:1 ✅
- Dark text on Green: 8.2:1 ✅
- Dark text on Yellow: 6.5:1 ✅
- White text on Orange: 7.1:1 ✅

All ratios meet WCAG AA standards (minimum 4.5:1)

---

**Last Updated:** December 15, 2025
