#!/usr/bin/env node

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Load environment variables from .env.local
console.log('🔍 Debugging OAuth Configuration');
console.log('===============================\n');

try {
  // Load environment variables from .env.local
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('✅ Found .env.local file');
    dotenv.config({ path: envPath });
  } else {
    console.log('❌ .env.local file not found!');
    process.exit(1);
  }

  // Check for Google OAuth credentials
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  console.log('\n📋 Google OAuth Credentials Check:');
  console.log('--------------------------------');
  
  if (!googleClientId || googleClientId === 'your-google-client-id') {
    console.log('❌ GOOGLE_CLIENT_ID is missing or using default placeholder value!');
    console.log('   You need to set up a proper Google Cloud Project and OAuth credentials.');
  } else {
    console.log(`✅ GOOGLE_CLIENT_ID is set: ${googleClientId.substring(0, 5)}...`);
  }
  
  if (!googleClientSecret || googleClientSecret === 'your-google-client-secret') {
    console.log('❌ GOOGLE_CLIENT_SECRET is missing or using default placeholder value!');
  } else {
    console.log(`✅ GOOGLE_CLIENT_SECRET is set: ${googleClientSecret.substring(0, 3)}...`);
  }

  // Check for NextAuth URL and secret
  console.log('\n📋 NextAuth Configuration Check:');
  console.log('------------------------------');
  
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  
  if (!nextAuthUrl) {
    console.log('❌ NEXTAUTH_URL is missing!');
  } else {
    console.log(`✅ NEXTAUTH_URL: ${nextAuthUrl}`);
  }
  
  if (!nextAuthSecret) {
    console.log('❌ NEXTAUTH_SECRET is missing!');
  } else {
    console.log(`✅ NEXTAUTH_SECRET is set`);
  }

  // Display common error solutions
  console.log('\n🛠 Troubleshooting Steps for Error 401: invalid_client:');
  console.log('----------------------------------------------------');
  console.log('1. Create a project in Google Cloud Console');
  console.log('2. Configure the OAuth consent screen (External user type is fine for testing)');
  console.log('3. Create OAuth 2.0 Client ID (Web application type)');
  console.log('4. Add these authorized redirect URIs:');
  console.log(`   - ${nextAuthUrl || 'http://localhost:3000'}/api/auth/callback/google`);
  console.log('5. Add yourself as a test user in the OAuth consent screen');
  console.log('6. Copy the Client ID and Client Secret to your .env.local file');
  console.log('7. Restart your development server');
  
  console.log('\n📚 For detailed setup instructions, see GOOGLE-OAUTH-SETUP.md');
  
} catch (error) {
  console.error('Error during OAuth debugging:', error);
} 