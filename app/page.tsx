import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome to Immigration Helper AI
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Your intelligent assistant for immigration-related questions and document analysis. Powered by advanced AI to simplify your immigration journey.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/resources" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Get Started
            </a>
            <a 
              href="#features" 
              className="border border-gray-600 hover:border-blue-500 px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#303134] p-8 rounded-lg transform transition-all hover:scale-105 hover:shadow-xl border border-gray-700">
            <div className="text-blue-400 text-4xl mb-4">📄</div>
            <h2 className="text-2xl font-semibold mb-4">Document Analysis</h2>
            <p className="mb-4 text-gray-400">Upload your immigration documents for AI-powered analysis and insights.</p>
            <Link href="/documents" className="text-blue-400 hover:text-blue-300 flex items-center">
              Get Started <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="bg-[#303134] p-8 rounded-lg transform transition-all hover:scale-105 hover:shadow-xl border border-gray-700">
            <div className="text-blue-400 text-4xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold mb-4">AI Chat Assistant</h2>
            <p className="mb-4 text-gray-400">Get instant answers to your immigration-related questions.</p>
            <Link href="/chat" className="text-blue-400 hover:text-blue-300 flex items-center">
              Start Chatting <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="bg-[#303134] p-8 rounded-lg transform transition-all hover:scale-105 hover:shadow-xl border border-gray-700">
            <div className="text-blue-400 text-4xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold mb-4">Resource Library</h2>
            <p className="mb-4 text-gray-400">Access comprehensive immigration guides and resources.</p>
            <Link href="/resources" className="text-blue-400 hover:text-blue-300 flex items-center">
              Browse Resources <span className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[#303134] rounded-xl p-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-gray-400">Documents Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-400">AI Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-400">Countries Served</div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#303134] p-8 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
              </div>
              <p className="text-gray-400 mb-4">"The AI assistant made my visa application process so much easier. Highly recommended!"</p>
              <div className="font-semibold">Sarah K.</div>
              <div className="text-sm text-gray-500">Student Visa Applicant</div>
            </div>
            <div className="bg-[#303134] p-8 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
              </div>
              <p className="text-gray-400 mb-4">"Incredible tool for document analysis. Saved me hours of work and stress."</p>
              <div className="font-semibold">Michael R.</div>
              <div className="text-sm text-gray-500">Business Immigration</div>
            </div>
            <div className="bg-[#303134] p-8 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">★★★★★</div>
              </div>
              <p className="text-gray-400 mb-4">"The resource library is comprehensive and the AI chat support is exceptional."</p>
              <div className="font-semibold">Lisa M.</div>
              <div className="text-sm text-gray-500">Family Sponsorship</div>
            </div>
          </div>
        </div>

        {/* Pricing section */}
        <section id="pricing" className="py-20 bg-[#202124]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Select the plan that best fits your immigration needs
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <div className="bg-[#303134] p-8 rounded-lg flex-1">
                <h3 className="text-2xl font-semibold mb-4">Basic</h3>
                <p className="text-3xl font-bold mb-6">Free</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic document analysis
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Limited chat assistance
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to basic resources
                  </li>
                </ul>
                <Link href="/checkout?plan=basic" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Get Started
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-[#303134] p-8 rounded-lg border-2 border-blue-500 transform scale-105 relative z-20 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <h3 className="text-2xl font-semibold mb-4">Pro</h3>
                <p className="text-3xl font-bold mb-6">$19.99<span className="text-lg">/month</span></p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Advanced document analysis
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited chat assistance
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Full resource access
                  </li>
                </ul>
                <Link href="/checkout?plan=pro" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Subscribe Now
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-[#303134] p-8 rounded-lg flex-1">
                <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
                <p className="text-3xl font-bold mb-6">Custom</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom document analysis
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Dedicated support team
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Volume discounts
                  </li>
                </ul>
                <Link href="/enterprise" 
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Immigration Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of successful applicants who have simplified their immigration process with our AI-powered platform.</p>
          <Link 
            href="/checkout?plan=pro" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
} 