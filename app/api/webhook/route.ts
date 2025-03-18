import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          // Find subscription details in Stripe
          if (session.subscription) {
            const subscriptionId = 
              typeof session.subscription === 'string' 
                ? session.subscription 
                : session.subscription.id;
            
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            // Update user's subscription in database
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                stripeSubscriptionId: subscriptionId,
                planId: planId,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                status: subscription.status.toUpperCase() as any,
              },
              create: {
                userId,
                planId: planId,
                stripeSubscriptionId: subscriptionId,
                stripeCustomerId: subscription.customer as string,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                status: subscription.status.toUpperCase() as any,
              },
            });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        
        // Update subscription period end
        if (subscription && subscription.metadata.userId) {
          const userId = subscription.metadata.userId;
          
          // Find subscription by userId and stripeSubscriptionId
          const existingSubscription = await prisma.subscription.findFirst({
            where: { 
              stripeSubscriptionId: subscriptionId 
            }
          });
          
          if (existingSubscription) {
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                status: subscription.status.toUpperCase() as any,
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.metadata.userId) {
          // Find subscription by stripeSubscriptionId
          const existingSubscription = await prisma.subscription.findFirst({
            where: { 
              stripeSubscriptionId: subscription.id 
            }
          });
          
          if (existingSubscription) {
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                status: subscription.status.toUpperCase() as any,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.metadata.userId) {
          // Find subscription by stripeSubscriptionId
          const existingSubscription = await prisma.subscription.findFirst({
            where: { 
              stripeSubscriptionId: subscription.id 
            }
          });
          
          if (existingSubscription) {
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                status: 'CANCELED',
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
} 