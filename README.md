# CodeForjHQ Dashboard

A fully functional, responsive, command-center style React dashboard built for CodeForjHQ.com.

Built with React, Tailwind CSS, Context API, JWT authentication, and animated data-driven components.

---

## 🚀 Features

### 🖥 Layout System
- Fixed left sidebar + fixed top header (desktop)
- Collapsible sidebar (260px → 80px) with smooth transition
- Hamburger menu for mobile & tablet
- Overlay drawer on small screens
- Only main content scrolls
- Sidebar collapse state persisted in localStorage
- Scroll lock enabled when mobile drawer is open

---

## 📊 Dashboard Sections (8 Fully Functional Modules)

### 1️⃣ Overview
- Count-up metrics
- Animated progress bars
- Recent activity feed (fade-in + stagger animation)

### 2️⃣ Repositories
- Add / remove repository
- Sync status with pulsing indicator
- Branch selector dropdown
- Global state updates via Context API

### 3️⃣ AI Analysis
- Line, Bar, Radar charts (animated from 0 → value)
- Optimization suggestion cards (slide + fade)
- Technical debt meter (arc animation)

### 4️⃣ Code Review
- Pull request list
- Inline AI suggestions (slide-in)
- Approve / Reject buttons with ripple animation

### 5️⃣ Bugs & Performance
- Bug list with animated severity badges
- Performance charts (animated bars)
- Resolved bugs fade-out effect

### 6️⃣ CI/CD Monitor
- Live-style terminal build logs
- Status icons (spin / pulse while building)
- Deployment timeline animations

### 7️⃣ Team
- Activity heatmap (color intensity animation)
- Commit bar animations
- Member cards stagger slide-in

### 8️⃣ Settings
- Animated tab switching
- Smooth toggle switches
- Focus glow inputs
- Toast notifications on save

---

## 🔐 Authentication System

- Login & Signup pages
- Form validation
- Password hashing
- JWT authentication
- Protected dashboard routes
- AuthContext handles:
  - Login
  - Logout
  - Session persistence
  - Token validation

---

## 🧠 State Management

Global state handled via Context API:

### AuthContext
- User session
- JWT storage
- Route protection

### AppContext
Manages:
- Repositories
- Analysis data
- Bugs
- Pipelines
- Team activity
- Settings

Data fetched from API or mock services on mount.

All UI interactions update global state and persist where required.

---

## 🎨 UI / UX Design

**Theme:** Dark Command Center

| Element | Color |
|---------|--------|
| Background | #000000 |
| Text | #F1F9F4 |
| Accent | #F60670 |
| Card Shadow | #111111 |
| Grid | #222222 |

### Typography
- Headings: Onest
- Body: Manrope

### Design System
- Subtle elevation hover effects
- Accent highlights
- Clean modular widget cards
- Professional performance-friendly animations

---

## 📈 Charts & Graphs

Supports:
- Chart.js
- Recharts
- ApexCharts

Charts:
- Animate from 0 → value on mount
- Accent color: #F60670
- Grid: #222222
- Tooltip background: #111111
- Tooltip text: #F1F9F4

---

## ✨ Animation System

Consistent animation logic across all sections:

- Count-up metrics
- Progress fill animations
- Fade-in + stagger lists
- Slide-in panels
- Pulsing status indicators
- Arc fills
- Ripple buttons
- Smooth transitions everywhere

Optimized for performance.

---

## 📱 Responsive Behavior

### Mobile
- Sidebar hidden
- Hamburger → overlay drawer
- Scrollable content
- Overlay click closes sidebar

### Tablet
- Collapsible sidebar
- Content shifts dynamically

### Desktop
- Fixed sidebar + header
- Sidebar toggle works smoothly

Fully responsive across all screen sizes.
