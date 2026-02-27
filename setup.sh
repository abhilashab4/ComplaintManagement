#!/bin/bash
echo "🏨 Starting Hostel CMS..."
echo ""

# Install backend
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Install frontend
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "To start the app, open 2 terminal windows:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  cd backend && npm start"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
