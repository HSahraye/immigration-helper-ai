# Email Setup Guide for Immigration Helper AI

To enable the contact forms to send real emails, you'll need to configure your Gmail account to work with the application. Follow these steps:

## Step 1: Create an App Password for Gmail

For security reasons, Gmail requires an "App Password" instead of your regular account password when using apps:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select "Security"
3. Under "Signing in to Google," select "2-Step Verification" (enable it if not already enabled)
4. At the bottom of the page, select "App passwords"
5. Select "Mail" as the app and "Other" as the device
6. Enter "Immigration Helper AI" as the name
7. Click "Generate"
8. Google will display a 16-character password. **Copy this password**

## Step 2: Update Your Environment Variables

1. Open the `.env.local` file in your project
2. Update the `EMAIL_APP_PASSWORD` variable with your newly generated app password:

```
EMAIL_USER=sahrayehamid@gmail.com
EMAIL_APP_PASSWORD=your-app-password-here
```

## Step 3: Restart the Development Server

Stop your current development server (if running) and restart it:

```bash
npm run dev
```

## Testing the Forms

Now you can test the contact forms:

1. Go to http://localhost:3000/services/immigration-documents or http://localhost:3000/services/legal-documents
2. Fill out the form and submit it
3. The email should be sent to your Gmail account (sahrayehamid@gmail.com)

## Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Make sure your Gmail account allows "Less secure app access" (or use App Passwords as described above)
3. Verify your `.env.local` file has the correct credentials
4. Ensure you have properly restarted the development server after changing environment variables 