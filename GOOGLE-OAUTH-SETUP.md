# Google OAuth Setup Guide for Immigration Helper AI

This guide will help you correctly set up Google OAuth credentials for your application to fix the `Error 401: invalid_client` authentication problem.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a name (e.g., "Immigration Helper AI")
5. Click "Create"
6. Wait for the project to be created and make sure it's selected in the project dropdown

## Step 2: Configure the OAuth Consent Screen

1. From the left sidebar menu, select "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace organization)
3. Click "Create"
4. Fill out the required fields:
   - App name: "Immigration Helper AI"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Under "Scopes", click "Add or Remove Scopes"
7. Add the following scopes:
   - `openid`
   - `email`
   - `profile`
8. Click "Save and Continue"
9. Under "Test users", click "Add Users"
10. Add your email address
11. Click "Save and Continue"
12. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth Credentials

1. From the left sidebar, click on "Credentials"
2. Click the "Create Credentials" button and select "OAuth client ID"
3. For "Application type", select "Web application"
4. Name: "Immigration Helper AI Web Client"
5. Under "Authorized JavaScript origins", click "Add URI" and enter:
   ```
   http://localhost:3000
   ```
6. Under "Authorized redirect URIs", click "Add URI" and enter:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click "Create"
8. You will see a popup with your credentials. Copy the "Client ID" and "Client Secret"

## Step 4: Update Your Environment Variables

1. Open your `.env.local` file
2. Update the following variables with your new credentials:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```
3. Make sure you have also set the NEXTAUTH_SECRET (can be any random string) and NEXTAUTH_URL:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_here
   ```

## Step 5: Restart Your Application

1. Stop your application if it's running
2. Run `./start-dev.sh` to restart the application with the new credentials

## Common Issues and Solutions

### Error 401: invalid_client

This error occurs when:
- The Client ID or Client Secret is incorrect in your `.env.local` file
- Your OAuth consent screen is not properly configured
- The authorized redirect URI doesn't match your application's callback URL

### Error: redirect_uri_mismatch

This happens when the callback URL in your app doesn't match what's configured in Google Cloud Console:
- Make sure you've added `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
- If you're using a different port or host, update accordingly

### Application not verified

For development, this isn't an issue because you added yourself as a test user. For production:
- Complete the verification process in the OAuth consent screen section
- Provide the required information and submit for review

## Testing Your Authentication

1. Start your application
2. Navigate to any page that requires authentication
3. Click the "Sign in" button
4. You should be redirected to the Google sign-in page
5. After signing in, you should be redirected back to your application

If you encounter any issues, check the browser console and server logs for more details. 