# Agri-Pulse UI/UX Visual Guide

## Landing Page Layout

```
┌─────────────────────────────────────────────────┐
│     🌾 Agri-Pulse          [Login Button]       │  ← Navigation
├─────────────────────────────────────────────────┤
│                                                  │
│         Welcome to Agri-Pulse                   │
│    Connecting Farmers Directly with Retailers   │
│ Transforming Agriculture through Smart Technology
│                                                  │
│   ┌──────────────────┐  ┌──────────────────┐    │
│   │  👨‍🌾            │  │  🏪              │    │
│   │ Register as      │  │ Register as      │    │  ← Registration
│   │ Farmer           │  │ Retailer         │    │     Boxes (Dark
│   │                  │  │                  │    │     Blue & White)
│   │ Connect directly │  │ Source fresh     │    │
│   │ with retailers   │  │ produce directly │    │
│   │ and expand reach │  │ from farmers     │    │
│   │                  │  │                  │    │
│   │ [Register]       │  │ [Register]       │    │
│   └──────────────────┘  └──────────────────┘    │
│                                                  │
│     [Login to Your Account]                     │  ← Login Button
│                                                  │
├─────────────────────────────────────────────────┤
│              Why Choose Agri-Pulse?             │
│                                                  │
│  [Features Cards...]                            │
├─────────────────────────────────────────────────┤
│              How It Works                       │
│                                                  │
│  [Steps Cards...]                               │
├─────────────────────────────────────────────────┤
│              Get in Touch                       │
│                                                  │
│  [Contact Cards...]                             │
└─────────────────────────────────────────────────┘
```

---

## Login Page - Two Column Layout

### Left Column: User Login (Active)
```
┌────────────────────────────┐
│  [Farmer & Retailer Login] │  ← Active Toggle Button
├────────────────────────────┤
│                            │
│  Login to Agri-Pulse       │
│                            │
│  ┌────────────────────────┐│
│  │ 👨‍🌾 Farmer             ││  ← User Type Selection
│  │ 🏪 Retailer           ││
│  └────────────────────────┘│
│                            │
│  ┌─ Email ────────────────┐│
│  │ [email input field]     ││
│  └────────────────────────┘│
│                            │
│  ┌─ Password ─────────────┐│
│  │ [password input field]  ││
│  └────────────────────────┘│
│                            │
│    [Login]                 │  ← Blue Button
│                            │
│  Forgot Password? | Register
│                            │
└────────────────────────────┘
```

### Right Column: Admin Login (Inactive)
```
┌────────────────────────────┐
│  [ADMIN LOGIN]             │  ← Inactive Toggle (Bold Text)
├────────────────────────────┤
│                            │
│        ADMIN LOGIN         │  ← Bold Red Title (32px, 800wt)
│    (appears when active)   │
│                            │
│  ┌─ Admin Email ─────────┐ │
│  │ [email input field]    │ │
│  └────────────────────────┘ │
│                            │
│  ┌─ Password ─────────────┐ │
│  │ [password input field] │ │
│  └────────────────────────┘ │
│                            │
│  ┌─ Admin Code ──────────┐ │
│  │ [code input field]    │ │  ← Verification Code
│  └────────────────────────┘ │
│                            │
│  [Login as Admin]          │  ← White Button on Red
│                            │
└────────────────────────────┘
```

### Color Scheme

#### User Login Section (Light Theme):
```
Background: White/Transparent
Toggle Button: rgba(255,255,255,0.2) → White when active
Text: #1e3c72 (Dark Blue)
Input Background: White
Submit Button: Gradient #1e3c72 to #2a5298
```

#### Admin Login Section (Dark Red Theme):
```
Background: Gradient #ff6b6b to #c92a2a (Red)
Toggle Button: Red gradient
Text: White (bold)
Input Background: rgba(255,255,255,0.1)
Input Border: rgba(255,255,255,0.3)
Input Text: White
Submit Button: White text on red background
```

---

## Registration Page Layout

```
┌──────────────────────────────┐
│  [← Back]                    │  ← Back Button
├──────────────────────────────┤
│                              │
│   Register as Farmer         │  ← Dynamic Title (Bold Role Name)
│   (OR)                       │
│   Register as Retailer       │
│                              │
│  ┌─ Full Name ──────────────┐│
│  │ [text input]              ││
│  └──────────────────────────┘│
│                              │
│  ┌─ Email ───────────────────┐│
│  │ [email input]             ││
│  └──────────────────────────┘│
│                              │
│  ┌─ Phone ───────────────────┐│
│  │ [phone input]             ││
│  └──────────────────────────┘│
│                              │
│  ┌─ Address ──────────────────┐│
│  │ [text input]               ││
│  └──────────────────────────┘│
│                              │
│  ┌─ Document Path (Opt.) ────┐│
│  │ [text input]               ││
│  └──────────────────────────┘│
│                              │
│  [Register as Farmer]        │  ← Dynamic Button Text
│  OR                          │
│  [Register as Retailer]      │
│                              │
│  Already have account? Login │
│                              │
└──────────────────────────────┘
```

---

## Color Palette

### Primary Theme (User/Farmer/Retailer)
```
Dark Blue:      #1e3c72 (Primary)
Medium Blue:    #2a5298 (Secondary)
Light Blue:     #7aa8d1 (Accent)
White:          #ffffff (Background)
Light Gray:     #f0f7ff (Card Background)
```

### Admin Theme
```
Light Red:      #ff6b6b (Primary)
Dark Red:       #c92a2a (Secondary)
White:          #ffffff (Text/Buttons)
Red Gradient:   #ff6b6b → #c92a2a (Background)
```

---

## Button States

### User Login Buttons
```
Default:   Blue gradient (#1e3c72 → #2a5298)
Hover:     Reversed gradient + translateY(-3px)
Active:    Darker shade

Toggle Off: rgba(255,255,255,0.2) border
Toggle On:  White background, blue text
```

### Admin Login Buttons
```
Default:   White button on red background
Hover:     Light gray (#f0f0f0) + translateY(-3px)
Active:    Maintained white

Submit:    Bold, larger text (16px)
```

### Registration Buttons
```
Default:   White text on blue gradient background
Hover:     Scale(1.05) + shadow
Type:      Farmer / Retailer (context-dependent)
```

---

## Typography

### Headings
```
Landing Page H1:     64px, Bold (800)
Login Page H2:       28px, Bold (700)
Registration H2:     24px, Bold (700)
Box Headings H3:     28px (Landing), 26px (Registration)
```

### Labels & Text
```
Form Labels:         14px, Bold (600)
Body Text:           16px, Normal (400)
Small Text:          14px, Light (400)
Button Text:         16px, Bold (600)
Admin Title:         32px, Bold (800), Letter-spacing: 2px
```

---

## Responsive Breakpoints

### Mobile (< 768px)
```
Landing Page:
- Single column layout
- Registration boxes stack vertically
- Smaller font sizes

Login Page:
- Single column layout
- Login modes stack
- Full width inputs

Registration:
- Single column
- Full width form
- Reduced padding
```

### Tablet (768px - 1024px)
```
- Two column layout maintained
- Adjusted spacing
- Medium font sizes
```

### Desktop (> 1024px)
```
- Full two column layout
- Maximum width containers
- Full spacing and sizing
```

---

## Animation Effects

### Hover Animations
```
Registration Boxes:  translateY(-10px) + enhanced shadow
Login Buttons:       Scale/Color change
Buttons:             translateY(-3px) / Scale(1.05)
Links:               Color change + underline
```

### Transition Properties
```
All elements:        transition: all 0.3s ease
Fast elements:       transition: 0.2s ease
Slow elements:       transition: 0.4s ease
```

---

## Accessibility Features

- High contrast ratios (WCAG AA compliant)
- Clear focus states on buttons
- Semantic HTML structure
- Form labels properly associated
- Back buttons for easy navigation
- Clear error messaging
- Alt text for icons (implicit through context)

---

## User Journey

### New Farmer
```
Landing Page (See Farmer Box)
    ↓
Click "Register as Farmer"
    ↓
Registration Page (Pre-filled with role=FARMER)
    ↓
Complete Registration Form
    ↓
Redirect to Login Page
    ↓
Select User Login Mode
    ↓
Enter Credentials
    ↓
Farmer Dashboard
```

### New Retailer
```
Landing Page (See Retailer Box)
    ↓
Click "Register as Retailer"
    ↓
Registration Page (Pre-filled with role=RETAILER)
    ↓
Complete Registration Form
    ↓
Redirect to Login Page
    ↓
Select User Login Mode
    ↓
Enter Credentials
    ↓
Retailer Dashboard
```

### Admin Login
```
Landing Page
    ↓
Click "Login"
    ↓
Login Page
    ↓
Click "ADMIN LOGIN" Toggle
    ↓
Enter Admin Email, Password, Admin Code
    ↓
Verify Admin Credentials
    ↓
Admin Dashboard
```

### Existing User (Farmer/Retailer)
```
Landing Page
    ↓
Click "Login"
    ↓
Login Page
    ↓
User Login Mode (Active by default)
    ↓
Enter Credentials
    ↓
Redirected to Dashboard (Farmer/Retailer based on role)
```

---

## Key Features Implemented ✓

✅ Dark Blue and White Mix Theme for Farmer/Retailer
✅ Separate Registration Boxes (Farmer & Retailer)
✅ Login Button as Default on Landing Page
✅ Separate User and Admin Login Interfaces
✅ Retailer and Farmer Separate Login
✅ Admin Login with Bold "ADMIN LOGIN" Title
✅ Admin Login with Different Color Theme (Red)
✅ Admin Authentication with Verification Code
✅ Redirect to Admin Dashboard after Admin Login
✅ Responsive Design for All Screen Sizes
✅ Smooth Animations and Transitions
✅ Clear Visual Hierarchy

---

**Version:** 1.0
**Last Updated:** December 4, 2025
**Status:** Ready for Production
