# Troubleshooting Guide for Local Development

## Common Issues When Running in VS Code

### 1. "Cannot access routes" or 404 Errors

**Problem**: Routes return 404 or are not accessible
**Solutions**:
- Make sure you're accessing `http://localhost:5000` (not port 3000)
- The app serves both frontend and API on the same port
- API routes should be accessed as `http://localhost:5000/api/...`
- Clear browser cache and cookies

### 2. Database Connection Errors

**Problem**: "Connection refused" or database errors
**Solutions**:
```bash
# 1. Check your DATABASE_URL in .env file
cat .env | grep DATABASE_URL

# 2. Test database connection
npm run db:push

# 3. For local PostgreSQL, ensure it's running
# Windows: services.msc -> PostgreSQL
# Mac: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
```

### 3. Environment Variables Not Working

**Problem**: App can't find environment variables
**Solutions**:
```bash
# 1. Ensure .env file exists in root directory
ls -la .env

# 2. Check .env format (no quotes around values typically needed)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
SESSION_SECRET=your-long-random-secret-string
PORT=5000

# 3. Restart your development server after changing .env
```

### 4. Authentication Issues

**Problem**: Login not working or session errors
**Solutions**:
- Set a secure `SESSION_SECRET` in .env (at least 32 characters)
- For Google OAuth, ensure you have valid credentials
- Check that your database has the sessions and users tables
- Clear browser cookies for localhost

### 5. Port Already in Use

**Problem**: "Port 5000 already in use"
**Solutions**:
```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill
# OR change PORT in .env to different number like 3001
```

### 6. Dependencies Issues

**Problem**: Module not found or import errors
**Solutions**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (need 18+)
node --version

# TypeScript compilation check
npx tsc --noEmit
```

### 7. Vite/React Build Issues

**Problem**: Frontend not loading or build errors
**Solutions**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Check if all frontend dependencies are installed
npm list react react-dom vite

# Restart VS Code completely
```

### 8. Database Schema Issues

**Problem**: Table doesn't exist or schema mismatch
**Solutions**:
```bash
# Push current schema to database
npm run db:push

# Check what tables exist in your database
# Connect to your DB and run: \dt (PostgreSQL)

# If you need to reset database, drop all tables and run db:push again
```

## Environment Setup Checklist

Before running locally, ensure:
- [ ] Node.js 18+ installed
- [ ] PostgreSQL database available (local or cloud)
- [ ] .env file created from .env.example
- [ ] DATABASE_URL set in .env
- [ ] SESSION_SECRET set in .env
- [ ] Dependencies installed (`npm install`)
- [ ] Database schema pushed (`npm run db:push`)

## Development URLs

When running locally:
- **App**: http://localhost:5000
- **API**: http://localhost:5000/api/*
- **Auth**: http://localhost:5000/api/auth/*

## Getting Additional Help

If you're still having issues:

1. **Check console output** for specific error messages
2. **Check browser developer tools** console for frontend errors
3. **Verify database connectivity** with a GUI tool like pgAdmin
4. **Test API endpoints directly** using curl or Postman

## Differences from Replit

Key differences when running locally:
- Need to set up your own PostgreSQL database
- Environment variables must be configured manually
- No automatic dependency management
- Need to handle port conflicts manually
- No built-in deployment options