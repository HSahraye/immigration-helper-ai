import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Only enable this in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  // Check environment variables
  const envStatus = {
    nextAuth: {
      url: process.env.NEXTAUTH_URL ? '✓ Set' : '✗ Missing',
      secret: process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
    },
    database: {
      url: process.env.DATABASE_URL ? '✓ Set' : '✗ Missing',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY ? '✓ Set' : '✗ Missing',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ? '✓ Set' : '✗ Missing',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '✓ Set' : '✗ Missing',
      priceIdBasic: process.env.STRIPE_PRICE_ID_BASIC ? '✓ Set' : '✗ Missing',
      priceIdPro: process.env.STRIPE_PRICE_ID_PRO ? '✓ Set' : '✗ Missing',
    },
  };

  return NextResponse.json(envStatus);
} 