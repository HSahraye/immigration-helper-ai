import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Cancelled - Immigration Helper AI',
  description: 'Your payment has been cancelled.',
};

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-600 mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-xl text-gray-400 mb-8">
              Your payment has been cancelled. No charges have been made.
            </p>
          </div>

          <div className="bg-[#303134] p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Need Help?</h2>
            <div className="space-y-4 text-left mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Common Questions</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Having trouble with payment?</li>
                  <li>• Want to learn more about our plans?</li>
                  <li>• Need to contact support?</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                <p className="text-gray-400">
                  Our support team is here to help you with any questions or concerns.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>

          <div className="space-x-4">
            <Link
              href="/#pricing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              View Plans
            </Link>
            <Link
              href="/resources"
              className="inline-block border border-gray-600 hover:border-blue-500 px-8 py-3 rounded-lg transition-colors"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 