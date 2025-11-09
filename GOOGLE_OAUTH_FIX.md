# Google OAuth Configuration Fix

## ❌ Problem
Google OAuth was failing with a 403 error because the redirect URIs were incorrectly configured.

## ✅ Solution

### Step 1: Fix Google Cloud Console Configuration

Go to [Google Cloud Console](https://console.cloud.google.com) and update your OAuth 2.0 Client ID:

1. Navigate to **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, **REMOVE** these incorrect URIs:
   - ❌ `http://localhost:5000/login/api/callback`
   - ❌ `https://b2996b61-cdf0-4bdf-be42-cd757fbc6a55-00-354pqtf29yk47.worf.replit.dev/login/api/callback`

4. **ADD** these correct URIs:
   - ✅ `http://localhost:5000/api/auth/google/callback`
   - ✅ `https://b2996b61-cdf0-4bdf-be42-cd757fbc6a55-00-354pqtf29yk47.worf.replit.dev/api/auth/google/callback`

5. Click **Save**

### Step 2: Code Fixes (Already Done)

I've fixed the following issues in the code:

1. ✅ **Session Cookie Configuration**
   - Added `sameSite: 'lax'` to cookie settings
   - Set `secure: true` for HTTPS (Replit requirement)
   - This fixes the issue where sessions weren't persisting after manual login

2. ✅ **Role-Based Redirects**
   - Admin users → redirected to `/admin`
   - Vendor users → redirected to `/vendor/dashboard`
   - Student users → redirected to `/` (home page)

3. ✅ **Created Login Page**
   - New route: `/login`
   - Contains "Continue with Google" button for students
   - Contains manual login form for vendors/admins

## 🧪 Testing

After fixing the Google Cloud Console configuration:

1. **Test Google OAuth (Students)**:
   - Click "Sign In" button
   - Click "Continue with Google"
   - You should be redirected to Google's authentication page
   - After successful login, you'll be redirected back to the home page

2. **Test Manual Login (Vendors/Admins)**:
   - Click "Sign In" button
   - Scroll down to "Or sign in with credentials"
   - Enter email and password
   - After successful login:
     - Admins → redirected to `/admin`
     - Vendors → redirected to `/vendor/dashboard`

## 📝 Master Credentials Reference

The master credentials for testing are stored in the database. Check the `createMasterAccounts.ts` file for details.

## 🔧 Troubleshooting

**If Google OAuth still doesn't work:**
1. Clear your browser cookies
2. Verify the redirect URIs in Google Cloud Console match exactly (case-sensitive)
3. Make sure the Google Cloud project has the correct domain configured
4. Check that your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET match the ones in Google Cloud Console

**If manual login doesn't persist session:**
1. Check browser console for cookie errors
2. Verify cookies are being set (check browser DevTools → Application → Cookies)
3. Make sure you're accessing the app over HTTPS (Replit URLs are always HTTPS)
