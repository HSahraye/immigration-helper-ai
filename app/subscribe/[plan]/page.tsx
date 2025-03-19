import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Subscribe - Immigration Helper AI',
  description: 'Choose your subscription plan and get started with Immigration Helper AI.',
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
    ]
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
    ]
  }
};

export default async function SubscribePage({ params }: { params: { plan: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const plan = params.plan.toLowerCase();
  if (!PLANS[plan as keyof typeof PLANS]) {
    redirect('/');
  }

  const selectedPlan = PLANS[plan as keyof typeof PLANS];

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Subscribe to {selectedPlan.name}</h1>
            <p className="text-xl text-gray-400">
              Get started with our {selectedPlan.name.toLowerCase()} plan and unlock powerful immigration tools.
            </p>
          </div>

          <div className="bg-[#303134] p-8 rounded-lg border border-gray-700 mb-8">
            <div className="text-center mb-8">
              <div className="text-3xl font-bold mb-2">{selectedPlan.price}</div>
              {plan === 'pro' && (
                <div className="text-sm text-gray-400">Billed monthly</div>
              )}
            </div>

            <div className="space-y-4 mb-8">
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {plan === 'pro' ? (
              <form className="space-y-6">
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="card">
                        Card Information
                      </label>
                      <input
                        type="text"
                        id="card"
                        placeholder="Card number"
                        className="w-full px-4 py-2 rounded-lg bg-[#202124] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 rounded-lg bg-[#202124] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="CVC"
                          className="w-full px-4 py-2 rounded-lg bg-[#202124] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Subscribe Now
                </button>
              </form>
            ) : (
              <a
                href="/resources"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Get Started
              </a>
            )}
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