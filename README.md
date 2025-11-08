# BITS Goa Campus Food - Development Status

## 🎯 Project Overview

A campus-only food ordering platform for BITS Goa with dual interfaces (User/Vendor), designed for real-time order updates via WebSockets and domain-restricted authentication.

## ✅ Phase 1: Frontend Prototype (COMPLETED)

### What Has Been Built

#### 1. **Complete UI/UX Design System**
- Modern food delivery-themed color scheme (orange primary for food appeal)
- Responsive layouts for all screen sizes
- Consistent spacing and typography using Inter font
- Dark mode ready (toggle functionality pending backend)

#### 2. **User Interface Pages**

##### Home Page (`/`)
- Vendor listing with cards showing:
  - Vendor name and description
  - Open/Closed status badges
  - Estimated preparation time
  - Placeholder images
- Click-through to vendor menu pages
- Fully functional UI with mock data

##### Vendor Menu Page (`/vendor/:id`)
- Complete menu item display
- Add to cart functionality with quantity controls
- Real-time cart counter in header
- Vendor contact information display
- Persistent cart state (using React state)
- Floating "View Cart" button
- Working cart drawer/sheet

##### Checkout Page (`/checkout`)
- Contact information form (Name, Phone, Room Number)
- Order summary with item breakdown
- Total calculation
- Form validation
- Order placement button with loading state
- Redirects to order tracking after placement

##### Order Tracking Page (`/orders/:id`)
- Real-time status timeline visualization
  - Requested → Confirmed → Preparing → Ready → Completed
  - Auto-progressing demo (5-second intervals)
- ETA display (appears after confirmation)
- Vendor contact information (shown after confirmation)
- Delivery information
- Complete order item breakdown
- Total amount display

##### Vendor Dashboard (`/vendor/dashboard`)
- Tabbed interface:
  - **New Orders**: Requested orders awaiting confirmation
  - **Active Orders**: Confirmed, Preparing, and Ready orders
  - **Completed Orders**: Finished orders
- Order cards showing:
  - Customer details (name, phone, room number)
  - Order items (expandable list)
  - Total amount
  - Status badges
- Vendor actions:
  - Confirm order with custom ETA input
  - Update order status through workflow
  - All interactions with toast notifications

##### Admin Panel (`/admin`)
- Vendor management:
  - List all vendors with details
  - Add new vendor (dialog form)
  - Edit vendor information
  - Delete vendors
- Menu item management:
  - List all menu items
  - Add new menu items (dialog form)
  - Edit menu items
  - Delete menu items
- CRUD operations with confirmation toasts

#### 3. **Reusable Components**

All components are production-ready with proper TypeScript typing and data-testid attributes:

- **StatusBadge**: Color-coded status indicators
- **VendorCard**: Vendor display with hover effects
- **MenuItemCard**: Interactive menu items with quantity controls
- **OrderStatusTimeline**: Visual order progress tracker
- **Header**: Responsive navigation with cart counter
- **CartSheet**: Sliding cart drawer with item management
- **VendorDashboardOrderCard**: Comprehensive order management card

#### 4. **Interactive Features**

- ✅ Add/remove items from cart
- ✅ Quantity adjustments (+ / - buttons)
- ✅ Cart persistence during session
- ✅ Form validation
- ✅ Loading states on actions
- ✅ Toast notifications for user feedback
- ✅ Responsive navigation
- ✅ Modal dialogs for admin actions
- ✅ Tabbed interfaces
- ✅ Expandable sections
- ✅ Auto-updating order status demo

### Current Limitations (Mock Data Mode)

⚠️ **All data is currently hardcoded/mocked**:
- Vendor list is static
- Menu items are predefined
- Cart doesn't persist on refresh
- Orders aren't actually created
- No user authentication
- No database connections
- No real-time WebSocket updates (simulated with intervals)

---

## 🚧 Phase 2: Backend Integration (NOT YET IMPLEMENTED)

### Critical Requirements Pending

#### 1. **Technology Stack Mismatch**
**Issue**: The requirements specify Next.js with Prisma ORM, but this Replit environment uses:
- Vite + React (not Next.js)
- Express backend
- Drizzle ORM (not Prisma)

**Resolution Options**:
1. Adapt the design to work with the existing stack (Vite + Express + Drizzle)
2. Migrate to Next.js (requires significant restructuring)

**Recommendation**: Use Option 1 - adapt to existing stack for faster implementation.

#### 2. **Authentication System**
**Not Yet Implemented**:
- ❌ NextAuth.js / Google OAuth integration
- ❌ Domain restriction (`@goa.bits-pilani.ac.in` only)
- ❌ Session management
- ❌ Role-based access control (student/faculty, vendor, admin)
- ❌ Protected routes

**Required Secrets** (mentioned as already set):
- `NEXTAUTH_SECRET` (or equivalent for Express session)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**What needs to be built**:
- Google OAuth flow setup
- Email domain validation middleware
- Session creation and verification
- Role assignment logic
- Protected API endpoints
- Frontend auth state management

#### 3. **Database Schema & Migrations**
**Not Yet Implemented**:
- ❌ User table with roles
- ❌ Vendor table
- ❌ MenuItem table with vendor relations
- ❌ Order table with status enums
- ❌ OrderItem junction table

**Proposed Schema** (needs to be created in Drizzle):
```typescript
// Users
- id: UUID (primary key)
- email: string (unique, validated @goa.bits-pilani.ac.in)
- name: string
- phone: string (nullable)
- room_no: string (nullable)
- role: enum('student', 'faculty', 'vendor', 'admin')
- createdAt: timestamp

// Vendors
- id: UUID (primary key)
- name: string
- contact_name: string
- contact_phone: string
- email: string
- opening_hours: JSON (e.g., {"open": "08:00", "close": "22:00"})
- active: boolean
- createdAt: timestamp

// MenuItems
- id: UUID (primary key)
- vendor_id: UUID (foreign key → Vendors)
- name: string
- description: text
- price: decimal
- is_available: boolean
- prep_time_minutes: integer
- createdAt: timestamp

// Orders
- id: UUID (primary key)
- user_id: UUID (foreign key → Users)
- vendor_id: UUID (foreign key → Vendors)
- total_amount: decimal
- status: enum('requested', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
- eta_minutes: integer (nullable)
- eta_at: timestamp (nullable, calculated from created_at + eta_minutes)
- vendor_note: text (nullable)
- customer_name: string
- customer_phone: string
- customer_room_no: string
- createdAt: timestamp

// OrderItems
- id: UUID (primary key)
- order_id: UUID (foreign key → Orders)
- menu_item_id: UUID (foreign key → MenuItems)
- quantity: integer
- unit_price: decimal (snapshot at order time)
- total_price: decimal
```

**Required Database Work**:
1. Create migration files
2. Run migrations against Neon DB using `DATABASE_URL`
3. Create seed script for vendors and menu items
4. Add admin user seed

#### 4. **API Endpoints**
**None implemented yet**. Need to create in `server/routes.ts`:

##### Public Endpoints
- `GET /api/vendors?openOnly=true` - List vendors
- `GET /api/vendors/:id/menu` - Get menu for vendor

##### Authenticated User Endpoints
- `POST /api/orders` - Create new order
  - Validate user session
  - Calculate prices server-side
  - Create Order + OrderItems
  - Return order ID
- `GET /api/orders/:id` - Get order details
  - Verify user owns order or is the vendor
  - Return full order with status, ETA, items
- `GET /api/users/me/orders` - Get user's order history

##### Vendor Endpoints
- `GET /api/vendor/orders` - Get vendor's orders
  - Filter by vendor_id from session
- `PATCH /api/vendor/orders/:id` - Update order
  - Set status
  - Set ETA
  - Add vendor notes
  - Trigger WebSocket broadcast

##### Admin Endpoints
- `GET /api/admin/vendors` - List all vendors
- `POST /api/admin/vendors` - Create vendor
- `PATCH /api/admin/vendors/:id` - Update vendor
- `DELETE /api/admin/vendors/:id` - Delete vendor
- `GET /api/admin/menu-items` - List all menu items
- `POST /api/admin/menu-items` - Create menu item
- `PATCH /api/admin/menu-items/:id` - Update menu item
- `DELETE /api/admin/menu-items/:id` - Delete menu item

**Security Requirements**:
- Server-side authentication on all endpoints
- Role-based authorization checks
- Input validation using Zod
- SQL injection protection (Drizzle handles this)
- Price calculation on server (never trust client)

#### 5. **WebSocket Server**
**Not Yet Implemented**:
- ❌ Native WebSocket server using `ws` package
- ❌ Session-based authentication for socket connections
- ❌ Order subscription channels (`order:<orderId>`)
- ❌ Broadcast logic when orders update
- ❌ Reconnection handling
- ❌ Fallback to polling

**What needs to be built**:

```typescript
// server/websocket.ts (needs to be created)
// WebSocket server integrated with Express
// - Authenticate connections using session cookie
// - Allow clients to subscribe to order updates
// - Broadcast when PATCH /api/vendor/orders/:id is called
// - Handle disconnections gracefully
```

**Integration Points**:
1. Upgrade HTTP connection to WebSocket in Express
2. Verify NextAuth session token on connect
3. Maintain connection map: `userId → WebSocket`
4. On order update:
   - Find connected users subscribed to that order
   - Broadcast JSON: `{ type: 'ORDER_UPDATE', orderId, status, eta }`
5. Frontend: reconnect on disconnect, fallback to polling

#### 6. **Business Logic**
**Not Yet Implemented**:
- ❌ Vendor open/close time calculation (IST timezone, UTC storage)
- ❌ ETA calculation: `eta_at = created_at + eta_minutes`
- ❌ Order total calculation from cart items
- ❌ Menu item availability checks
- ❌ Order status validation (can't skip states)
- ❌ Privacy controls:
  - User sees vendor contact only after confirmation
  - Vendor sees user contact immediately
  - User can only view their own orders

#### 7. **Storage Layer**
**Not Yet Implemented**:
- ❌ Update `server/storage.ts` with new interfaces
- ❌ Implement database operations using Drizzle
- ❌ Handle transactions for order creation
- ❌ Optimize queries (include relations, pagination)

**Example methods needed**:
```typescript
interface IStorage {
  // Vendors
  getVendors(openOnly?: boolean): Promise<Vendor[]>;
  getVendorById(id: string): Promise<Vendor | null>;
  getVendorMenu(vendorId: string): Promise<MenuItem[]>;
  
  // Orders
  createOrder(data: CreateOrderData): Promise<Order>;
  getOrderById(orderId: string, userId: string): Promise<Order | null>;
  getUserOrders(userId: string): Promise<Order[]>;
  getVendorOrders(vendorId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus, eta?: number): Promise<Order>;
  
  // Admin
  createVendor(data: CreateVendorData): Promise<Vendor>;
  updateVendor(id: string, data: UpdateVendorData): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;
  createMenuItem(data: CreateMenuItemData): Promise<MenuItem>;
  updateMenuItem(id: string, data: UpdateMenuItemData): Promise<MenuItem>;
  deleteMenuItem(id: string): Promise<void>;
  
  // Auth
  getUserByEmail(email: string): Promise<User | null>;
  createUser(email: string, name: string, role: Role): Promise<User>;
}
```

#### 8. **Frontend Integration**
**What needs to change**:
- Replace all mock data with API calls using `@tanstack/react-query`
- Implement proper authentication flow
- Add WebSocket connection management
- Handle loading and error states
- Implement cart persistence in localStorage
- Add proper form submissions to backend
- Implement protected routes (redirect if not authenticated)

**Example changes needed**:

```typescript
// Instead of:
const vendors = [/* hardcoded */];

// Use:
const { data: vendors, isLoading } = useQuery({
  queryKey: ['/api/vendors'],
  queryFn: () => fetch('/api/vendors?openOnly=true').then(r => r.json())
});
```

#### 9. **Testing**
**Not Yet Implemented**:
- ❌ Basic Jest test for order total calculation
- ❌ API endpoint tests
- ❌ WebSocket connection tests

**Mentioned in requirements**:
```typescript
// Example test needed:
describe('Order calculations', () => {
  it('calculates order total correctly', () => {
    const items = [
      { price: 60, quantity: 2 },
      { price: 120, quantity: 1 }
    ];
    expect(calculateTotal(items)).toBe(240);
  });
});
```

---

## 🔧 Environment Setup Required

### Secrets Already Set (as per requirements)
- ✅ `DATABASE_URL` - Neon PostgreSQL connection
- ✅ `NEXTAUTH_SECRET` - For session encryption
- ✅ `GOOGLE_CLIENT_ID` - Google OAuth
- ✅ `GOOGLE_CLIENT_SECRET` - Google OAuth

### Additional Setup Needed
- Session secret for Express (if not using NextAuth)
- WebSocket server configuration
- CORS settings for production

---

## 📝 Seed Data Requirements

**Seed script needed** (`prisma/seed.ts` or similar):
- Create 3-5 vendors with realistic data
- Each vendor should have 2-4 menu items
- Opening hours in JSON format
- At least one admin user with known email
- Various price points (₹30 - ₹150 range)

**Example seed data**:
```typescript
// Vendors
- Campus Canteen (Indian, Chinese, Continental)
- Night Canteen (Snacks, Beverages)
- Juice Center (Juices, Smoothies)
- Coffee Shop (Coffee, Pastries)
- Food Court (Multiple cuisines)

// Admin user
- Email: admin@goa.bits-pilani.ac.in
- Role: admin
```

---

## 🎨 Design Decisions Made

1. **Color Scheme**: Orange primary (#FF6B35) for food/appetite appeal
2. **Font**: Inter for clean, modern readability
3. **Layout**: Card-based design for scannable content
4. **Status Colors**: Semantic colors for order states (blue→green→yellow→orange→gray)
5. **Mobile-first**: All pages responsive down to 320px
6. **Interactions**: Hover states, loading indicators, toast notifications

---

## 🚀 How to Run (Current State)

```bash
# Install dependencies (if not done)
npm install

# Start the development server
npm run dev
```

The frontend will be accessible, but:
- All data is mocked
- No persistence
- No real authentication
- No backend API calls

**Available Routes**:
- `/` - Home (vendor listing)
- `/vendor/1` - Vendor menu example
- `/checkout` - Checkout page
- `/orders/ORD001` - Order tracking example
- `/vendor/dashboard` - Vendor dashboard
- `/admin` - Admin panel

---

## 🎯 Next Steps (Priority Order)

### Immediate (Phase 2A)
1. ✅ Create database schema in Drizzle
2. ✅ Run migrations using `DATABASE_URL`
3. ✅ Create seed script and populate database
4. ✅ Implement storage layer (`server/storage.ts`)

### Core Backend (Phase 2B)
5. ✅ Set up authentication (Google OAuth or Replit Auth)
6. ✅ Implement API endpoints (vendors, menu, orders)
7. ✅ Add authorization middleware (role checks)
8. ✅ Connect frontend to API (replace mock data)

### Real-time (Phase 2C)
9. ✅ Implement WebSocket server
10. ✅ Add WebSocket authentication
11. ✅ Integrate order update broadcasts
12. ✅ Add frontend WebSocket client

### Polish (Phase 2D)
13. ✅ Add comprehensive error handling
14. ✅ Implement proper loading states
15. ✅ Add cart persistence (localStorage)
16. ✅ Write basic tests
17. ✅ Add deployment instructions

---

## ⚠️ Known Limitations & Considerations

1. **Tech Stack**: Requirements specified Next.js but environment is Vite+React
2. **Prisma vs Drizzle**: Requirements want Prisma, environment has Drizzle
3. **No delivery tracking**: Intentionally excluded per requirements
4. **No payment gateway**: Not mentioned in requirements
5. **Campus-only**: Email validation will block all non-BITS emails
6. **No self-registration for vendors**: Admin must create vendor accounts

---

## 📚 Documentation

- **Design Guidelines**: `design_guidelines.md`
- **Component Examples**: `client/src/components/examples/`
- **API Documentation**: (To be created after backend implementation)

---

## 🤝 Contributing / Development Notes

### Code Organization
- Components are fully typed with TypeScript
- All interactive elements have `data-testid` for testing
- Consistent use of shadcn/ui components
- Separation of concerns (components vs pages)

### Testing Identifiers
Every interactive element includes test IDs:
- `button-*` for buttons
- `input-*` for form inputs
- `card-*` for data cards
- `tab-*` for tab navigation
- `text-*` for dynamic text displays

---

## 📞 Support

For questions about:
- **Frontend Design**: Review `design_guidelines.md` and component examples
- **Backend Requirements**: See original requirements file in `attached_assets/`
- **Database Schema**: See "Database Schema & Migrations" section above
- **API Design**: See "API Endpoints" section above

---

**Last Updated**: Phase 1 (Frontend Prototype) - Complete
**Next Phase**: Backend Integration & Authentication
