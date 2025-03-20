import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { PageHero } from './components/aceternity-ui/PageHero';
import { FeatureCard } from './components/aceternity-ui/FeatureCard';
import { TestimonialCard } from './components/aceternity-ui/TestimonialCard';
import { PricingCard } from './components/aceternity-ui/PricingCard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <PageHero
        title="Welcome to Immigration Helper AI"
        description="Your intelligent assistant for immigration-related questions and document analysis. Powered by advanced AI to simplify your immigration journey."
      >
        <div className="flex justify-center gap-4">
          <a 
            href="/resources" 
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all hover:bg-gray-200"
          >
            Get Started
          </a>
          <a 
            href="#features" 
            className="border border-white hover:border-gray-300 px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Learn More
          </a>
        </div>
      </PageHero>

      {/* Features Section */}
      <div className="container mx-auto px-4">
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<div className="text-4xl">📄</div>}
            title="Document Analysis"
            description="Upload your immigration documents for AI-powered analysis and insights."
            link="/documents"
            linkText="Get Started"
          />
          
          <FeatureCard
            icon={<div className="text-4xl">💬</div>}
            title="AI Chat Assistant"
            description="Get instant answers to your immigration-related questions."
            link="/chat"
            linkText="Start Chatting"
          />
          
          <FeatureCard
            icon={<div className="text-4xl">📚</div>}
            title="Resource Library"
            description="Access comprehensive guides and resources for various immigration processes."
            link="/resources"
            linkText="Browse Resources"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-black rounded-xl p-12 mb-20 border border-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-white">Documents Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white">AI Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white">Countries Served</div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The AI assistant made my visa application process so much easier. Highly recommended!"
              author="Sarah K."
              role="Student Visa Applicant"
            />
            <TestimonialCard
              quote="Incredible tool for document analysis. Saved me hours of work and stress."
              author="Michael R."
              role="Business Immigration"
            />
            <TestimonialCard
              quote="The resource library is comprehensive and the AI chat support is exceptional."
              author="Lisa M."
              role="Family Sponsorship"
            />
          </div>
        </div>

        {/* Pricing section */}
        <section id="pricing" className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-xl text-white max-w-3xl mx-auto">
                Select the plan that best fits your immigration needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="md:pt-8">
                <PricingCard
                  title="Basic"
                  price="Free"
                  features={[
                    { text: "Basic document analysis" },
                    { text: "Limited chat assistance" },
                    { text: "Access to basic resources" }
                  ]}
                  buttonText="Get Started"
                  buttonLink="/checkout?plan=basic"
                />
              </div>

              <div className="md:-mt-4">
                <PricingCard
                  title="Pro"
                  price="$19.99/month"
                  features={[
                    { text: "Advanced document analysis" },
                    { text: "Unlimited chat assistance" },
                    { text: "Priority support" },
                    { text: "Full resource access" }
                  ]}
                  buttonText="Subscribe Now"
                  buttonLink="/checkout?plan=pro"
                  isPopular={true}
                />
              </div>

              <div className="md:pt-8">
                <PricingCard
                  title="Enterprise"
                  price="Custom"
                  features={[
                    { text: "Custom document analysis" },
                    { text: "Dedicated support team" },
                    { text: "Custom integrations" },
                    { text: "Volume discounts" }
                  ]}
                  buttonText="Contact Sales"
                  buttonLink="/enterprise"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-20 text-center border border-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Immigration Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of successful applicants who have simplified their immigration process with our AI-powered platform.</p>
          <Link 
            href="/checkout?plan=pro" 
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
} 