'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuroraBackground } from '../components/ui/aurora-background';
import { BackgroundLines } from '../components/aceternity-ui/BackgroundLines';
import { ResourceCard } from '../components/aceternity-ui/ResourceCard';
import { ServiceCard } from '../components/aceternity-ui/ServiceCard';
import { FolderIcon, UsersIcon, BriefcaseIcon, GraduationCapIcon, HomeIcon, PlaneIcon, ScaleIcon, FileTextIcon } from 'lucide-react';
import { CardBody, CardContainer, CardItem } from '../components/aceternity-ui/3d-card';

const benefits = [
  {
    title: "Lightning Fast",
    description: "Get your documents processed and reviewed in minutes, not days. Our AI works 24/7 to serve you.",
    icon: "⚡"
  },
  {
    title: "Highly Accurate",
    description: "AI-powered analysis ensures precise document preparation with minimal errors and omissions.",
    icon: "🎯"
  },
  {
    title: "Cost-Effective",
    description: "Save money with our transparent pricing. No hidden fees or surprise charges.",
    icon: "💰"
  },
  {
    title: "Legal Review",
    description: "AI-assisted review process ensures compliance with current immigration and legal requirements.",
    icon: "⚖️"
  }
];

const services = [
  {
    title: "Green Card Application",
    description: "Complete guidance and support for your permanent residency application process.",
    path: "/services/green-card"
  },
  {
    title: "Work Permits",
    description: "Expert assistance with work permit applications and employment-based immigration.",
    path: "/services/work-permits"
  },
  {
    title: "Document Review",
    description: "Professional review and analysis of your immigration documents for accuracy and compliance.",
    path: "/services/document-review"
  },
  {
    title: "Family Sponsorship",
    description: "Support for family-based immigration petitions and sponsorship requirements.",
    path: "/services/family-sponsorship"
  },
  {
    title: "Citizenship Application",
    description: "Comprehensive assistance with naturalization and citizenship applications.",
    path: "/services/citizenship"
  },
  {
    title: "Translation & Review",
    description: "Professional translation services for immigration documents with expert review.",
    path: "/services/translation"
  },
  {
    title: "Diversity Visa Lottery",
    description: "Guidance and support for the DV lottery program application process.",
    path: "/services/diversity-visa"
  }
];

const aiAgents = [
  {
    title: "Visa Applications",
    description: "Information about different types of visas and application processes",
    icon: <FolderIcon className="w-6 h-6" />,
    color: "bg-blue-500/[0.2] text-blue-500",
    path: "/resources/visa-applications"
  },
  {
    title: "Citizenship",
    description: "Guide to citizenship application and requirements",
    icon: <UsersIcon className="w-6 h-6" />,
    color: "bg-green-500/[0.2] text-green-500",
    path: "/resources/citizenship"
  },
  {
    title: "Work Permits",
    description: "Work permit applications and employment-based immigration",
    icon: <BriefcaseIcon className="w-6 h-6" />,
    color: "bg-purple-500/[0.2] text-purple-500",
    path: "/resources/work-permits"
  },
  {
    title: "Family Sponsorship",
    description: "Information about sponsoring family members",
    icon: <UsersIcon className="w-6 h-6" />,
    color: "bg-pink-500/[0.2] text-pink-500",
    path: "/resources/family-sponsorship"
  },
  {
    title: "Student Visas",
    description: "Student visa requirements and application process",
    icon: <GraduationCapIcon className="w-6 h-6" />,
    color: "bg-yellow-500/[0.2] text-yellow-500",
    path: "/resources/student-visas"
  },
  {
    title: "Permanent Residency",
    description: "Permanent residency application and requirements",
    icon: <HomeIcon className="w-6 h-6" />,
    color: "bg-red-500/[0.2] text-red-500",
    path: "/resources/permanent-residency"
  },
  {
    title: "Travel Documents",
    description: "Travel document requirements and applications",
    icon: <PlaneIcon className="w-6 h-6" />,
    color: "bg-indigo-500/[0.2] text-indigo-500",
    path: "/resources/travel-documents"
  },
  {
    title: "Legal Assistance",
    description: "Legal resources and immigration lawyer information",
    icon: <ScaleIcon className="w-6 h-6" />,
    color: "bg-orange-500/[0.2] text-orange-500",
    path: "/resources/legal-assistance"
  },
  {
    title: "Document Analysis",
    description: "Upload and analyze your immigration documents",
    icon: <FileTextIcon className="w-6 h-6" />,
    color: "bg-teal-500/[0.2] text-teal-500",
    path: "/documents"
  }
];

export default function LearnMore() {
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">How Zazu Works</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Leveraging cutting-edge AI technology to simplify your immigration and legal document journey.
          </p>
        </motion.div>

        {/* AI Explanation Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-black bg-opacity-50 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Our AI Technology</h2>
          <p className="text-lg text-gray-300 mb-6">
            Zazu's advanced AI system analyzes your documents in real-time, identifying potential issues
            and suggesting improvements. Our technology understands complex legal requirements and
            ensures your documents meet all necessary criteria.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black bg-opacity-50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">Document Analysis</h3>
              <p className="text-gray-300">
                Our AI scans your documents for accuracy, completeness, and compliance with current
                regulations, providing instant feedback and suggestions.
              </p>
            </div>
            <div className="bg-black bg-opacity-50 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold mb-3">Smart Assistance</h3>
              <p className="text-gray-300">
                Get intelligent guidance throughout the process, with AI-powered answers to your
                questions and step-by-step support.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <h2 className="text-3xl font-bold mb-8 text-center">Key Benefits</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <CardContainer>
                <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-white/[0.1] border border-white/[0.2] w-full h-full rounded-xl p-6">
                  <CardItem translateZ="50" className="text-4xl mb-4">
                    {benefit.icon}
                  </CardItem>
                  <CardItem translateZ="60" className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </CardItem>
                  <CardItem translateZ="80" className="text-white/80 text-sm">
                    {benefit.description}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  path={service.path}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Agents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">AI-Powered Agents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiAgents.map((agent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ResourceCard
                  title={agent.title}
                  description={agent.description}
                  icon={agent.icon}
                  color={agent.color}
                  path={agent.path}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/get-started"
            className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 