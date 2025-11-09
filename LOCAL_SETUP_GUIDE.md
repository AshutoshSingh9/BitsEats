# Local Development Setup Guide

This guide will help you run the BITS Goa Campus Food app on your local machine.

## Prerequisites

- **Node.js** v20.x or higher
- **npm** v10.x or higher
- **Git** (optional, for version control)

## Quick Start

### 1. Clone or Download the Project

If you're remixing from Replit or downloading the code:
```bash
# Download the project files to your local machine
# Extract to a folder like: campus-food-app/
```

### 2. Install Dependencies

```bash
cd campus-food-app
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# On Mac/Linux
cp .env.example .env

# On Windows
copy .env.example .env
```

The `.env.example` file already contains all your credentials. Just rename it to `.env`.

**Important:** The `.env` file is already in `.gitignore` so your secrets won't be committed to Git.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5000**

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes

## Environment Variables Explained

Your `.env` file contains:

### Database (Neon PostgreSQL)
```env
DATABASE_URL=postgresql://...
PGDATABASE=neondb
PGPORT=5432
PGUSER=neondb_owner
PGHOST=ep-polished-forest-ah4uvoyi-pooler...
PGPASSWORD=npg_Z4PvWodmGf6e
```

### Google OAuth
```env
GOOGLE_CLIENT_ID=1065102224681-uikml1n16...
GOOGLE_CLIENT_SECRET=GOCSPX-6d4_Dma85pa0IWQKo...
```

### Session Security
```env
SESSION_SECRET=261e5091717d61410edead45c60cb599...
```

## Google OAuth Setup for Local Development

For Google OAuth to work locally, you need to add `http://localhost:5000` to your authorized origins:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (Client ID: `1065102224681-uikml1n16ns62keieb3frirtueg8g147`)
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Add to **Authorized JavaScript origins**:
   - `http://localhost:5000`
6. Add to **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback`
7. Click **Save**

## Testing the App

### Verify Environment Setup
```bash
node verify-env.cjs
```

### Test Database Connection
```bash
curl http://localhost:5000/api/vendors
```

### Test Google OAuth
1. Open browser: `http://localhost:5000`
2. Click "Sign in with Google"
3. Use a `@goa.bits-pilani.ac.in` email

### Test Manual Login (Vendors/Admins)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@goa.bits-pilani.ac.in","password":"vendor123"}'
```

## Database Migrations

If you make changes to the database schema:

```bash
npm run db:push
```

This uses Drizzle ORM to sync your schema with the database.

## Troubleshooting

### Port Already in Use
If port 5000 is busy:
```bash
# Change PORT in .env
PORT=3000
```

### Database Connection Error
- Verify your `DATABASE_URL` is correct
- Check if Neon database is accessible from your network
- Ensure SSL mode is set: `?sslmode=require`

### Google OAuth Not Working Locally
- Make sure you added `http://localhost:5000` to authorized origins
- Clear browser cookies if you're having session issues
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

## Switching Between Replit and Local

The code automatically detects the environment:

- **In Replit**: Uses Replit Secrets
- **Locally**: Uses `.env` file

No code changes needed! The app checks for `.env` and loads it if present.

## Project Structure

```
.
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── hooks/       # React hooks
│   └── public/          # Static assets
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── auth.ts          # Google OAuth auth
│   ├── db.ts            # Database connection
│   └── storage.ts       # Database queries
├── shared/              # Shared types/schemas
│   └── schema.ts        # Database schema
├── .env.example         # Environment template
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## Production Deployment

### On Replit
1. Add secrets in Replit Secrets tab
2. Click "Run" - it's automatically deployed!

### On Other Platforms (Vercel, Railway, etc.)
1. Set environment variables in platform dashboard
2. Run build: `npm run build`
3. Start server: `npm start`
4. Update Google OAuth redirect URLs to your production domain

## Support

- Check `AUTHENTICATION_GUIDE.md` for authentication details
- Check `CURRENT_STATUS.md` for project status
- Review `replit.md` for Replit-specific info

## Master Credentials (Testing)

```
Admin:
  Email: admin@goa.bits-pilani.ac.in
  Password: admin123

Vendor:
  Email: vendor@goa.bits-pilani.ac.in
  Password: vendor123

Student:
  Email: student@goa.bits-pilani.ac.in
  Password: student123
```

---

**Happy Coding! 🚀**
