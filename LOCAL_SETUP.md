# Local Development Setup Guide

This guide helps you run the PixelTrack Analytics application locally in VS Code.

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **PostgreSQL database** (local or cloud-hosted like Neon, Supabase, etc.)
3. **Git** (for version control)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
You need a PostgreSQL database. Choose one of these options:

**Option A: Local PostgreSQL**
- Install PostgreSQL locally
- Create a database for the project
- Get the connection string

**Option B: Cloud Database (Recommended)**
- Sign up for [Neon](https://neon.tech/) (free tier available)
- Create a new project
- Copy the connection string

### 3. Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Edit the .env file with your actual values
```

Fill in your `.env` file with:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: A random secure string (generate one online)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: (Optional, for Google OAuth)

### 4. Database Migration
```bash
# Push the database schema to your database
npm run db:push
```

### 5. Start the Application
```bash
# Development mode (runs both frontend and backend)
npm run dev
```

## Common Issues & Solutions

### Issue: "Cannot access routes" or 404 errors
**Solution**: Make sure you're accessing the correct URLs:
- Frontend: `http://localhost:5000`
- API routes: `http://localhost:5000/api/...`

The app serves both frontend and API on the same port (5000).

### Issue: Database connection errors
**Solutions**:
1. Verify your `DATABASE_URL` is correct
2. Make sure your database is running
3. Check firewall/network settings if using cloud database
4. Run `npm run db:push` to ensure schema is created

### Issue: Authentication not working
**Solutions**:
1. Set a secure `SESSION_SECRET` in your `.env` file
2. For Google OAuth, configure your OAuth credentials in Google Console
3. Make sure the callback URL in Google Console matches your local URL

### Issue: Port already in use
**Solution**: Either:
1. Kill the process using port 5000: `lsof -ti:5000 | xargs kill`
2. Or change the PORT in your `.env` file

## Development Workflow

1. **Frontend Development**: Files in `client/src/` hot-reload automatically
2. **Backend Development**: Server restarts automatically when you change files in `server/`
3. **Database Changes**: Run `npm run db:push` after modifying `shared/schema.ts`

## Project Structure

```
├── client/          # React frontend
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
├── public/          # Static assets
└── .env            # Environment variables (create from .env.example)
```

## Differences from Replit

When running locally vs Replit:
- You need to set up environment variables manually
- You need your own PostgreSQL database
- Some Replit-specific packages are optional locally
- You control the development environment

## Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify all environment variables are set correctly
3. Ensure your database is accessible and the schema is up to date
4. Check that all dependencies are installed (`npm install`)