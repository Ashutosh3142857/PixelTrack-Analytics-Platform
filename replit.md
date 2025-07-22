# PixelTrack Analytics Platform

## Overview

PixelTrack is a comprehensive web analytics and lead generation platform that enables users to track website visitors, capture leads, and analyze user behavior through JavaScript tracking pixels. The application provides real-time analytics, geographic data visualization, and customizable lead capture forms.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 22, 2025 - Application Debugging and Local Development Setup
- Fixed critical database query error in server/storage.ts that was preventing app startup
- Resolved React warnings about nested anchor tags in navigation components
- Added proper TypeScript interfaces for user authentication to eliminate type errors
- Created comprehensive local development setup for VS Code users
- Added .env.example template with all required environment variables
- Created LOCAL_SETUP.md with step-by-step installation guide
- Added TROUBLESHOOTING.md for common local development issues
- Included platform-specific startup scripts (dev-local.sh and dev-local.bat)
- Application now runs error-free in both Replit and local environments

### January 21, 2025 - Authentication System Upgrade
- Replaced Replit Auth with Google OAuth and email authentication
- Added user registration and login pages with clean UI design
- Updated database schema to support multiple auth providers
- Implemented password hashing with bcrypt for email users
- Added proper session management with PostgreSQL storage
- Updated all authentication middleware and routes
- System now supports both Google OAuth and email/password authentication

## System Architecture

This is a full-stack TypeScript application built using a modern stack with clear separation between frontend and backend concerns. The architecture follows a traditional three-tier pattern with a React frontend, Express.js backend, and PostgreSQL database.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React Context for client state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

### Database Architecture
- **Primary Database**: PostgreSQL via Neon Database
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless driver with WebSocket support

## Key Components

### Authentication System
The application uses a dual authentication system supporting both Google OAuth and email/password login. Session data is stored in PostgreSQL for persistence across requests. The authentication flow includes:
- Google OAuth2 integration with client credentials
- Email/password registration and login with bcrypt hashing
- Secure session management with HTTP-only cookies
- User profile data persistence with auth provider tracking
- Unified user interface supporting both authentication methods

### Tracking Pixel System
Core functionality that generates JavaScript tracking codes for websites:
- Unique pixel IDs for each tracking instance
- Real-time visitor data collection
- Geographic location detection via IP geolocation
- Device and browser detection from User-Agent strings
- Page view and session tracking

### Analytics Engine
Processes and aggregates visitor data for insights:
- Real-time traffic monitoring
- Geographic distribution analysis
- Device and browser usage statistics
- Lead conversion tracking
- Daily analytics aggregation for performance

### Lead Generation
Customizable forms that can be embedded on websites:
- Dynamic form builder with various field types
- Configurable styling and behavior options
- Lead capture and storage
- Form embed code generation

### Dashboard & Reporting
Comprehensive analytics interface:
- Real-time metrics and KPIs
- Interactive charts using Chart.js
- Visitor table with detailed information
- Geographic data visualization
- Downloadable reports

## Data Flow

1. **Tracking Data Collection**: JavaScript pixels embedded on websites send visitor data to `/api/tracking` endpoints
2. **Data Processing**: Server processes visitor information, enriches with geographic data, and stores in database
3. **Real-time Updates**: Frontend uses TanStack Query to fetch updated analytics data
4. **Lead Capture**: Form submissions are processed and stored as leads linked to tracking pixels
5. **Analytics Aggregation**: Daily batch processes aggregate raw data for reporting

## External Dependencies

### Core Services
- **Neon Database**: PostgreSQL hosting with serverless architecture
- **Google OAuth**: Authentication service for Google login integration

### Third-party APIs
- **ipapi.co**: Free tier geolocation service for visitor geographic data (1000 requests/day limit)

### Development Tools
- **Replit Integration**: Development environment with live reloading and error overlay
- **Vite**: Fast development server and build tool

### UI Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Canvas-based charting library
- **Lucide React**: Icon library

## Deployment Strategy

The application is designed for deployment on Replit with the following considerations:

### Build Process
- Frontend builds to `dist/public` directory
- Backend compiles TypeScript to ESM modules in `dist` directory
- Single production server serves both static assets and API endpoints

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Google OAuth credentials via `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Session secrets via `SESSION_SECRET` environment variable
- Development vs production mode detection

### Database Management
- Drizzle migrations handle schema updates
- Connection pooling for efficient database usage
- Automatic session cleanup and management

### Performance Considerations
- Static asset serving in production
- Database query optimization with proper indexing
- Efficient session storage in PostgreSQL
- Memoized external API calls for geolocation data