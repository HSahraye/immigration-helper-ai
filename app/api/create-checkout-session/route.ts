import { NextResponse, NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  // @ts-ignore - Allow any valid Stripe API version
  apiVersion: '2022-08-01', 
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
    const { planId, successUrl, cancelUrl } = body;
    
    // Validate plan
    if (!planId || !PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }
    
    const plan = PLANS[planId as keyof typeof PLANS];
    
    // Create a Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      customer_email: session.user.email || undefined,
      client_reference_id: session.user.id,
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId: planId,
        },
      },
      success_url: successUrl || `${process.env.NEXTAUTH_URL}/checkout/success`,
      cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/subscribe`,
      metadata: {
        userId: session.user.id,
        planId: planId,
      },
    });
    
    return NextResponse.json({ url: checkoutSession.url });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while creating the checkout session' },
      { status: 500 }
    );
  }
} 