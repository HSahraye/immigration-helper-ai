"use client";

import Link from "next/link";

export default function ManageSubscriptionPage() {
  return (
    <main className="bg-black min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-black bg-opacity-70 backdrop-blur-sm rounded-xl border border-white/10 p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Manage Your Subscription</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Current Subscription</h2>
              <p className="text-gray-300 mb-4">
                You are currently on the <span className="font-semibold">Free Plan</span>.
              </p>
              <div className="mt-6">
                <Link
                  href="/pricing"
                  className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Upgrade Plan
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Billing History</h2>
              <p className="text-gray-300">No billing history available.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 