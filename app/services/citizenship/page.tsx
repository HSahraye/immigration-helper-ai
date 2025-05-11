'use client';

import { ServicePageTemplate } from '@/app/components/ServicePageTemplate';

const steps = [
  {
    title: "Eligibility Check",
    description: "Verify your eligibility for naturalization based on residency, age, and other requirements."
  },
  {
    title: "Application Preparation",
    description: "Complete Form N-400 with AI-guided assistance to ensure accuracy and completeness."
  },
  {
    title: "Document Collection",
    description: "Gather required documents including green card, tax returns, and travel history."
  },
  {
    title: "Civics Test Preparation",
    description: "Access comprehensive study materials and practice tests for the citizenship exam."
  },
  {
    title: "Interview Training",
    description: "Prepare for your citizenship interview with practice questions and mock interviews."
  },
  {
    title: "Oath Ceremony Guidance",
    description: "Receive information about the naturalization oath ceremony and final steps."
  }
];

const benefits = [
  "Step-by-step guidance through the naturalization process",
  "Comprehensive citizenship test preparation materials",
  "Interview preparation and practice sessions",
  "Document checklist and organization assistance",
  "Timeline tracking and status updates",
  "Post-approval support and guidance"
];

export default function CitizenshipPage() {
  return (
    <ServicePageTemplate
      title="Citizenship Application"
      description="Take the final step toward becoming a U.S. citizen with our comprehensive naturalization assistance."
      steps={steps}
      benefits={benefits}
      chatPath="/chat/citizenship"
    />
  );
} 