'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const PLANS = {
  basic: {
    name: 'Basic',
    price: 'Free',
    features: [
      'Basic document analysis',
      'Limited chat assistance',
      'Access to basic resources',
      'Community support'
    ],
    stripe_price_id: process.env.STRIPE_PRICE_ID_BASIC
  },
  pro: {
    name: 'Pro',
    price: '$19.99/month',
    features: [
      'Advanced document analysis',
      'Unlimited chat assistance',
      'Priority support',
      'Full resource access',
      'Custom templates',
      'Advanced analytics'
    ],
    stripe_price_id: process.env.STRIPE_PRICE_ID_PRO
  }
};

// FOR DEVELOPMENT: Create a subscription directly without going through Stripe
export async function createTestSubscription(planType: string, userId: string) {
  try {
    // Find the plan in the database
    const plan = await prisma.plan.findUnique({
      where: { name: planType.toUpperCase() }
    });

    if (!plan) {
      console.log(`Plan ${planType.toUpperCase()} not found in database, creating temporary plan`);
      // Create a temporary plan for testing
      const tempPlan = await prisma.plan.create({
        data: {
          name: planType.toUpperCase(),
          description: `${planType.toUpperCase()} plan for testing`,
          price: planType.toLowerCase() === 'basic' ? 0 : 19.99,
          stripePriceId: planType.toLowerCase() === 'basic' ? 
            process.env.STRIPE_PRICE_ID_BASIC || 'price_test_basic' : 
            process.env.STRIPE_PRICE_ID_PRO || 'price_test_pro',
          features: planType.toLowerCase() === 'basic' ? 
            ['Basic document analysis', 'Limited chat assistance'] : 
            ['Advanced document analysis', 'Unlimited chat assistance', 'Priority support']
        }
      });
      
      const oneYear = new Date();
      oneYear.setFullYear(oneYear.getFullYear() + 1);
      
      // Create subscription with the temporary plan
      await prisma.subscription.create({
        data: {
          userId,
          planId: tempPlan.id,
          status: 'ACTIVE',
          stripeCustomerId: 'test_customer_' + userId,
          stripeSubscriptionId: 'test_subscription_' + userId,
          stripePriceId: tempPlan.stripePriceId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: oneYear
        }
      });
      
      return `/?subscription_success=true`;
    }

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId }
    });

    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);

    if (existingSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { userId },
        data: {
          planId: plan.id,
          status: 'ACTIVE',
          stripeCustomerId: 'test_customer_' + userId,
          stripeSubscriptionId: 'test_subscription_' + userId,
          stripePriceId: plan.stripePriceId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: oneYear,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new subscription
      await prisma.subscription.create({
        data: {
          userId,
          planId: plan.id,
          status: 'ACTIVE',
          stripeCustomerId: 'test_customer_' + userId,
          stripeSubscriptionId: 'test_subscription_' + userId,
          stripePriceId: plan.stripePriceId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: oneYear
        }
      });
    }

    return `/?subscription_success=true`;
  } catch (error) {
    console.error('Error creating test subscription:', error);
    throw error;
  }
}

export async function createStripeSession(formData: FormData) {
  const plan = formData.get('plan') as string;
  const isSignedIn = formData.get('is_signed_in') === 'true';
  const testMode = formData.get('test_mode') === 'true';

  if (!PLANS[plan as keyof typeof PLANS]) {
    return '/';
  }

  const selectedPlan = PLANS[plan as keyof typeof PLANS];
  
  if (!isSignedIn) {
    // Handle checkout for non-authenticated users
    // When they complete payment, they'll be prompted to create an account
    try {
      const customerEmail = formData.get('email') as string;
      
      if (!customerEmail) {
        return '/checkout?plan=' + plan + '&error=email_required';
      }
      
      if (testMode) {
        // For test mode without auth, redirect to sign in
        return '/auth/signin?callbackUrl=' + encodeURIComponent(`/checkout?plan=${plan}&test=true`);
      }
      
      if (!selectedPlan.stripe_price_id) {
        throw new Error('No price ID found');
      }
      
      const checkoutSession = await createCheckoutSession(
        selectedPlan.stripe_price_id, 
        plan,
        undefined,
        customerEmail
      );
      
      return checkoutSession.url;
      
    } catch (error) {
      console.error('Stripe error:', error);
      return `/checkout?plan=${plan}&error=payment_failed`;
    }
  } else {
    // User is already signed in
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return '/auth/signin?callbackUrl=' + encodeURIComponent(`/checkout?plan=${plan}`);
    }
    
    if (testMode) {
      // Create a test subscription without using Stripe
      return createTestSubscription(plan, session.user.id);
    }

    if (!selectedPlan.stripe_price_id) {
      throw new Error('No price ID found');
    }

    // Get user info from the session
    const userId = session.user.id;
    const userEmail = session.user.email || '';

    // Get customer ID from database if exists
    let customerId;
    // Check if user has a stripeCustomerId
    if (session.user && 'stripeCustomerId' in session.user && session.user.stripeCustomerId) {
      customerId = session.user.stripeCustomerId;
    }

    try {
      const checkoutSession = await createCheckoutSession(
        selectedPlan.stripe_price_id, 
        plan,
        userId,
        userEmail,
        customerId
      );
      
      return checkoutSession.url;
    } catch (error) {
      console.error('Stripe error:', error);
      // If there's a Stripe error, offer test mode
      return `/checkout?plan=${plan}&test=true`;
    }
  }
}

async function createCheckoutSession(priceId: string, planType: string, userId?: string, customerEmail?: string, customerId?: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing Stripe secret key');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/?subscription_success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
    customer: customerId,
    customer_email: !customerId ? customerEmail : undefined,
    metadata: {
      plan: planType,
      userId: userId || ''
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return checkoutSession;
} 