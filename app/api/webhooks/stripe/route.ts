import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// This is your Stripe webhook secret for verifying webhook events
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    // Get the signature from the headers
    const signature = request.headers.get('stripe-signature');
    
    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }
    
    // Get the request body
    const body = await request.text();
    
    // Verify the webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }
    
    // Handle different event types
    switch (event.type) {
      // Subscription created
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
        
      // Subscription updated
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      // Subscription canceled
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
        
      // Payment succeeded
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      // Payment failed
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return a success response
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handler functions for different event types
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Get customer and plan info
  const customerId = subscription.customer as string;
  const planId = subscription.items.data[0]?.plan.id;
  const userId = subscription.metadata.userId;
  
  console.log(`Subscription created: ${subscription.id} for user ${userId} on plan ${planId}`);
  
  // In a real app, you would:
  // 1. Store the subscription details in your database
  // 2. Update the user's subscription status
  // 3. Send a welcome email
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const planId = subscription.items.data[0]?.plan.id;
  const userId = subscription.metadata.userId;
  
  console.log(`Subscription updated: ${subscription.id} for user ${userId} to plan ${planId}`);
  
  // In a real app, you would:
  // 1. Update the subscription details in your database
  // 2. If the plan changed, update the user's access level
  // 3. Send a confirmation email
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const userId = subscription.metadata.userId;
  
  console.log(`Subscription canceled: ${subscription.id} for user ${userId}`);
  
  // In a real app, you would:
  // 1. Update the subscription status in your database
  // 2. Downgrade the user's access level
  // 3. Send a cancellation email
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;
  
  console.log(`Payment succeeded for invoice: ${invoice.id}, subscription: ${subscriptionId}`);
  
  // In a real app, you would:
  // 1. Record the payment in your database
  // 2. Update the subscription's paid-through date
  // 3. Send a receipt email
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;
  
  console.log(`Payment failed for invoice: ${invoice.id}, subscription: ${subscriptionId}`);
  
  // In a real app, you would:
  // 1. Record the failed payment
  // 2. Send an email notification to the customer
  // 3. Take appropriate action based on retry logic
} 