#!/bin/bash

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================${NC}"
echo -e "${GREEN}Immigration Helper AI - Dev Starter${NC}"
echo -e "${BLUE}===================================${NC}\n"

# Check for .env.local file
if [ ! -f .env.local ]; then
  echo -e "${RED}Error: .env.local file is missing!${NC}"
  echo -e "${YELLOW}Please create a .env.local file with your environment variables.${NC}"
  echo -e "See the README.md or STRIPE-SETUP.md for more information."
  exit 1
fi

# Check for empty environment variables
echo -e "${BLUE}Checking environment variables...${NC}"
source .env.local

# Check Google OAuth credentials
if [ -z "$GOOGLE_CLIENT_ID" ] || [ "$GOOGLE_CLIENT_ID" = "your-google-client-id" ]; then
  echo -e "${RED}Warning: GOOGLE_CLIENT_ID is not set properly in .env.local${NC}"
  echo -e "${YELLOW}Please set up Google OAuth credentials following GOOGLE-OAUTH-SETUP.md${NC}"
  if [[ "$1" != "--force" ]]; then
    echo -e "Run with ${GREEN}--force${NC} to continue anyway.\n"
    exit 1
  fi
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ] || [ "$GOOGLE_CLIENT_SECRET" = "your-google-client-secret" ]; then
  echo -e "${RED}Warning: GOOGLE_CLIENT_SECRET is not set properly in .env.local${NC}"
  echo -e "${YELLOW}Please set up Google OAuth credentials following GOOGLE-OAUTH-SETUP.md${NC}"
  if [[ "$1" != "--force" ]]; then
    echo -e "Run with ${GREEN}--force${NC} to continue anyway.\n"
    exit 1
  fi
fi

# Check Stripe credentials
if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_...your-test-key..." ]; then
  echo -e "${RED}Warning: STRIPE_SECRET_KEY is not set properly in .env.local${NC}"
  echo -e "${YELLOW}Please update your Stripe API keys following STRIPE-SETUP.md${NC}"
  if [[ "$1" != "--force" ]]; then
    echo -e "Run with ${GREEN}--force${NC} to continue anyway.\n"
    exit 1
  fi
fi

if [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ] || [ "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" = "pk_test_...your-test-key..." ]; then
  echo -e "${RED}Warning: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set properly in .env.local${NC}"
  echo -e "${YELLOW}Please update your Stripe API keys following STRIPE-SETUP.md${NC}"
  if [[ "$1" != "--force" ]]; then
    echo -e "Run with ${GREEN}--force${NC} to continue anyway.\n"
    exit 1
  fi
fi

# Kill any running servers first
echo -e "${BLUE}Stopping any running servers...${NC}"
pkill -f "npm run dev" || echo -e "${YELLOW}No servers running.${NC}"

# Try to create the database if it doesn't exist
echo -e "${BLUE}Ensuring database exists...${NC}"
createdb immigration_helper_ai 2>/dev/null || echo -e "${YELLOW}Database already exists.${NC}"

# Apply migrations
echo -e "${BLUE}Running migrations...${NC}"
npx prisma migrate dev --name init || {
  echo -e "${RED}Error applying migrations. Please check your database connection.${NC}"
  echo -e "${YELLOW}Continuing anyway, but the app may not work correctly.${NC}"
}

# Generate Prisma client
echo -e "${BLUE}Generating Prisma client...${NC}"
npx prisma generate || {
  echo -e "${RED}Error generating Prisma client.${NC}"
  exit 1
}

# Check for installed packages
echo -e "${BLUE}Checking for missing dependencies...${NC}"
npm ci --quiet || npm install --quiet

# Start the development server
echo -e "\n${GREEN}Starting development server...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server.${NC}\n"
npm run dev 