# 🚀 Quick Start - Windows

Run this app on your Windows machine in 3 simple steps!

## Step 1: Run Setup Script

Open PowerShell, Command Prompt, or Git Bash in your project folder:

```cmd
cd C:\BitsEats\BitsGoaCampusFood
.\setup-windows.bat
```

This will automatically:
- ✅ Check for `.env` file (create if missing)
- ✅ Install dependencies
- ✅ Verify all secrets are set

## Step 2: Start the Server

**Option A - Using the batch script (Recommended for Windows):**
```cmd
.\dev-windows.bat
```

**Option B - Using npm:**
```cmd
npx cross-env NODE_ENV=development tsx server/index.ts
```

## Step 3: Open the App

Browser: **http://localhost:5000**

---

## ✨ What's Been Set Up

### Files Created:
- ✅ `.env.example` - Template with all your credentials
- ✅ `verify-env.cjs` - Environment checker script
- ✅ `setup-windows.bat` - Automated Windows setup
- ✅ `dev-windows.bat` - Windows dev server script
- ✅ `WINDOWS_SETUP.md` - Detailed Windows guide
- ✅ `LOCAL_SETUP_GUIDE.md` - Complete local dev guide

### Code Changes:
- ✅ Added `dotenv` support for `.env` files
- ✅ Added `cross-env` for Windows compatibility
- ✅ Enhanced error messages with environment validation
- ✅ Auto-loads `.env` in both Replit and local environments

### How It Works:

**On Replit:**
```
Environment Variables → Replit Secrets Tab
npm run dev works fine (Unix environment)
```

**On Windows (Local):**
```
Environment Variables → .env file
Use dev-windows.bat (Windows-compatible)
```

No code changes needed - it detects the environment automatically!

---

## 🔧 Your .env File Contains:

```env
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-polished-forest...
GOOGLE_CLIENT_ID=1065102224681-uikml1n16ns62keieb3frirtueg8g147...
GOOGLE_CLIENT_SECRET=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
SESSION_SECRET=261e5091717d61410edead45c60cb599a4425dd5...
NODE_ENV=development
PORT=5000
```

All your actual credentials are already in `.env.example` - just copy it to `.env`!

---

## 🧪 Quick Test Commands

### Verify Setup
```cmd
node verify-env.cjs
```

### Test Database
```cmd
curl http://localhost:5000/api/vendors
```

### Test Login
```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"vendor@goa.bits-pilani.ac.in\",\"password\":\"vendor123\"}"
```

---

## 📚 Test Accounts

### Admin
- Email: `admin@goa.bits-pilani.ac.in`
- Password: `admin123`

### Vendor
- Email: `vendor@goa.bits-pilani.ac.in`
- Password: `vendor123`

### Student
- Email: `student@goa.bits-pilani.ac.in`
- Password: `student123`

---

## ❓ Common Issues

### "NODE_ENV is not recognized..."
→ This is a Windows issue with npm scripts
→ Solution: Use `.\dev-windows.bat` instead of `npm run dev`

### "OAuth2Strategy requires a clientID option"
→ Your `.env` file is missing or not loaded
→ Run: `node verify-env.cjs`

### Port 5000 busy
→ Change `PORT=5000` to `PORT=3000` in `.env`

### Google OAuth not working locally
→ Add `http://localhost:5000/api/auth/google/callback` to Google Cloud Console

---

## 📖 Full Documentation

- `WINDOWS_SETUP.md` - Complete Windows setup guide
- `LOCAL_SETUP_GUIDE.md` - General local development guide
- `AUTHENTICATION_GUIDE.md` - Auth system details

---

**That's it! You're ready to develop locally on Windows! 🎉**
