'use client';

import { ServicePageTemplate } from '@/app/components/ServicePageTemplate';

const steps = [
  {
    title: "Eligibility Check",
    description: "Verify your eligibility for the Diversity Visa program based on country of origin and education requirements."
  },
  {
    title: "Application Preparation",
    description: "Complete the DV Lottery entry form with AI guidance to ensure accuracy and compliance."
  },
  {
    title: "Photo Requirements",
    description: "Get assistance with photo preparation meeting strict DV Lottery specifications."
  },
  {
    title: "Document Verification",
    description: "Review and prepare required documents including education certificates and passport."
  },
  {
    title: "Entry Submission",
    description: "Submit your entry during the official registration period with confirmation tracking."
  },
  {
    title: "Status Monitoring",
    description: "Track your entry status and receive guidance if selected in the lottery."
  }
];

const benefits = [
  "Expert guidance through the DV Lottery application process",
  "Photo verification against official requirements",
  "Automated eligibility checking for all applicants",
  "Document preparation assistance",
  "Status checking reminders and updates",
  "Post-selection application support"
];

export default function DiversityVisaPage() {
  return (
    <ServicePageTemplate
      title="Diversity Visa Lottery"
      description="Maximize your chances in the Diversity Visa Lottery with our comprehensive application assistance."
      steps={steps}
      benefits={benefits}
      chatPath="/chat/diversity-visa"
    />
  );
} 