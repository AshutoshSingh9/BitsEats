# Design Guidelines: BITS Goa Campus Food Ordering Platform

## Design Approach

**Selected Approach:** Design System with Food Delivery Reference  
**Justification:** Utility-focused application requiring efficiency and clarity, with inspiration from established food delivery patterns (Swiggy, Zomato, UberEats) adapted for campus use.

**Key Design Principles:**
- Clarity and speed over decoration
- Trust-building through transparency (real-time status, clear ETAs)
- Mobile-first responsive design (students browse on phones)
- Scannable information hierarchy for quick decision-making

---

## Typography

**Font System:** Google Fonts via CDN
- **Primary (Headings):** Inter (600, 700) - clean, modern, highly legible
- **Secondary (Body):** Inter (400, 500) - same family for consistency

**Type Scale:**
- Hero/Page Titles: text-4xl md:text-5xl font-bold
- Section Headers: text-2xl md:text-3xl font-semibold
- Card Titles: text-xl font-semibold
- Body Text: text-base
- Metadata/Labels: text-sm
- Captions: text-xs

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (within components): p-2, gap-2
- Component padding: p-4, p-6
- Section spacing: py-8, py-12, py-16
- Container gaps: gap-4, gap-6, gap-8

**Grid System:**
- Vendor cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Menu items: grid-cols-1 md:grid-cols-2 gap-4
- Order items: Single column (stack)
- Dashboard: Two-column split (order list + detail view on desktop)

**Container Strategy:**
- Max-width: max-w-7xl mx-auto px-4
- Forms/Checkout: max-w-2xl mx-auto

---

## Component Library

### Navigation
**Header:** Sticky top navigation with logo, search (icon), cart icon with badge, user menu/auth button. Height: h-16. Shadow on scroll.

**Vendor Card:**
- Image placeholder at top (aspect-video)
- Vendor name, cuisine tags
- Status badge (Open/Closed with subtle indicator)
- Prep time estimate
- Border with subtle shadow, rounded corners (rounded-lg)
- Hover: subtle elevation increase

**Menu Item Card:**
- Horizontal layout (image left, content right) on mobile
- Vertical on desktop grid
- Item name, description (text-sm truncated), price (font-semibold)
- Add to cart button (icon + text)
- Availability indicator if out of stock

**Cart (Floating/Sidebar):**
- Fixed bottom sheet on mobile OR sidebar drawer
- Item list with quantity controls (+/−)
- Subtotal, sticky checkout button at bottom
- Empty state with friendly message

**Order Status Card:**
- Timeline/stepper component showing: Requested → Confirmed → Preparing → Ready → Completed
- Current status highlighted
- ETA display (if confirmed): large, prominent time
- Vendor contact (phone, name) shown after confirmation
- Order items list (collapsed/expandable)

**Vendor Dashboard - Order Cards:**
- Compact card per order
- Customer name, room number, phone
- Order items summary (count)
- Timestamp, total amount
- Action buttons: Confirm + Set ETA, Update Status
- Status indicator (badge)

**Forms:**
- Input fields: border, rounded-md, p-3, focus:ring-2
- Labels: text-sm font-medium mb-1
- Required field indicators (*)
- Error messages: text-red-600 text-sm
- Checkout form: single column, auto-fill friendly

**Buttons:**
- Primary CTA: px-6 py-3, rounded-md, font-medium
- Secondary: similar size, different treatment (border)
- Icon buttons: p-2, rounded-full
- Disabled state: reduced opacity

**Status Badges:**
- Pill shape (rounded-full, px-3 py-1, text-xs font-medium)
- Semantic treatment per status (Open/Closed, Order statuses)

**Real-time Indicator:**
- Subtle pulse animation on status updates
- Toast notification for order status changes (bottom-right, temporary)

### Data Display
**Order Summary Table:**
- Clean row layout
- Item name, quantity, unit price, total
- Dividers between rows
- Total row emphasized (font-semibold, border-top)

---

## Icons

**Library:** Heroicons (outline for most, solid for emphasis)
- Shopping cart, user profile, clock, phone
- Status icons: check circle, loading spinner
- Navigation: menu (hamburger), search, close (X)
- Add/Remove: plus/minus in circles

---

## Animations

**Minimal, Purposeful Only:**
- Cart badge: subtle scale on item add
- Status updates: 200ms fade-in for new status
- Loading states: simple spinner
- NO scroll-triggered effects
- NO heavy page transitions

---

## Images

**Hero Section:** None - utility app, dive straight into vendor listings

**Vendor Cards:** Placeholder images representing each vendor/cuisine
- Aspect ratio: 16:9
- Fallback: subtle gradient placeholder if image fails

**Menu Items:** Product photography (real or high-quality stock)
- Aspect ratio: 4:3 or square
- Size: thumbnail (80x80) to small (200x150)

**Empty States:** Friendly illustration for empty cart, no orders

---

## Page-Specific Layouts

**Homepage (Vendor Listing):**
- Header with search and cart
- Optional: Quick stats banner (5 vendors, 20+ items available)
- Grid of vendor cards
- Footer with campus info/support contact

**Vendor Menu Page:**
- Vendor header (name, hours, contact)
- Sticky cart summary bar (mobile)
- Menu items grid
- Floating/sticky "View Cart" button

**Checkout:**
- Progress indicator (Cart → Details → Confirm)
- Order summary (left/top), Contact form (right/bottom)
- Clear total, "Place Order" CTA

**Order Tracking:**
- Order ID and timestamp at top
- Large status timeline (vertical on mobile, horizontal on desktop)
- ETA prominently displayed if available
- Vendor contact card (after confirmation)
- Order items list below
- Real-time updates via WebSocket (subtle animation on change)

**Vendor Dashboard:**
- Sidebar nav (Orders, Menu, Profile)
- Order tabs: New Requests, In Progress, Completed
- Order cards in list view
- Modal/drawer for order detail and actions

**Admin Panel:**
- Table-based CRUD interfaces
- Add/Edit forms in modals
- Standard data table with search/filter

---

## Accessibility & Polish

- Focus states: ring-2 on interactive elements
- Sufficient contrast ratios for all text
- Form validation inline (real-time for UX)
- Loading states for async actions
- Semantic HTML throughout
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)