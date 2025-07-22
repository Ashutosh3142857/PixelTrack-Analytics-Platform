# PixelTrack Deployment Guide

## GitHub Repository Setup

### Step 1: Create GitHub Repository
1. Go to https://github.com/Ashutosh3142857
2. Click "New repository"
3. Name it "pixeltrack-analytics" or your preferred name
4. Set it to Public or Private as desired
5. Do NOT initialize with README, .gitignore, or license (we already have these)

### Step 2: Push Code to GitHub
Run these commands in your local terminal or Replit shell:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: PixelTrack Analytics Platform with Google Auth"

# Add GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/Ashutosh3142857/your-repo-name.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Environment Configuration

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Security
SESSION_SECRET=your_long_random_string

# Environment
NODE_ENV=production
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend + Serverless)

1. **Connect Repository**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select the project

2. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Go to Project Settings > Environment Variables

4. **Custom Build Configuration**
   Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/public/$1"
       }
     ]
   }
   ```

### Option 2: Railway (Recommended for Full-Stack)

1. **Connect Repository**
   - Go to https://railway.app
   - New Project > Deploy from GitHub repo
   - Select your repository

2. **Add PostgreSQL Database**
   - Click "Add service" > Database > PostgreSQL
   - Copy the connection string to DATABASE_URL

3. **Configure Environment Variables**
   - Go to your service > Variables tab
   - Add all required environment variables

4. **Deploy**
   - Railway will automatically build and deploy
   - Custom domain available in settings

### Option 3: Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set GOOGLE_CLIENT_ID=your_client_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
   heroku config:set SESSION_SECRET=your_session_secret
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean > Apps
   - Create App from GitHub repository

2. **Configure Build**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Add Database**
   - Add PostgreSQL database component
   - Environment variables auto-configured

## Post-Deployment Setup

### 1. Database Migration
After deployment, run:
```bash
npm run db:push
```

### 2. Google OAuth Configuration
Update your Google OAuth settings:
- Go to Google Cloud Console
- Navigate to APIs & Services > Credentials
- Edit your OAuth 2.0 client
- Add production redirect URI: `https://yourdomain.com/api/auth/google/callback`

### 3. Domain Configuration
- Update allowed origins in CORS settings if needed
- Configure custom domain in hosting platform
- Set up SSL certificate (usually automatic)

### 4. Monitoring Setup
- Configure error tracking (Sentry recommended)
- Set up uptime monitoring
- Configure log aggregation

## Production Optimization

### 1. Performance
- Enable gzip compression
- Configure CDN for static assets
- Implement database connection pooling
- Add Redis for session storage (optional)

### 2. Security
- Enable HTTPS redirect
- Configure security headers
- Set up rate limiting
- Implement CSRF protection

### 3. Monitoring
- Application performance monitoring
- Database query optimization
- Error logging and alerting
- User analytics

## Backup Strategy

### Database Backups
- Automated daily backups
- Point-in-time recovery
- Cross-region backup storage

### Code Backups
- GitHub repository serves as primary backup
- Tag releases for version control
- Document deployment procedures

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check firewall settings
   - Ensure database is accessible from deployment platform

3. **Authentication Problems**
   - Verify Google OAuth credentials
   - Check redirect URLs match exactly
   - Ensure session secret is set

4. **API Errors**
   - Review server logs
   - Check environment variables
   - Verify API endpoints are properly configured

### Support Contacts
- GitHub Issues: Create issue in repository
- Documentation: Refer to README.md
- Emergency: Check hosting platform status pages