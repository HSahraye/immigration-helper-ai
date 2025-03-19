export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Welcome to Immigration Helper AI</h1>
          <p className="text-xl mb-12">Your intelligent assistant for immigration-related questions and document analysis.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#303134] p-6 rounded-lg transform transition-transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">Document Analysis</h2>
            <p className="mb-4">Upload your immigration documents for AI-powered analysis and insights.</p>
            <a href="/documents" className="text-blue-400 hover:text-blue-300">Get Started →</a>
          </div>
          
          <div className="bg-[#303134] p-6 rounded-lg transform transition-transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">AI Chat Assistant</h2>
            <p className="mb-4">Get instant answers to your immigration-related questions.</p>
            <a href="/chat" className="text-blue-400 hover:text-blue-300">Start Chatting →</a>
          </div>
          
          <div className="bg-[#303134] p-6 rounded-lg transform transition-transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">Resource Library</h2>
            <p className="mb-4">Access comprehensive immigration guides and resources.</p>
            <a href="/resources" className="text-blue-400 hover:text-blue-300">Browse Resources →</a>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mt-20 relative">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Free Plan */}
            <div className="bg-[#303134] p-8 rounded-lg border border-gray-700 transform transition-transform hover:scale-105">
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
              <a href="/auth/signin" 
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                Get Started
              </a>
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
              <a href="/subscribe" 
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                Subscribe Now
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#303134] p-8 rounded-lg border border-gray-700 transform transition-transform hover:scale-105">
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
              <a href="/contact" 
                className="block text-center bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 