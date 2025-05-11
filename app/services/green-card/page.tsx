'use client';

import { ServicePageTemplate } from '@/app/components/ServicePageTemplate';

const steps = [
  {
    title: "Eligibility Check",
    description: "Our AI system evaluates your eligibility for a green card based on your specific situation and available pathways."
  },
  {
    title: "Document Preparation",
    description: "Get assistance gathering and preparing all required documents, forms, and supporting evidence for your application."
  },
  {
    title: "Application Review",
    description: "Our AI performs a comprehensive review of your application to ensure accuracy and completeness before submission."
  },
  {
    title: "Form Filing",
    description: "Receive guidance on properly filing your application, including where to send it and what fees to include."
  },
  {
    title: "Status Tracking",
    description: "Track your application status and receive updates throughout the process."
  },
  {
    title: "Interview Preparation",
    description: "Get prepared for your green card interview with practice questions and tips for success."
  }
];

const benefits = [
  "Expert guidance through every step of the green card application process",
  "AI-powered document review to minimize errors and omissions",
  "Real-time assistance available 24/7",
  "Customized advice based on your specific immigration situation",
  "Comprehensive interview preparation support",
  "Secure document handling and privacy protection"
];

export default function GreenCardPage() {
  return (
    <ServicePageTemplate
      title="Green Card Application"
      description="Streamline your path to permanent residency with our AI-powered guidance and support system."
      steps={steps}
      benefits={benefits}
      chatPath="/chat/green-card"
    />
  );
} 