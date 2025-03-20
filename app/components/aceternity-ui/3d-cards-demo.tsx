"use client";

import React from 'react';
import { FeatureCard } from './FeatureCard';
import { TestimonialCard } from './TestimonialCard';
import { PricingCard } from './PricingCard';
import { ResourceCard } from './ResourceCard';

export function ThreeDCardsDemo() {
  return (
    <div className="py-12 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Feature Cards */}
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-8">Feature Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                title="Easy Process"
                description="Streamlined immigration process with step-by-step guidance and expert support."
                link="/features/process"
                linkText="Learn more"
              />
              <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>}
                title="Global Support"
                description="24/7 assistance available in multiple languages for worldwide accessibility."
                link="/features/support"
                linkText="Explore support"
              />
              <FeatureCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
                title="Secure Process"
                description="Advanced encryption and security measures to protect your sensitive information."
                link="/features/security"
                linkText="View security"
              />
            </div>
          </section>

          {/* Testimonial Cards */}
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-8">Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="The immigration process was so much easier with this platform. Highly recommended!"
                author="Sarah Chen"
                role="Software Engineer"
              />
              <TestimonialCard
                quote="Outstanding support and guidance throughout my visa application journey."
                author="Michael Rodriguez"
                role="Medical Professional"
              />
              <TestimonialCard
                quote="The resources and tools provided made a complex process manageable."
                author="Priya Patel"
                role="Business Owner"
              />
            </div>
          </section>

          {/* Pricing Cards */}
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-8">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="Basic"
                price="$99/month"
                features={[
                  { text: "Document checklist" },
                  { text: "Basic support" },
                  { text: "Email updates" }
                ]}
                buttonText="Get Started"
                buttonLink="/pricing/basic"
              />
              <PricingCard
                title="Professional"
                price="$199/month"
                features={[
                  { text: "All Basic features" },
                  { text: "Priority support" },
                  { text: "Document review" },
                  { text: "Case tracking" }
                ]}
                buttonText="Choose Pro"
                buttonLink="/pricing/pro"
                isPopular={true}
              />
              <PricingCard
                title="Enterprise"
                price="$399/month"
                features={[
                  { text: "All Pro features" },
                  { text: "Dedicated agent" },
                  { text: "Legal consultation" },
                  { text: "Rush processing" }
                ]}
                buttonText="Contact Sales"
                buttonLink="/pricing/enterprise"
              />
            </div>
          </section>

          {/* Resource Cards */}
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-8">Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ResourceCard
                title="Visa Guide"
                description="Comprehensive guide to different visa types and requirements."
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>}
                color="bg-emerald-500/[0.2] text-emerald-500"
                path="/resources/visa-guide"
              />
              <ResourceCard
                title="Document Checklist"
                description="Essential documents needed for your immigration process."
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
                color="bg-blue-500/[0.2] text-blue-500"
                path="/resources/checklist"
              />
              <ResourceCard
                title="FAQ"
                description="Answers to commonly asked immigration questions."
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}
                color="bg-purple-500/[0.2] text-purple-500"
                path="/resources/faq"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}