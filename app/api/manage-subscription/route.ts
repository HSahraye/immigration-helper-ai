import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user ID
    const userId = session.user.id;
    
    // Parse request body
    const body = await req.json();
    const { action } = body;
    
    // Find user's subscription
    const userSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    
    if (!userSubscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }
    
    // Handle subscription actions
    switch (action) {
      case 'cancel':
        // Cancel the subscription at period end
        if (userSubscription.stripeSubscriptionId) {
          await stripe.subscriptions.update(
            userSubscription.stripeSubscriptionId,
            { cancel_at_period_end: true }
          );
          
          return NextResponse.json({ 
            message: 'Subscription will be canceled at the end of the billing period' 
          });
        } else {
          return NextResponse.json(
            { error: 'No Stripe subscription ID found' },
            { status: 400 }
          );
        }
        
      case 'reactivate':
        // Reactivate a subscription that was set to cancel
        if (userSubscription.stripeSubscriptionId) {
          await stripe.subscriptions.update(
            userSubscription.stripeSubscriptionId,
            { cancel_at_period_end: false }
          );
          
          return NextResponse.json({ 
            message: 'Subscription reactivated successfully' 
          });
        } else {
          return NextResponse.json(
            { error: 'No Stripe subscription ID found' },
            { status: 400 }
          );
        }
        
      case 'customer-portal':
        // Create a billing portal session for the customer
        if (userSubscription.stripeCustomerId) {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/profile?tab=subscription`,
          });
          
          return NextResponse.json({ url: portalSession.url });
        } else {
          return NextResponse.json(
            { error: 'No Stripe customer ID found' },
            { status: 400 }
          );
        }
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: 'An error occurred while managing your subscription' },
      { status: 500 }
    );
  }
} 