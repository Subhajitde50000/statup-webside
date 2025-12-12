# Admin Dashboard

Ultra-professional admin dashboard for marketplace management (UrbanCompany/Swiggy/Zomato style).

## 🎨 Design Features

### Premium Color Palette
- **Primary**: #4C5BF5 (Royal Indigo Blue)
- **Secondary**: #8B5CF6 (Purple Glow)
- **Accent**: #10B981 (Emerald Green)
- **Warning**: #F59E0B (Amber)
- **Danger**: #EF4444 (Red)
- **Background**: #F4F6FA (Soft Grey)
- **Card BG**: #FFFFFF
- **Text Dark**: #1F2937
- **Text Light**: #6B7280

### Design Aesthetic
- **Glassmorphism effects**
- **Soft shadows**
- **Rounded corners (16px)**
- **Smooth animations**
- **Hover effects**

## 📋 Dashboard Components

### 1. Dashboard Header
- Platform logo and branding
- Global search bar
- Notification bell with count
- Messages icon with count
- Quick Create dropdown:
  - Create Coupon
  - Add Shop
  - Add Professional
  - Send Announcement
- Admin profile dropdown:
  - My Profile
  - Theme Mode (Light/Dark)
  - Log out

### 2. KPI Cards (Top Summary Metrics)
Five cards displaying:
- **Total Users**: Total registrations, new today, flagged users
- **Total Professionals**: Approved, pending KYC, suspended
- **Total Shops**: Active, pending verification, suspended
- **Orders (Today)**: Completed, pending, cancelled
- **Revenue (Today)**: Total with online/COD split

Each card includes:
- Micro graphs (bar charts)
- Percentage change vs last month
- Trend indicators (up/down)
- Breakdown statistics

### 3. System Health Section
Real-time system metrics:
- Server uptime
- API response speed
- Error logs (24 hrs)
- Live traffic count
- Active sessions
- Payment gateway status
- SMS gateway status
- Email/OTP gateway status

Color-coded status:
- 🟢 Green = Good
- 🟡 Orange = Warning
- 🔴 Red = Critical

### 4. Quick Statistics Grid
Four detailed cards:
- **Customers**: Registrations, new today, flagged users
- **Professionals**: Bookings completed, pending verification, average rating
- **Shops**: Products listed, out-of-stock alerts, support requests
- **Orders**: New, in-progress, for review, disputes open

Additional metrics:
- Overall Performance
- Critical Alerts
- Pending Actions

### 5. Live Activity Feed
Real-time scrolling feed showing:
- New order placed
- Order cancelled
- New professional registered
- Shop updated inventory
- Payment received
- Complaint created
- Verification request submitted
- Order completed

Features:
- Icons and timestamps
- Clickable items
- Auto-refresh toggle
- Load more functionality

### 6. Verification Queue Overview
Tabbed interface:
- **Professionals Pending Verification**:
  - ID proof
  - Certificates
  - Address proof
  - Background checks
- **Shops Pending Verification**:
  - GST
  - Business license
  - Shop photographs

### 7. Complaints & Reports Snapshot
Table showing:
- User name
- Complaint type
- Status (Pending/Under Review/Assigned/Resolved)
- Priority (High/Medium/Low with emoji indicators)

Quick stats:
- Pending count
- Under review count
- Assigned count

### 8. Booking & Order Snapshot
Tabbed view:
- **Service Bookings**:
  - New bookings
  - Ongoing jobs
  - Jobs needing attention
  - Cancelled jobs
  - Delayed jobs
- **Shop Orders**:
  - New orders
  - Packed
  - Out for delivery
  - Completed

### 9. Financial Summary Widget
Comprehensive financial overview:
- Total revenue (today)
- Pending payouts
- Paid this week
- Revenue split:
  - Customer payments
  - Professional commissions
  - Shop sales
- Payment gateway breakdown:
  - Razorpay
  - Paytm
  - Stripe
  - COD

### 10. Product & Inventory Overview
- Top-selling items (weekly)
- Low stock alerts (critical/low severity)
- Total products count
- Flagged products

### 11. Charts & Visual Analytics

#### Daily Performance Graph (Line Chart)
- Switchable between Bookings and Revenue
- Last 30 days trend
- Interactive tooltips

#### Professional Category Split (Pie/Donut Chart)
- Electrician
- Plumber
- Carpenter
- Mechanic
- Others

#### Revenue Chart (Bar Graph)
- Month-wise comparison (6 months)
- Average monthly revenue

#### User Growth Chart (Area Graph)
- New users vs returning users
- Growth rate percentage

### 12. CTA Buttons Section
8 action cards with hover animations:
1. 🏪 Manage Shops
2. 🔧 Manage Professionals
3. 👥 Manage Customers
4. 📝 Manage Orders
5. ⚠️ View Complaints
6. 💳 Payments
7. 📁 Verification Center
8. ⚙️ System Settings

Each card features:
- Gradient background
- Icon
- Description
- Animated hover effects
- Glow effects

### 13. Footer Section
Minimal clean footer:
- Copyright notice
- Terms & Conditions link
- Privacy Policy link
- Contact Support link
- Version number
- System status indicator

## 🚀 Usage

To access the admin dashboard:

```
Navigate to: /dashboard/admin
```

## ⚠️ Important Note

**Admin and Manager are separate roles:**
- Admin dashboard: `/dashboard/admin`
- Manager dashboard: `/dashboard/manager`

The admin dashboard has full platform oversight, while the manager dashboard focuses on operational management.

## 🔧 Customization

### Changing Colors
Update the color values in the component files or create a centralized theme configuration.

### Adding New Widgets
Create new components in `/dashboard/admin/components/` and import them in `page.tsx`.

### Modifying Metrics
Update the data structures in each component to fetch real data from your API.

## 📱 Responsive Design

The dashboard is fully responsive:
- Desktop: Full layout with all components
- Tablet: Adjusted grid layouts
- Mobile: Stacked single-column layout

## 🎯 Key Features

✅ Real-time updates
✅ Interactive charts and graphs
✅ Click-to-action quick buttons
✅ Color-coded status indicators
✅ Hover animations and transitions
✅ Glassmorphism design
✅ Professional color scheme
✅ Comprehensive data overview
✅ Easy navigation
✅ System health monitoring

## 🔄 Future Enhancements

- Dark mode support
- Real-time WebSocket updates
- Export data functionality
- Advanced filtering
- Customizable dashboard layouts
- Role-based access control
- Notification center
- Advanced analytics
