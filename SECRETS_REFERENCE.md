# Secrets & Environment Variables Reference

## 🔐 How to Manage Secrets in Replit

**IMPORTANT**: Never create a `.env` file with hardcoded API keys! This is a major security vulnerability.

Instead, use **Replit Secrets** (found in the Tools panel → Secrets):
- Secrets are encrypted and stored securely
- They're automatically available as environment variables
- They're not committed to version control
- They work in both development and production

## ✅ Required Secrets (Currently Set)

### 1. DATABASE_URL
- **Purpose**: Connection string for Neon PostgreSQL database
- **Format**: `postgresql://username:password@host.region.aws.neon.tech/dbname?sslmode=require`
- **Status**: ✅ Set and working
- **How to get**: 
  1. Go to your Neon dashboard (https://neon.tech)
  2. Select your project
  3. Copy the connection string
  4. Add to Replit Secrets with key `DATABASE_URL`

### 2. SESSION_SECRET
- **Purpose**: Encrypts session cookies for authentication
- **Format**: Any random string (minimum 32 characters recommended)
- **Status**: ✅ Set
- **How to generate**:
  ```bash
  # In Replit Shell, run:
  openssl rand -base64 32
  ```
  Then add the output to Replit Secrets with key `SESSION_SECRET`

### 3. GOOGLE_CLIENT_ID
- **Purpose**: Google OAuth client ID for student/faculty authentication
- **Status**: ✅ Set
- **How to get**:
  1. Go to Google Cloud Console (https://console.cloud.google.com)
  2. Create a new project or select existing
  3. Enable Google+ API
  4. Go to Credentials → Create OAuth 2.0 Client ID
  5. Add authorized redirect URI: `https://your-repl-url.replit.app/api/auth/google/callback`
  6. Copy Client ID to Replit Secrets

### 4. GOOGLE_CLIENT_SECRET
- **Purpose**: Google OAuth client secret for student/faculty authentication
- **Status**: ✅ Set
- **How to get**: Same process as GOOGLE_CLIENT_ID above (step 6: copy Client Secret)

## 🔍 How to Check Current Secrets

1. Open Replit project
2. Click "Tools" in left sidebar
3. Click "Secrets"
4. You'll see all configured secrets (values are hidden for security)

## ✅ Verifying Secrets Work

To check if your secrets are properly set:

```bash
# In Replit Shell
echo $DATABASE_URL           # Should show your Neon connection string
echo $SESSION_SECRET         # Should show your session secret
echo $GOOGLE_CLIENT_ID       # Should show your Google OAuth client ID
echo $GOOGLE_CLIENT_SECRET   # Should show your Google OAuth client secret
```

**Note**: The actual values should display. If you see empty output, the secret isn't set.

## 🚫 What NOT To Do

❌ **Don't create a .env file** - It can be accidentally committed to Git
❌ **Don't hardcode secrets in code** - Major security risk
❌ **Don't share secrets in chat/messages** - They should remain private
❌ **Don't commit .env to Git** - Even with .gitignore, it's risky

## ✅ What TO Do

✅ **Use Replit Secrets** - Built-in, secure, encrypted
✅ **Rotate secrets periodically** - Change them every few months
✅ **Use strong random values** - For SESSION_SECRET especially
✅ **Keep production secrets separate** - Don't use same secrets for dev/prod

## 📚 Additional Resources

- Replit Secrets Documentation: https://docs.replit.com/programming-ide/workspace-features/secrets
- Neon Database: https://neon.tech/docs
- Session Security: https://github.com/expressjs/session#secret
