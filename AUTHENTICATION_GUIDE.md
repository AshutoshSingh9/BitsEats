# Authentication System Guide

## 🔐 Overview

The BITS Goa Campus Food app now supports **dual authentication**:
1. **Google OAuth** - For students/faculty with @goa.bits-pilani.ac.in emails
2. **Manual Login** - For vendors and admins with username/password

---

## 🌐 Google OAuth Authentication

### How It Works
1. User clicks "Sign in with Google" button
2. Redirected to Google login page
3. Google verifies identity
4. User redirected back to app (authenticated)

### Email Domain Restrictions

**Currently Allowed:**
- ✅ `@goa.bits-pilani.ac.in` (BITS Goa official emails only)

**For Testing (Commented Out):**
To allow `@gmail.com` for testing, uncomment lines in `server/auth.ts`:

```typescript
// COMMENTED OUT: Uncomment to also allow @gmail.com for testing
// if (email.endsWith("@gmail.com")) {
//   return true;
// }
```

### Google OAuth Endpoints

**Initiate Login:**
```
GET /api/auth/google
```
Redirects to Google's OAuth consent screen.

**OAuth Callback:**
```
GET /api/auth/google/callback
```
Handles the callback from Google after authentication.

**Frontend Integration Example:**
```jsx
<a href="/api/auth/google">
  <button>Sign in with Google</button>
</a>
```

---

## 🔑 Manual Login (Username/Password)

### Who Uses This?
- Vendors
- Admins
- Any user with a password set in the database

### Login Endpoint

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "vendor@goa.bits-pilani.ac.in",
  "password": "vendor123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "c06eb4ab-82c8-4df9-b273-d62e64af6782",
    "email": "vendor@goa.bits-pilani.ac.in",
    "firstName": "Master",
    "lastName": "Vendor",
    "role": "vendor"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

### Frontend Integration Example:
```jsx
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('Logged in as:', data.user);
    // Redirect to dashboard
  } else {
    const error = await response.json();
    console.error('Login failed:', error.message);
  }
};
```

---

## 👤 Get Current User

**GET** `/api/auth/user`

Returns the currently authenticated user's info.

**Success Response (200):**
```json
{
  "id": "c06eb4ab-82c8-4df9-b273-d62e64af6782",
  "email": "vendor@goa.bits-pilani.ac.in",
  "firstName": "Master",
  "lastName": "Vendor",
  "role": "vendor",
  "profileImageUrl": null
}
```

**Error Response (401):**
```json
{
  "message": "Not authenticated"
}
```

---

## 🚪 Logout

**GET** `/api/auth/logout`

Logs out the current user and redirects to home page.

---

## 🔐 Master Test Credentials

### Vendor Account
```
Email: vendor@goa.bits-pilani.ac.in
Password: vendor123
Role: vendor
Access: Vendor Dashboard
```

### Admin Account
```
Email: admin@goa.bits-pilani.ac.in
Password: admin123
Role: admin
Access: Admin Panel
```

### Student Account
```
Email: student@goa.bits-pilani.ac.in
Password: student123
Role: student
Access: User Dashboard, Order Placement
```

---

## 🛠️ Testing Authentication

### Test Manual Login (cURL)

**Login as Vendor:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@goa.bits-pilani.ac.in","password":"vendor123"}' \
  -c cookies.txt
```

**Get Current User:**
```bash
curl http://localhost:5000/api/auth/user \
  -b cookies.txt
```

**Logout:**
```bash
curl http://localhost:5000/api/auth/logout \
  -b cookies.txt \
  -L
```

### Test Google OAuth

1. Navigate to: `http://localhost:5000/api/auth/google`
2. Sign in with a `@goa.bits-pilani.ac.in` Google account
3. You'll be redirected back to the app (authenticated)

---

## 🔒 Security Features

### Email Validation
- Only `@goa.bits-pilani.ac.in` emails are allowed by default
- Domain restriction enforced for Google OAuth
- Can be extended to allow other domains (see code comments)

### Password Security
- Passwords hashed using **bcrypt** with 10 salt rounds
- Password hashes never exposed in API responses
- Passwords only for manual login (vendors/admins)

### Session Management
- Sessions stored in PostgreSQL database (not in-memory)
- Secure HTTP-only cookies
- 7-day session expiration
- Session secret: `process.env.SESSION_SECRET`

### Role-Based Access Control
Available roles:
- `student` - Can place orders, view their orders
- `faculty` - Same as student
- `vendor` - Can manage their restaurant's orders
- `admin` - Full access to admin panel

---

## 🔧 Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://...

# Session Security
SESSION_SECRET=your-random-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Replit (auto-provided)
REPL_ID=xxxxx
```

---

## 🚀 How to Switch Between Auth Methods

### For Students/Faculty:
1. Use **Google OAuth** (recommended)
2. Click "Sign in with Google"
3. Must have `@goa.bits-pilani.ac.in` email

### For Vendors/Admins:
1. Use **Manual Login**
2. Enter email and password
3. Click "Login"

### Hybrid Approach:
- Users can have BOTH OAuth and password
- If password exists, can use either method
- If no password, must use Google OAuth

---

## 📝 Adding New Manual Login Users

Run this script to create a new user with password:

```typescript
import bcrypt from "bcrypt";
import { db } from "./db";
import { users } from "@shared/schema";

const email = "newuser@goa.bits-pilani.ac.in";
const password = "secure-password";
const passwordHash = await bcrypt.hash(password, 10);

await db.insert(users).values({
  id: crypto.randomUUID(),
  email,
  firstName: "First",
  lastName: "Last",
  role: "vendor", // or "admin"
  passwordHash,
});
```

---

## ⚠️ Important Notes

1. **Google OAuth Callback URL** must be configured in Google Cloud Console:
   ```
   https://your-repl-domain.replit.dev/api/auth/google/callback
   ```

2. **Session cookies** require HTTPS in production (automatically handled by Replit)

3. **Email domain validation** can be modified in `server/auth.ts` → `validateEmail()` function

4. **Password login** is optional - users created via Google OAuth won't have passwords initially

---

## 🔄 Migration from Replit Auth

### What Changed:
- ❌ Removed: `REPL_ID`, `ISSUER_URL` (Replit-specific)
- ✅ Added: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- ✅ Kept: `SESSION_SECRET` (still needed!)

### Files Modified:
- `server/replitAuth.ts` → `server/auth.ts` (complete rewrite)
- `server/routes.ts` (updated imports and user ID extraction)
- `shared/schema.ts` (added `passwordHash` field)

### Database Changes:
- Added `password_hash` column to `users` table
- Existing users remain unchanged
- New users can authenticate via Google or password

---

## ✅ Verification Checklist

- [x] Google OAuth endpoints working (`/api/auth/google`)
- [x] Manual login working (`/api/auth/login`)
- [x] Email domain validation (@goa.bits-pilani.ac.in)
- [x] Session persistence (cookies)
- [x] Password hashing (bcrypt)
- [x] Master credentials created
- [x] Role-based access control
- [x] Get current user endpoint (`/api/auth/user`)
- [x] Logout endpoint (`/api/auth/logout`)

---

**Status:** ✅ Authentication system fully implemented and tested!
