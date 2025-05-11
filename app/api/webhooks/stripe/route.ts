import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// This is your Stripe webhook secret for verifying webhook events
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout
        if (session.subscription) {
          const subscriptionData = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Get user ID from metadata
          const userId = session.metadata?.userId;
          
          if (userId) {
            // Get default plan
            const defaultPlan = await prisma.plan.findFirst({
              where: {
                name: session.metadata?.plan?.toUpperCase() || 'PRO'
              }
            });

            if (!defaultPlan) {
              throw new Error('Plan not found');
            }
            
            // Check if user already has a subscription
            const existingSubscription = await prisma.subscription.findUnique({
              where: {
                userId: userId
              }
            });
            
            if (existingSubscription) {
              // Update existing subscription
              await prisma.subscription.update({
                where: {
                  userId: userId
                },
                data: {
                  status: subscriptionData.status,
                  stripeCustomerId: session.customer as string,
                  stripeSubscriptionId: session.subscription as string,
                  stripePriceId: subscriptionData.items.data[0]?.price.id,
                  planId: defaultPlan.id,
                  currentPeriodStart: new Date(subscriptionData.current_period_start * 1000),
                  currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000),
                  updatedAt: new Date()
                }
              });
            } else {
              // Create new subscription
              await prisma.subscription.create({
                data: {
                  userId: userId,
                  planId: defaultPlan.id,
                  status: subscriptionData.status,
                  stripeCustomerId: session.customer as string,
                  stripeSubscriptionId: session.subscription as string,
                  stripePriceId: subscriptionData.items.data[0]?.price.id,
                  currentPeriodStart: new Date(subscriptionData.current_period_start * 1000),
                  currentPeriodEnd: new Date(subscriptionData.current_period_end * 1000)
                }
              });
            }
          }
        }
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        // Find the subscription by stripe subscription ID
        const existingSubscription = await prisma.subscription.findUnique({
          where: {
            stripeSubscriptionId: subscription.id
          }
        });
        
        if (existingSubscription) {
          await prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id
            },
            data: {
              status: subscription.status,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              updatedAt: new Date()
            }
          });
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: deletedSubscription.id
          },
          data: {
            status: 'CANCELED',
            updatedAt: new Date()
          }
        });
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
} 