import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise Solutions - Immigration Helper AI',
  description: 'Custom immigration solutions for enterprises. Get dedicated support, custom integrations, and volume discounts.',
};

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Enterprise Solutions</h1>
            <p className="text-xl text-gray-400">
              Custom immigration solutions designed for your organization's unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-[#303134] p-8 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Why Choose Enterprise?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">✓</span>
                  <div>
                    <strong className="block text-white">Dedicated Support Team</strong>
                    <p className="text-gray-400">Direct access to immigration experts 24/7</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">✓</span>
                  <div>
                    <strong className="block text-white">Custom Integration</strong>
                    <p className="text-gray-400">Seamlessly integrate with your existing systems</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">✓</span>
                  <div>
                    <strong className="block text-white">Volume Discounts</strong>
                    <p className="text-gray-400">Competitive pricing for bulk processing</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3">✓</span>
                  <div>
                    <strong className="block text-white">Advanced Analytics</strong>
                    <p className="text-gray-400">Detailed insights and reporting</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#303134] p-8 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6">Contact Sales</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 rounded-lg bg-[#202124] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 rounded-lg bg-[#202124] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="company">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-2 rounded-lg bg-[#202124] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-[#202124] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Contact Sales
                </button>
              </form>
            </div>
          </div>

          <div className="bg-[#303134] p-8 rounded-lg border border-gray-700 mb-16">
            <h2 className="text-2xl font-semibold mb-6">Enterprise Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Security</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• Enterprise-grade encryption</li>
                  <li>• SOC 2 compliance</li>
                  <li>• Custom data retention</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• 24/7 priority support</li>
                  <li>• Dedicated account manager</li>
                  <li>• Training sessions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Integration</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>• API access</li>
                  <li>• Custom workflows</li>
                  <li>• SSO integration</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8">
              Our team will get back to you within 24 hours to discuss your needs.
            </p>
            <a
              href="mailto:enterprise@immigration-helper.ai"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 