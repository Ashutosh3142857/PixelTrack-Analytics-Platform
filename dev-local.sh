#!/bin/bash

echo "🚀 Starting PixelTrack Analytics for local development..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please copy .env.example to .env and fill in your values:"
    echo "   cp .env.example .env"
    echo ""
    echo "📖 See LOCAL_SETUP.md for detailed setup instructions"
    exit 1
fi

echo "✅ Environment file found"
echo ""
echo "🌐 Starting development server..."
echo "   Frontend + Backend: http://localhost:5000"
echo "   API Base URL: http://localhost:5000/api"
echo ""
echo "📊 Dashboard will be available at: http://localhost:5000"
echo ""

# Set environment and start development server
export NODE_ENV=development
npm run dev