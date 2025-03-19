import { NextResponse, NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Plan configuration
const PLANS = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
    name: 'Basic Plan',
    amount: 999, // $9.99 in cents
  },
  professional: {
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
    name: 'Professional Plan',
    amount: 1999, // $19.99 in cents
  },
};

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getAuthSession();
    
    // Ensure user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be signed in to create a checkout session' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    
    // Validate plan
    if (!body.userId || !session.user.id) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Create a Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_BASIC_PRICE_ID, // Default to basic plan
          quantity: 1,
        },
      ],
      customer_email: session.user.email || undefined,
      client_reference_id: session.user.id,
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/subscribe`,
      metadata: {
        userId: session.user.id,
      },
    });
    
    return NextResponse.json({ sessionId: checkoutSession.id });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { error: 'Failed to initiate checkout. Please try again.' },
      { status: 500 }
    );
  }
} 