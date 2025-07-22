# Git Workflow for PixelTrack Analytics

## Repository Management

### Current Status
This project is currently hosted on Replit with automatic version control. All changes are automatically saved and versioned in your Replit workspace.

### Pushing Changes to External Repository

If you want to push this code to a GitHub, GitLab, or other Git repository, follow these steps:

#### Option 1: Using Replit's Git Integration
1. **Connect to GitHub**: In Replit, go to the Version Control tab
2. **Create Repository**: Create a new GitHub repository or connect to existing one
3. **Push Changes**: Use Replit's built-in Git interface to push your changes

#### Option 2: Manual Git Setup (Advanced)
If you need to manually set up Git, you'll need to use the terminal in Replit:

```bash
# Initialize git if not already done
git init

# Add your remote repository
git remote add origin https://github.com/yourusername/pixeltrack-analytics.git

# Add all files
git add .

# Commit changes
git commit -m "Complete PixelTrack Analytics with debugging and local setup"

# Push to main branch
git push -u origin main
```

#### Option 3: Download and Upload
1. **Download Project**: Use Replit's download feature to get a zip file
2. **Extract Locally**: Extract the zip file on your computer
3. **Upload to Git**: Create a new repository on GitHub/GitLab and upload the files

### Important Files to Include

When pushing to a repository, make sure these files are included:

#### Essential Project Files
- `server/` - Backend Express.js application
- `client/` - React frontend application
- `shared/` - Shared TypeScript schemas
- `package.json` & `package-lock.json` - Dependencies
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration

#### Documentation Files
- `README.md` - Main project documentation
- `LOCAL_SETUP.md` - Local development setup guide
- `TROUBLESHOOTING.md` - Common issues and solutions
- `DEPLOYMENT.md` - Deployment instructions
- `replit.md` - Project architecture and history

#### Configuration Templates
- `.env.example` - Environment variables template
- `dev-local.sh` / `dev-local.bat` - Local development scripts

#### Files to Exclude (.gitignore)
Create a `.gitignore` file with:
```
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
.vite/
.replit
replit.nix

# Database
*.db
*.sqlite

# Logs
*.log

# OS generated files
.DS_Store
Thumbs.db
```

### Repository Structure
```
pixeltrack-analytics/
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared schemas
├── public/                 # Static assets
├── scripts/               # Development scripts
├── docs/                  # Documentation
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md             # Main documentation
```

### Branching Strategy
For collaborative development:
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Release Process
1. **Development**: Work on feature branches
2. **Testing**: Merge to develop branch
3. **Staging**: Test in staging environment
4. **Production**: Merge to main and deploy

### Deployment Options
- **Replit Deployments**: Direct deployment from Replit
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Railway**: PostgreSQL-friendly hosting platform
- **Heroku**: Traditional PaaS deployment
- **DigitalOcean App Platform**: Modern application hosting

### Environment Variables for Production
When deploying, ensure these environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secure random string
- `NODE_ENV=production`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (if using OAuth)

### Security Considerations
- Never commit `.env` files with real credentials
- Use environment-specific configurations
- Enable HTTPS in production
- Set secure session cookies
- Validate all user inputs
- Use proper CORS settings