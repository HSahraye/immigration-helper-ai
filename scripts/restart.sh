#!/bin/bash

echo "🔄 Restarting ZazuGroups application..."

# Kill any running Next.js development processes
echo "🛑 Stopping running servers..."
pkill -f "npm run dev" || echo "No running dev server found"

# Ensure the database exists
echo "🗄️ Ensuring database exists..."
createdb immigration_helper_ai || echo "Database already exists"

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name ensure_schema

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Install any missing dependencies
echo "📦 Checking for missing dependencies..."
npm install

# Start the application
echo "🚀 Starting application..."
npm run dev

# Note: This script will keep the terminal busy with the npm run dev process
# To stop the application, press Ctrl+C 