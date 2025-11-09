# BITS Goa Campus Food - Project Overview

## Overview

A campus-exclusive food ordering platform for BITS Goa that enables students and faculty to order food from on-campus vendors. The system features dual interfaces for users and vendors, real-time order tracking via WebSockets, and strict email domain authentication to ensure campus-only access.

**Core Purpose**: Streamline campus food ordering by connecting students/faculty with campus vendors through a simple, real-time ordering system.

**Key Features**:
- Browse vendors and menus
- Place orders with cart management
- Real-time order status tracking
- Vendor dashboard for order management
- Admin panel for vendor/menu administration
- Campus-restricted authentication (@goa.bits-pilani.ac.in only)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Wouter for client-side routing

**UI System**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling

**Design Philosophy**: 
- Mobile-first responsive design inspired by food delivery apps (Swiggy, Zomato)
- Food-themed color scheme with orange primary color for appetite appeal
- Clear information hierarchy optimized for quick scanning and decision-making
- Trust-building through transparency (real-time status updates, clear ETAs)

**State Management**: 
- TanStack Query (React Query) for server state
- Local React state for UI interactions
- Cart state persisted in component state (not localStorage despite original plans)

**Key Routes**:
- `/` - Vendor listing homepage
- `/vendor/:id` - Individual vendor menu with cart
- `/checkout` - Order placement with contact form
- `/orders/:id` - Real-time order tracking
- `/vendor/dashboard` - Vendor order management interface
- `/admin` - Administrative controls for vendors/menus

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Database Layer**:
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: Neon PostgreSQL (serverless)
- **Connection**: WebSocket-enabled via `@neondatabase/serverless` package with `ws` polyfill

**Data Models**:
- `users` - User accounts with role-based access (student, faculty, vendor, admin)
- `vendors` - Vendor business information and settings
- `menuItems` - Food items linked to vendors
- `orders` - Order headers with status tracking
- `orderItems` - Junction table for order line items
- `sessions` - PostgreSQL-based session store for authentication

**Storage Layer** (`server/storage.ts`):
- Abstracted data access through `IStorage` interface
- Complex queries with relations (orders with items, users, vendors)
- Transaction handling for atomic order creation
- CRUD operations for all entities

**Authentication System**:
- **Dual Authentication Approach**:
  1. **Google OAuth** - For students/faculty with @goa.bits-pilani.ac.in emails
  2. **Local Strategy** - Username/password authentication for vendors and admins

- **Email Domain Restriction**: Hard-coded validation allows only `@goa.bits-pilani.ac.in` emails (with commented-out `@gmail.com` support for testing)

- **Session Management**: PostgreSQL-backed sessions using `connect-pg-simple` with 7-day TTL

- **Authorization Middleware**:
  - `isAuthenticated` - Verifies user login status
  - `requireRole(...roles)` - Role-based access control

**API Structure**:
- RESTful endpoints organized in `server/routes.ts`
- Public endpoints (vendor/menu browsing)
- Protected endpoints requiring authentication
- Role-specific endpoints (vendor-only, admin-only)

**Real-time Updates**:
- Native WebSocket server using `ws` package
- Integrated with Express HTTP server
- Order update broadcasts to subscribed clients
- Connection tracking via `connectedClients` Map
- Message format: JSON with type-based routing

### Data Flow Patterns

**Order Creation Flow**:
1. Frontend collects cart items and contact info
2. POST to `/api/orders` with validation
3. Server calculates totals server-side (prevents price tampering)
4. Transaction creates Order + OrderItems atomically
5. WebSocket notifies connected clients
6. Frontend redirects to order tracking page

**Order Status Updates Flow**:
1. Vendor updates order via PATCH `/api/vendor/orders/:id`
2. Server validates vendor ownership
3. Database updated with new status/ETA
4. WebSocket broadcasts to order-subscribed clients
5. Frontend timeline updates in real-time

**Authentication Flow**:
- OIDC redirect to Replit authentication
- Callback validates email domain
- User record created/updated in database
- Session stored in PostgreSQL
- Frontend receives authenticated user state

### External Dependencies

**Core Production Dependencies**:

1. **Database**:
   - `@neondatabase/serverless` - Neon PostgreSQL client with WebSocket support
   - `drizzle-orm` - Type-safe ORM
   - `ws` - WebSocket polyfill for Neon

2. **Authentication**:
   - `passport` - Authentication middleware
   - `passport-google-oauth20` - Google OAuth strategy
   - `passport-local` - Username/password strategy
   - `express-session` - Session management
   - `connect-pg-simple` - PostgreSQL session store
   - `bcrypt` - Password hashing for local accounts

3. **Frontend UI**:
   - `@radix-ui/*` - Headless UI primitives (20+ component packages)
   - `tailwindcss` - Utility-first CSS
   - `class-variance-authority` - Component variant management
   - `lucide-react` - Icon library

4. **State/Data Fetching**:
   - `@tanstack/react-query` - Server state management
   - `react-hook-form` - Form state and validation
   - `@hookform/resolvers` - Form validation integration
   - `zod` - Schema validation

5. **Routing & Utils**:
   - `wouter` - Lightweight client-side routing
   - `clsx` / `tailwind-merge` - Conditional class utilities

**Development Dependencies**:
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React support for Vite
- `typescript` - Type checking
- `drizzle-kit` - Database migrations
- Replit-specific plugins (cartographer, dev banner, runtime error overlay)

**Environment Configuration**:
- `DATABASE_URL` - Neon PostgreSQL connection string (required)
- `SESSION_SECRET` - Session encryption key (required, min 32 chars)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (required)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (required)

**Security Notes**:
- All secrets managed via Replit Secrets (never committed to version control)
- No `.env` file in repository
- Database connection uses SSL (`sslmode=require`)
- Passwords hashed with bcrypt (10 rounds)
- Session cookies HTTP-only with secure flag in production