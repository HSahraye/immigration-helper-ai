import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { CheckoutForm } from '@/app/checkout/checkout-form';

export const metadata: Metadata = {
  title: 'Checkout - Immigration Helper AI',
  description: 'Complete your subscription to Immigration Helper AI.',
};

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

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan: string; test?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  const plan = searchParams.plan?.toLowerCase() || 'basic';
  const isTestMode = searchParams.test === 'true';
  
  if (!PLANS[plan as keyof typeof PLANS]) {
    redirect('/');
  }

  const selectedPlan = PLANS[plan as keyof typeof PLANS];
  const error = searchParams.error;

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Complete Your Order</h1>
            <p className="text-xl text-gray-400">
              You're just one step away from accessing premium immigration tools.
            </p>
            {isTestMode && (
              <div className="mt-4 p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <p className="text-blue-300">
                  ⚠️ You are in test mode. This will create a subscription without payment.
                </p>
              </div>
            )}
            {error === 'email_required' && (
              <div className="mt-4 p-3 bg-red-500 bg-opacity-20 rounded-lg">
                <p className="text-red-300">
                  Please provide your email address to continue.
                </p>
              </div>
            )}
            {error === 'payment_failed' && (
              <div className="mt-4 p-3 bg-red-500 bg-opacity-20 rounded-lg">
                <p className="text-red-300">
                  There was an error processing your payment. Please try again.
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#303134] p-8 rounded-lg border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-semibold">{selectedPlan.name} Plan</h2>
                <p className="text-gray-400">Monthly subscription</p>
              </div>
              <div className="text-2xl font-bold">{selectedPlan.price}</div>
            </div>

            <div className="space-y-4 mb-8">
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <CheckoutForm 
              plan={plan}
              isTestMode={isTestMode} 
              isSignedIn={!!session} 
              buttonText={
                plan === 'basic' ? 'Start Free Plan' : 
                (isTestMode && !session) ? 'Sign In to Create Test Subscription' :
                (isTestMode && session) ? 'Create Test Subscription' : 
                'Proceed to Payment'
              } 
            />
          </div>

          <div className="text-center text-sm text-gray-400">
            By subscribing, you agree to our{' '}
            <a href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 