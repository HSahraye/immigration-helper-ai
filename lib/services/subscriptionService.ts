import { prisma } from '../prisma';
import { SubscriptionStatus } from '@prisma/client';
import Stripe from 'stripe';

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

// Types for subscription with plan
type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  stripePriceId: string | null;
  features: string[];
};

type Subscription = {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
};

export type SubscriptionWithPlan = Subscription & {
  plan: Plan;
};

/**
 * Create a new subscription for a user
 */
export async function createSubscription(
  userId: string,
  planId: string,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
) {
  try {
    // Get the plan
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    // Calculate period end date (30 days from now)
    const currentDate = new Date();
    const periodEndDate = new Date(currentDate);
    periodEndDate.setDate(periodEndDate.getDate() + 30);

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      // Update existing subscription
      return await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          status: 'ACTIVE' as SubscriptionStatus,
          stripeCustomerId: stripeCustomerId || existingSubscription.stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId || existingSubscription.stripeSubscriptionId,
          currentPeriodStart: currentDate,
          currentPeriodEnd: periodEndDate,
          cancelAtPeriodEnd: false,
        },
        include: {
          plan: true,
        },
      });
    }

    // Create new subscription
    return await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'ACTIVE' as SubscriptionStatus,
        stripeCustomerId,
        stripeSubscriptionId,
        currentPeriodStart: currentDate,
        currentPeriodEnd: periodEndDate,
      },
      include: {
        plan: true,
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
}

/**
 * Get a user's active subscription
 */
export async function getUserSubscription(userId: string) {
  try {
    return await prisma.subscription.findUnique({
      where: { userId },
      include: {
        plan: true,
      },
    });
  } catch (error) {
    console.error('Error getting user subscription:', error);
    throw new Error('Failed to get user subscription');
  }
}

/**
 * Cancel a user's subscription
 */
export async function cancelSubscription(userId: string, cancelImmediately = false) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // If it's a Stripe subscription, cancel it in Stripe first
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: !cancelImmediately,
      });

      if (cancelImmediately) {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      }
    }

    // Update local subscription record
    return await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: cancelImmediately ? 'CANCELED' as SubscriptionStatus : 'ACTIVE' as SubscriptionStatus,
        cancelAtPeriodEnd: !cancelImmediately,
      },
      include: {
        plan: true,
      },
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Update subscription status (typically called by webhook)
 */
export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: SubscriptionStatus,
) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status },
      include: { plan: true },
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw new Error('Failed to update subscription status');
  }
}

/**
 * Check if a user has access to a specific plan feature
 */
export async function hasAccessToFeature(userId: string, featureName: string): Promise<boolean> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });

    // No subscription or not active = no access to premium features
    if (!subscription || subscription.status !== 'ACTIVE') {
      return false;
    }

    // Check if the feature is included in the plan
    return subscription.plan.features.includes(featureName);
  } catch (error) {
    console.error('Error checking feature access:', error);
    throw new Error('Failed to check feature access');
  }
}

/**
 * Process subscription webhook event from Stripe
 */
export async function processSubscriptionEvent(event: Stripe.Event) {
  try {
    let subscription: Stripe.Subscription;
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
        
      case 'customer.subscription.deleted':
        subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;

      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await updateSubscriptionStatus(
            invoice.subscription as string,
            'PAST_DUE' as SubscriptionStatus
          );
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing subscription event:', error);
    throw new Error('Failed to process subscription event');
  }
}

/**
 * Handle subscription update webhook
 */
async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  // Map Stripe status to our status
  let status: SubscriptionStatus;
  
  switch (stripeSubscription.status) {
    case 'active':
      status = 'ACTIVE' as SubscriptionStatus;
      break;
    case 'trialing':
      status = 'TRIALING' as SubscriptionStatus;
      break;
    case 'past_due':
      status = 'PAST_DUE' as SubscriptionStatus;
      break;
    case 'unpaid':
      status = 'UNPAID' as SubscriptionStatus;
      break;
    case 'canceled':
      status = 'CANCELED' as SubscriptionStatus;
      break;
    default:
      status = 'ACTIVE' as SubscriptionStatus;
  }

  // Find the subscription by stripeSubscriptionId
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSubscription.id },
  });

  // Find plan by Stripe Price ID
  const priceId = stripeSubscription.items.data[0]?.price.id;
  const plan = await prisma.plan.findFirst({
    where: { stripePriceId: priceId },
  });

  if (!plan) {
    throw new Error('Plan not found for the given Stripe Price ID');
  }

  if (subscription) {
    // Update existing subscription
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planId: plan.id,
        status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      },
    });
  } else {
    // Get the customer to find our user
    const customer = await stripe.customers.retrieve(stripeSubscription.customer as string) as Stripe.Customer;
    
    // Find user by email
    if ('email' in customer && customer.email) {
      const user = await prisma.user.findUnique({
        where: { email: customer.email },
      });

      if (user) {
        // Create new subscription
        await prisma.subscription.create({
          data: {
            userId: user.id,
            planId: plan.id,
            status,
            stripeCustomerId: stripeSubscription.customer as string,
            stripeSubscriptionId: stripeSubscription.id,
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          },
        });
      }
    }
  }
}

/**
 * Handle subscription cancellation webhook
 */
async function handleSubscriptionCanceled(stripeSubscription: Stripe.Subscription) {
  // Update subscription status to canceled
  await updateSubscriptionStatus(
    stripeSubscription.id,
    'CANCELED' as SubscriptionStatus
  );
} 