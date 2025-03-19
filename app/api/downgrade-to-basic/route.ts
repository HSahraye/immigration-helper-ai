import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST() {
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
    
    try {
      // Find basic plan
      const basicPlan = await prisma.plan.findUnique({
        where: { name: 'BASIC' },
      });
      
      if (!basicPlan) {
        return NextResponse.json(
          { error: 'Basic plan not found in database' },
          { status: 500 }
        );
      }
      
      // If there's a Stripe subscription ID, cancel it immediately with Stripe
      if (userSubscription.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(userSubscription.stripeSubscriptionId, {
            invoice_now: true,
            prorate: true,
          });
        } catch (error) {
          console.error('Error canceling Stripe subscription:', error);
          // Continue anyway since we want to downgrade in our database
        }
      }
      
      // Update the subscription in the database
      await prisma.subscription.update({
        where: { userId },
        data: {
          planId: basicPlan.id,
          status: 'ACTIVE',
          stripeSubscriptionId: null,
          stripePriceId: null,
          updatedAt: new Date(),
        },
      });
      
      return NextResponse.json({
        success: true,
        message: 'Subscription downgraded to Basic plan',
      });
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      return NextResponse.json(
        { error: 'Failed to downgrade subscription' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in downgrade-to-basic API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 