'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuroraBackground } from './ui/aurora-background';
import { BackgroundLines } from './aceternity-ui/BackgroundLines';
import { CardBody, CardContainer, CardItem } from './aceternity-ui/3d-card';

interface ServiceStep {
  title: string;
  description: string;
}

interface ServicePageProps {
  title: string;
  description: string;
  steps: ServiceStep[];
  chatPath: string;
  benefits?: string[];
}

export function ServicePageTemplate({
  title,
  description,
  steps,
  chatPath,
  benefits = []
}: ServicePageProps) {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CardContainer>
                  <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-white/[0.1] border border-white/[0.2] w-full h-full rounded-xl p-6">
                    <CardItem
                      translateZ="50"
                      className="text-2xl font-bold text-white mb-4"
                    >
                      Step {index + 1}
                    </CardItem>
                    <CardItem
                      translateZ="60"
                      className="text-xl font-semibold text-white mb-2"
                    >
                      {step.title}
                    </CardItem>
                    <CardItem
                      translateZ="80"
                      className="text-white/80 text-sm"
                    >
                      {step.description}
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start space-x-4 bg-white/5 rounded-lg p-6"
                >
                  <div className="text-emerald-500 text-2xl">✓</div>
                  <p className="text-white/80">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link
            href={chatPath}
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Start Your Application
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 