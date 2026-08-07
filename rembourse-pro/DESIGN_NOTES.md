# RemboursePro - Design & Implementation Notes

## Overview
RemboursePro is a modern, premium SaaS reimbursement management system built with React, Next.js 16, and Tailwind CSS. The design follows minimalist principles inspired by Stripe, Linear, and Notion.

## Design System

### Color Palette
- **Primary**: #2563eb (Blue - Trust & Professionalism)
- **Accent**: #3b82f6 (Lighter Blue - Interactive Elements)
- **Background**: #f8f7f4 (Warm Off-White - Light Mode)
- **Background**: #0f0e0c (Deep Charcoal - Dark Mode)
- **Success**: #10b981 (Green - Approvals)
- **Warning**: #f59e0b (Amber - Pending)
- **Destructive**: #ef4444 (Red - Rejections)

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 
  - Body: 14px-16px
  - Headings: 24px-32px
  - Small: 12px-13px

### Spacing & Radius
- **Spacing Scale**: 4px, 8px, 16px, 24px, 32px
- **Border Radius**: 8px (rounded, modern aesthetic)
- **Shadows**: Subtle, soft shadows on cards (shadow-sm, hover:shadow-md)

### Layout
- **Sidebar**: Fixed navigation on desktop, collapsible on mobile
- **Header**: Sticky top navigation with user profile and notifications
- **Grid System**: 
  - Dashboard: 4 stat cards (responsive: 1 col mobile → 4 col desktop)
  - Forms: 2 col for amount/date, 3 col for categories
  - History: Full-width table with responsive scrolling

## Key Components

### Header (`components/header.tsx`)
- Branding with logo and app name
- Notification bell with indicator
- User profile dropdown with quick menu
- Sticky positioning with backdrop blur

### Sidebar (`components/sidebar.tsx`)
- Navigation with 5 main sections
- Active route highlighting
- Responsive (hidden on mobile, visible on desktop)
- Version info in footer

### StatCard (`components/stat-card.tsx`)
- Flexible component for displaying KPIs
- Icons with color-coded backgrounds
- Optional trend indicator (positive/negative/neutral)
- Hover effects and transitions

### ExpenseForm (`components/expense-form.tsx`)
- Multi-field form with:
  - Description input
  - Amount and date fields (grid layout)
  - Category selector with emoji icons (6 categories)
  - Drag-and-drop receipt upload
  - Submit and save-as-draft buttons

### ExpenseTable (`components/expense-table.tsx`)
- Responsive table with sortable columns
- Search functionality
- Status filter dropdown
- Color-coded status badges
- Expandable rows (ref support added)

### ActivityCard (`components/activity-card.tsx`)
- Vertical timeline of recent expense activity
- Status icons (checkmark, X, clock)
- Timestamp and amount display

### ExpenseChart (`components/expense-chart.tsx`)
- 6-month bar chart of expenses
- Interactive hover states with value tooltips
- Gradient bars (primary to accent)
- Responsive height calculation

## Pages

### Dashboard (`app/page.tsx`)
- KPI stats grid (4 cards)
- Expense trend chart + recent activity
- Quick action cards
- Responsive grid layout

### My Expenses (`app/expenses/page.tsx`)
- Expense submission form (left)
- Sidebar with tips and policy info (right)
- Multi-step form organization
- Category-based workflow

### History (`app/history/page.tsx`)
- Summary stats bar (4 metrics, color-coded)
- Advanced filtering (search + status dropdown)
- Responsive data table
- Export functionality

### Admin Panel (`app/admin/page.tsx`)
- Approval workflow for pending requests
- Expandable cards for each request
- Comment/annotation system
- Approve/Reject/Request Info actions
- Employee assignment visible

### Settings (`app/settings/page.tsx`)
- Profile management section
- Notification preferences
- Security options
- Billing/plan management
- All in centered, max-width layout

## UX Features

### Interactions
- ✨ Smooth transitions and hover states
- 🎯 Focus states for accessibility
- 🔄 Expandable/collapsible sections
- 📱 Mobile-responsive navigation
- ♿ Semantic HTML with ARIA attributes
- 🎨 Color-coded status indicators
- 📊 Interactive chart tooltips

### Accessibility
- Semantic HTML (main, header, nav)
- ARIA labels where needed
- Keyboard navigation support
- High contrast text colors
- Focus-visible states
- Screen reader friendly content

### Empty States
- Helpful messaging when no data
- Clear CTAs to create/add items
- Friendly tone and icons

## Responsive Design

### Breakpoints
- **Mobile**: 0-768px (hidden sidebar, single column layouts)
- **Tablet**: 768-1024px (visible sidebar, 2-col grids)
- **Desktop**: 1024px+ (full layout with 3-4 col grids)

### Mobile-First Approach
- All layouts start mobile
- Enhanced with `md:` and `lg:` prefixes
- Touch-friendly button sizes (min 44x44px)
- Readable text sizes across devices

## Performance Optimizations

- Client-side components use 'use client' for state management
- Server-side rendering for static content
- Minimal JavaScript overhead
- Optimized images and icons (Lucide React)
- Tailwind's utility-first CSS for efficient styling

## Future Enhancement Ideas

- Dark mode toggle (theme switching already in CSS)
- Real-time notifications with toast system
- Advanced reporting and analytics
- Expense categorization AI
- Mobile app version
- Internationalization (i18n)
- Authentication integration
- Database persistence
- Batch operations for admin panel
- Receipt image OCR
