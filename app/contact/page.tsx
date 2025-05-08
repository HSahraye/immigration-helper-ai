"use client";

import { useState } from 'react';
import { AuroraBackground } from '@/app/components/ui/aurora-background';
import { BackgroundLines } from '@/app/components/aceternity-ui/BackgroundLines';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
      
      // Reset submission status after showing success message
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="relative min-h-screen w-full bg-black text-white">
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
      <div className="relative z-20 container mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-xl mb-12 text-center">
            Have questions about our services? Our team is here to help you with your immigration and legal document needs.
          </p>
          
          <div className="bg-black/70 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
                <p className="text-lg">Your message has been sent successfully. We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block mb-2 font-medium">Service Interested In</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="immigration">Immigration Documents</option>
                    <option value="legal">Legal Documents</option>
                    <option value="translation">Translation & Review</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Tell us about your needs..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-300">support@immigrationhelperai.com</p>
            </div>
            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-300">(555) 123-4567</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 