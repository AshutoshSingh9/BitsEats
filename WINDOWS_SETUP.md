# Windows Setup Guide

Quick setup guide for running the BITS Goa Campus Food app on Windows.

## Step-by-Step Setup

### 1. Open PowerShell or Command Prompt

Navigate to your project folder:
```cmd
cd C:\BitsEats\BitsGoaCampusFood
```

### 2. Run the Setup Script

```cmd
setup-windows.bat
```

This will:
- ✅ Check if `.env` file exists (create from `.env.example` if missing)
- ✅ Install dependencies (`npm install`)
- ✅ Verify all environment variables are set

### 3. Manual Setup (if script doesn't work)

#### Create .env file
```cmd
copy .env.example .env
```

#### Edit .env file
Open `.env` in Notepad or VS Code and verify it contains:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Z4PvWodmGf6e@ep-polished-forest-ah4uvoyi-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
GOOGLE_CLIENT_ID=1065102224681-uikml1n16ns62keieb3frirtueg8g147.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
SESSION_SECRET=261e5091717d61410edead45c60cb599a4425dd5e486f91396e84bef3b406620
NODE_ENV=development
PORT=5000
```

#### Install dependencies
```cmd
npm install
```

#### Verify environment
```cmd
node verify-env.cjs
```

### 4. Start Development Server

**On Windows, use the Windows-specific script:**

```cmd
.\dev-windows.bat
```

**OR use npx directly:**

```cmd
npx cross-env NODE_ENV=development tsx server/index.ts
```

The app will be available at: **http://localhost:5000**

> **Note:** `npm run dev` won't work on Windows because it uses Unix syntax. Use the batch script or npx command instead.

## Troubleshooting

### Error: "OAuth2Strategy requires a clientID option"

This means your `.env` file is not being loaded. Fix:

1. Make sure `.env` file exists in the project root
2. Run verification: `node verify-env.cjs`
3. Check that all variables are present in `.env`

### Error: "Cannot find module 'dotenv'"

Install dependencies:
```cmd
npm install
```

### Port 5000 Already in Use

Change the port in `.env`:
```env
PORT=3000
```

Then run: `npm run dev`

### Google OAuth Redirect Error

You need to add your local URL to Google Cloud Console:

1. Go to: https://console.cloud.google.com/
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth Client ID
4. Add **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback`
5. Click **Save**

### Session Secret Warning

If you see: `express-session deprecated req.secret`

This is just a deprecation warning, the app will still work. The session secret is properly configured via environment variables.

## Quick Commands

```cmd
# Verify environment setup
node verify-env.cjs

# Start development server (Windows)
.\dev-windows.bat

# OR use npx directly
npx cross-env NODE_ENV=development tsx server/index.ts

# Run TypeScript type checking
npm run check

# Build for production
npm run build

# Run production build
npm start

# Push database schema changes
npm run db:push
```

## Testing Locally

### Test the API
```cmd
curl http://localhost:5000/api/vendors
```

### Test Google Login
1. Open browser: `http://localhost:5000`
2. Click "Sign in with Google"
3. Use `@goa.bits-pilani.ac.in` email

### Test Manual Login
```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"vendor@goa.bits-pilani.ac.in\",\"password\":\"vendor123\"}"
```

## VS Code Users

If you're using VS Code, you can add this to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "npm",
      "script": "dev",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

Then press `Ctrl+Shift+B` to start the server.

## Common Windows-Specific Issues

### Path Issues
Use forward slashes or double backslashes in paths:
- ✅ `C:/BitsEats/BitsGoaCampusFood`
- ✅ `C:\\BitsEats\\BitsGoaCampusFood`
- ❌ `C:\BitsEats\BitsGoaCampusFood` (may cause issues in some contexts)

### Line Endings
If you cloned from Git and have line ending issues:
```cmd
git config core.autocrlf true
```

### Firewall Warning
Windows Firewall may ask for permission when you first run the server. Click "Allow access".

## Next Steps

Once the server is running:
1. Open browser to `http://localhost:5000`
2. Test login with Google OAuth
3. Try the test credentials (see `AUTHENTICATION_GUIDE.md`)

---

**Need Help?** Check `LOCAL_SETUP_GUIDE.md` for more details.
