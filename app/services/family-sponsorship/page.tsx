'use client';

import { ServicePageTemplate } from '@/app/components/ServicePageTemplate';

const steps = [
  {
    title: "Eligibility Assessment",
    description: "Determine your eligibility to sponsor family members and identify the appropriate visa category."
  },
  {
    title: "Financial Requirements",
    description: "Review and prepare documentation to meet income requirements and financial obligations."
  },
  {
    title: "Petition Preparation",
    description: "Complete Form I-130 and gather supporting documents for your family petition."
  },
  {
    title: "Document Collection",
    description: "Compile required documents including birth certificates, marriage certificates, and proof of relationship."
  },
  {
    title: "Application Review",
    description: "AI-powered review of your complete application package for accuracy and completeness."
  },
  {
    title: "Submission Guidance",
    description: "Get step-by-step guidance on submitting your family sponsorship petition."
  }
];

const benefits = [
  "Comprehensive guidance through the family sponsorship process",
  "Automated eligibility assessment for different family categories",
  "Financial requirement calculation and documentation assistance",
  "Document checklist customized to your situation",
  "Real-time support for application questions",
  "Progress tracking and status updates"
];

export default function FamilySponsorshipPage() {
  return (
    <ServicePageTemplate
      title="Family Sponsorship"
      description="Unite your family in the United States with our comprehensive family sponsorship application assistance."
      steps={steps}
      benefits={benefits}
      chatPath="/chat/family-sponsorship"
    />
  );
} 