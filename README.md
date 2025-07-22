# PixelTrack Analytics Platform

A comprehensive web analytics and lead generation SaaS platform that enables users to track website visitors, capture leads, and analyze user behavior through JavaScript tracking pixels.

## Features

- 🔐 **Dual Authentication System** - Google OAuth and email/password login
- 📊 **Real-time Analytics** - Track page views, unique visitors, and user behavior
- 🌍 **Geographic Data** - Visitor location tracking and visualization
- 📝 **Lead Generation** - Customizable forms with embed codes
- 🎯 **Tracking Pixels** - JavaScript snippets for website integration
- 📈 **Interactive Dashboard** - Charts, reports, and data visualization
- 🔒 **Privacy Compliant** - GDPR-friendly with cookie consent management

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + shadcn/ui components
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **Chart.js** for data visualization
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **Drizzle ORM** for database operations
- **PostgreSQL** via Neon Database
- **Passport.js** for authentication
- **bcrypt** for password hashing

### Authentication
- **Google OAuth 2.0** integration
- **Email/Password** registration and login
- **Session-based** authentication with PostgreSQL storage
- **Secure cookie** management

## Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Google OAuth credentials

### Environment Variables
Create a `.env` file with:
```env
DATABASE_URL=your_postgresql_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
SESSION_SECRET=your_secure_random_session_secret
NODE_ENV=development
```

### Installation
```bash
# Install dependencies
npm install

# Set up database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts with auth provider tracking
- `sessions` - Session storage for authentication
- `tracking_pixels` - Tracking pixel configurations
- `page_views` - Visitor analytics data
- `leads` - Captured lead information
- `lead_forms` - Form configurations

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Analytics
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/tracking-pixels` - User's tracking pixels
- `POST /api/tracking-pixels` - Create tracking pixel
- `GET /api/visitors` - Visitor analytics data
- `GET /api/geographic-data` - Geographic distribution

### Lead Generation
- `GET /api/lead-forms` - User's lead forms
- `POST /api/lead-forms` - Create lead form
- `POST /api/leads` - Capture lead (public endpoint)

## Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
Ensure all environment variables are configured on your hosting platform:
- Database connection string
- Google OAuth credentials
- Session secret
- Set `NODE_ENV=production`

### Recommended Hosting
- **Vercel** - Automatic deployments from GitHub
- **Railway** - Full-stack hosting with PostgreSQL
- **Heroku** - Traditional PaaS deployment
- **DigitalOcean App Platform** - Container-based deployment

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── services/           # Business logic
│   ├── auth.ts            # Authentication setup
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data access layer
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub or contact the development team.