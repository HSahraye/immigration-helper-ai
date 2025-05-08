"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PricingCard } from './aceternity-ui/PricingCard';
import { AuroraBackground } from './ui/aurora-background';
import { BackgroundLines } from './aceternity-ui/BackgroundLines';
import { FeatureCardsCarousel } from './FeatureCardsCarousel';
import { TestimonialsSection } from './TestimonialsSection';

export function HomeContent() {
  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <AuroraBackground className="opacity-100">
          <div></div>
        </AuroraBackground>
      </div>
      
      <BackgroundLines className="absolute inset-0 z-10">
        <div></div>
      </BackgroundLines>
      
      {/* Content Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen w-full relative z-20"
      >
        {/* Hero Section */}
        <div className="pt-24 pb-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Fast. Accurate. Affordable</h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Legal Document Prep.</h2>
            <p className="text-xl md:text-2xl mb-8">
              Helping you prepare immigration and legal documents with confidence and speed.
            </p>
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
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="mb-20">
          <FeatureCardsCarousel />
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-12 mb-20 border border-white">
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
          <div className="mb-20 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="text-center pt-10 pb-4">
              <h2 className="text-3xl font-bold text-white">What Our Clients Say</h2>
              <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto px-4">
                Real stories from people we've helped with immigration and legal document services
              </p>
            </div>
            <TestimonialsSection />
          </div>

          {/* Pricing section */}
          <section id="pricing" className="py-20 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Affordable Pricing</h2>
                <p className="text-xl text-white max-w-3xl mx-auto mb-8">
                  Transparent pricing for all your immigration and legal document needs
                </p>
                
                <div className="max-w-3xl mx-auto bg-black bg-opacity-70 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 shadow-lg">
                  <div className="bg-blue-800 text-white p-4">
                    <h3 className="text-2xl font-bold">Our Services</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6 text-white">
                      <div className="font-bold text-left">Service</div>
                      <div className="font-bold text-center">Standard</div>
                      <div className="font-bold text-center">Rush</div>
                      
                      <div className="text-left">Green Card Applification</div>
                      <div className="text-center">$25</div>
                      <div className="text-center">+35</div>
                      
                      <div className="text-left">Work Permits</div>
                      <div className="text-center">$25</div>
                      <div className="text-center">+35</div>
                      
                      <div className="text-left">Document Review</div>
                      <div className="text-center">$17</div>
                      <div className="text-center">+30</div>
                      
                      <div className="text-left">Citicership Applicar</div>
                      <div className="text-center">$33</div>
                      <div className="text-center">+29</div>
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Link 
                        href="/pricing" 
                        className="bg-blue-800 hover:bg-blue-900 text-white py-3 px-8 rounded-md text-lg font-medium transition-colors inline-block"
                      >
                        View Full Pricing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="mt-20 mb-12 text-center bg-black bg-opacity-50 backdrop-blur-sm border border-white rounded-xl p-12">
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
      </motion.div>
    </div>
  );
} 