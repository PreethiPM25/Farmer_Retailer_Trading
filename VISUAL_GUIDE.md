# 🎨 Agri-Pulse Visual Design Guide

## Color Palette

### Primary Colors
```
Teal Dark:    #0f766e  ████████
Emerald:      #059669  ████████
Light Green:  #10b981  ████████
Mint:         #34d399  ████████
```

### Status Colors
```
Success:      #10b981  ████████  (Active, Approved)
Warning:      #f59e0b  ████████  (Pending)
Error:        #dc2626  ████████  (Rejected, Inactive)
Info:         #3b82f6  ████████  (Information)
```

### Neutral Colors
```
White:        #ffffff  ████████
Light Gray:   #f9fafb  ████████
Gray:         #6b7280  ████████
Dark Gray:    #374151  ████████
Black:        #111827  ████████
```

---

## Typography

### Font Family
```
Primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
```

### Font Sizes
```
Hero Title:       64px  (Landing page)
Page Title:       32px  (Dashboard headers)
Section Title:    28px  (Card headers)
Subtitle:         24px  (Descriptions)
Body Large:       18px  (Buttons, important text)
Body:             16px  (Regular text)
Body Small:       14px  (Labels, meta info)
```

### Font Weights
```
Bold:         700  (Titles, important text)
Semi-Bold:    600  (Buttons, labels)
Medium:       500  (Body text)
Regular:      400  (Secondary text)
```

---

## Layout & Spacing

### Container Widths
```
Max Width:        1200px
Card Width:       250px - 600px
Form Width:       500px
Dashboard Width:  100% (with padding)
```

### Padding & Margins
```
Extra Large:  50px  (Page padding)
Large:        40px  (Section padding)
Medium:       30px  (Card padding)
Regular:      20px  (Element spacing)
Small:        15px  (Tight spacing)
Extra Small:  10px  (Minimal spacing)
```

### Border Radius
```
Large:    20px  (Cards, containers)
Medium:   15px  (Buttons, inputs)
Small:    10px  (Small elements)
Round:    50%   (Circular elements)
Pill:     25px  (Pill buttons)
```

---

## Components Design

### Buttons

#### Primary Button
```css
Background: linear-gradient(135deg, #0f766e, #059669)
Color: white
Padding: 15px 30px
Border-Radius: 10px
Font-Size: 18px
Font-Weight: 600
Hover: translateY(-2px) + shadow
```

#### Secondary Button
```css
Background: transparent
Color: white
Border: 2px solid white
Padding: 12px 30px
Border-Radius: 25px
Hover: background white, color teal
```

#### Logout Button
```css
Background: #dc2626
Color: white
Padding: 10px 25px
Border-Radius: 8px
Hover: darker red + shadow
```

### Cards

#### Stat Card
```css
Background: white
Padding: 30px
Border-Radius: 15px
Box-Shadow: 0 10px 30px rgba(0,0,0,0.1)
Border-Top: 4px solid gradient
Hover: translateY(-10px) + larger shadow
```

#### User Card
```css
Background: #f9fafb
Padding: 20px
Border-Radius: 12px
Border-Left: 4px solid #0f766e
Hover: translateX(5px) + shadow
```

### Forms

#### Input Fields
```css
Width: 100%
Padding: 12px 15px
Border: 2px solid #e5e7eb
Border-Radius: 10px
Font-Size: 16px
Focus: border #0f766e + shadow
Hover: border #059669
```

#### Labels
```css
Display: block
Margin-Bottom: 8px
Color: #333
Font-Weight: 600
```

### Status Badges

#### Active Badge
```css
Background: #d1fae5
Color: #065f46
Padding: 5px 15px
Border-Radius: 20px
Font-Size: 14px
Font-Weight: 600
```

#### Pending Badge
```css
Background: #fef3c7
Color: #92400e
Padding: 5px 15px
Border-Radius: 20px
```

#### Approved Badge
```css
Background: #dbeafe
Color: #1e40af
Padding: 5px 15px
Border-Radius: 20px
```

---

## Animations

### Floating Shapes
```css
Animation: float 20s infinite ease-in-out
Keyframes:
  0%, 100%: translateY(0) rotate(0deg)
  50%: translateY(-30px) rotate(180deg)
```

### Fade In Down
```css
Animation: fadeInDown 1s ease
Keyframes:
  from: opacity 0, translateY(-50px)
  to: opacity 1, translateY(0)
```

### Fade In Up
```css
Animation: fadeInUp 1s ease
Keyframes:
  from: opacity 0, translateY(50px)
  to: opacity 1, translateY(0)
```

### Slide In
```css
Animation: slideIn 0.5s ease
Keyframes:
  from: opacity 0, translateY(30px)
  to: opacity 1, translateY(0)
```

### Hover Effects

#### Button Hover
```css
Transform: translateY(-3px)
Box-Shadow: 0 10px 20px rgba(0,0,0,0.2)
Transition: all 0.3s ease
```

#### Card Hover
```css
Transform: translateY(-10px)
Box-Shadow: 0 20px 40px rgba(0,0,0,0.2)
Transition: all 0.3s ease
```

---

## Page Layouts

### Landing Page
```
┌─────────────────────────────────────────┐
│  Logo                    Login Register │ ← Navigation
├─────────────────────────────────────────┤
│                                         │
│         🌾 Agri-Pulse                   │ ← Hero Section
│   Connecting Farmers with Retailers    │
│                                         │
│   [Get Started]  [Sign In]             │
│                                         │
│   ○  ○  ○  ○  ← Floating Shapes        │
│                                         │
└─────────────────────────────────────────┘
```

### Login/Register Page
```
┌─────────────────────────────────────────┐
│                                         │
│     ┌─────────────────────────┐        │
│     │                         │        │
│     │   Login to Agri-Pulse   │        │
│     │                         │        │
│     │   Email: [_________]    │        │
│     │   Password: [_______]   │        │
│     │                         │        │
│     │   [Login Button]        │        │
│     │                         │        │
│     │   Don't have account?   │        │
│     │   Register here         │        │
│     │                         │        │
│     └─────────────────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

### Admin Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  🌾 Admin Dashboard          Welcome, Admin    [Logout] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐    │
│  │Total │  │Active│  │Inact.│  │Not   │  │Today │    │ ← Stats
│  │ 25   │  │ 18   │  │  7   │  │Reset │  │  2   │    │
│  └──────┘  └──────┘  └──────┘  │  3   │  └──────┘    │
│                                 └──────┘               │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐            │
│  │  Weekly Growth  │  │ User Categories │            │ ← Charts
│  │   📈 Line Chart │  │  🥧 Pie Chart   │            │
│  └─────────────────┘  └─────────────────┘            │
│                                                         │
│  ┌─────────────────┐                                  │
│  │ Registration    │                                  │
│  │ 📊 Bar Chart    │                                  │
│  └─────────────────┘                                  │
│                                                         │
│  Pending User Approvals (2)                           │
│  ┌─────────────────────────────────────────────┐     │
│  │ John Farmer                                 │     │
│  │ Email: john@farmer.com                      │     │ ← User Cards
│  │ Phone: 1234567890                           │     │
│  │ Role: FARMER                                │     │
│  │ [Approve User]                              │     │
│  └─────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### User Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  🌾 Farmer Dashboard         Welcome, John    [Logout]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Profile  │  │ Account  │  │  Last    │            │ ← Stats
│  │ Status   │  │ Status   │  │  Login   │            │
│  │    ✓     │  │  ACTIVE  │  │ 2:30 PM  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                         │
│  ┌─────────────────────────────────────────┐          │
│  │     My Profile Information              │          │
│  │                                         │          │
│  │  Full Name:        John Farmer         │          │
│  │  Email:            john@farmer.com     │          │ ← Profile
│  │  Role:             FARMER              │          │
│  │  Registration:     Jan 15, 2024        │          │
│  │  Password Reset:   Yes                 │          │
│  │  Status:           [ACTIVE]            │          │
│  │                                         │          │
│  └─────────────────────────────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Desktop (> 1024px)
- Full layout
- Multi-column grids
- Large charts
- Expanded navigation

### Tablet (768px - 1024px)
- 2-column grids
- Medium charts
- Compact navigation

### Mobile (< 768px)
- Single column
- Stacked navigation
- Smaller charts
- Touch-friendly buttons

---

## Chart Designs

### Line Chart (Weekly Growth)
```
Registrations
    │
  5 │         ●
    │       ╱   ╲
  4 │     ●       ●
    │   ╱           ╲
  3 │ ●               ●
    │                   ╲
  2 │                     ●
    │
  1 │
    └─────────────────────────
     Mon Tue Wed Thu Fri Sat Sun

Color: #0f766e
Stroke Width: 3px
Points: Filled circles
Grid: Dashed lines
```

### Pie Chart (User Categories)
```
        ┌─────────┐
        │ Farmers │ 60% (Teal)
        │ Retail  │ 40% (Green)
        └─────────┘

Colors: 
- Farmers: #0f766e
- Retailers: #059669

Labels: Outside with lines
Legend: Bottom
```

### Bar Chart (Registration Trends)
```
Count
    │
  5 │     ███
    │     ███
  4 │     ███ ███
    │ ███ ███ ███
  3 │ ███ ███ ███
    │ ███ ███ ███ ███
  2 │ ███ ███ ███ ███ ███
    │ ███ ███ ███ ███ ███ ███
  1 │ ███ ███ ███ ███ ███ ███ ███
    └─────────────────────────────
     Mon Tue Wed Thu Fri Sat Sun

Color: #059669
Bar Width: 40px
Spacing: 10px
Grid: Horizontal lines
```

---

## Icon Usage

### Emojis Used
```
🌾  Wheat/Farm      - Logo, Farmer dashboard
🏪  Store           - Retailer dashboard
✓   Checkmark       - Success, completion
📈  Line Chart      - Growth, trends
🥧  Pie Chart       - Distribution
📊  Bar Chart       - Statistics
```

---

## Shadow Styles

### Light Shadow
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Medium Shadow
```css
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
```

### Heavy Shadow
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

### Hover Shadow
```css
box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
```

### Focus Shadow
```css
box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
```

---

## Gradient Styles

### Primary Gradient
```css
background: linear-gradient(135deg, #0f766e 0%, #059669 50%, #10b981 100%);
```

### Button Gradient
```css
background: linear-gradient(135deg, #0f766e 0%, #059669 100%);
```

### Card Top Border
```css
background: linear-gradient(90deg, #0f766e, #10b981);
```

---

## Accessibility

### Contrast Ratios
```
Text on White:     #333 (AAA)
White on Teal:     #fff on #0f766e (AA)
Labels:            #666 (AA)
```

### Focus States
```
All interactive elements have visible focus
Keyboard navigation supported
Tab order logical
```

### ARIA Labels
```
Buttons: aria-label
Forms: aria-required
Status: aria-live
```

---

## Print Styles

### Dashboard Print
```css
@media print {
  - Hide navigation
  - Hide buttons
  - Show only content
  - Black & white mode
  - Page breaks after sections
}
```

---

## Loading States

### Spinner
```
  ⟳  Loading...
```

### Skeleton
```
┌─────────────┐
│ ░░░░░░░░░░ │
│ ░░░░░░░░   │
│ ░░░░░░░░░░ │
└─────────────┘
```

---

## Error States

### Error Message
```
┌─────────────────────────┐
│  ⚠️ Error Message       │
│  Description here       │
└─────────────────────────┘

Background: #fee
Color: #c33
Border: 1px solid #fcc
```

### Success Message
```
┌─────────────────────────┐
│  ✓ Success Message      │
│  Description here       │
└─────────────────────────┘

Background: #efe
Color: #3c3
Border: 1px solid #cfc
```

---

## Best Practices

### Do's ✅
- Use consistent spacing
- Maintain color palette
- Apply hover effects
- Use smooth transitions
- Keep animations subtle
- Ensure readability
- Test responsiveness

### Don'ts ❌
- Don't mix color schemes
- Don't overuse animations
- Don't ignore accessibility
- Don't skip hover states
- Don't use tiny fonts
- Don't clutter layouts

---

**Design System Version**: 1.0  
**Last Updated**: January 2024  
**Maintained by**: Agri-Pulse Team
