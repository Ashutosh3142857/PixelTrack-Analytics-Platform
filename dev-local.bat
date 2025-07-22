@echo off
echo Starting PixelTrack Analytics for local development...

if not exist .env (
    echo ERROR: .env file not found!
    echo Please copy .env.example to .env and fill in your values
    echo See LOCAL_SETUP.md for detailed instructions
    pause
    exit /b 1
)

echo Environment file found, starting development server...
echo.
echo Frontend + Backend will be available at: http://localhost:5000
echo API endpoints available at: http://localhost:5000/api
echo.

set NODE_ENV=development
npm run dev