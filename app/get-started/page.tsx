'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuroraBackground } from '../components/ui/aurora-background';
import { BackgroundLines } from '../components/aceternity-ui/BackgroundLines';

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up in minutes with just your email. We keep your information secure and private.",
    icon: "👤"
  },
  {
    title: "Select Your Service",
    description: "Choose from our range of immigration and legal document services. Get instant pricing and timelines.",
    icon: "📋"
  },
  {
    title: "Submit Documents",
    description: "Upload your documents securely. Our AI will analyze them and provide instant feedback.",
    icon: "📤"
  },
  {
    title: "Get Expert Review",
    description: "Receive comprehensive review and suggestions from our AI-powered system.",
    icon: "✅"
  }
];

export default function GetStarted() {
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
      <div className="relative z-20 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Get Started with Zazu</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Your journey to simplified immigration and legal document preparation starts here.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-black bg-opacity-50 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-white/40 transition-all"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/auth/signin"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Create Your Account
          </Link>
          <p className="mt-4 text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 