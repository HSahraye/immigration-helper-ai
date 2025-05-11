'use client';

import { ServicePageTemplate } from '@/app/components/ServicePageTemplate';

const steps = [
  {
    title: "Document Upload",
    description: "Securely upload your immigration documents through our encrypted platform."
  },
  {
    title: "AI Analysis",
    description: "Our advanced AI system performs a comprehensive analysis of your documents for accuracy and completeness."
  },
  {
    title: "Error Detection",
    description: "Identify potential errors, inconsistencies, or missing information in your documentation."
  },
  {
    title: "Compliance Check",
    description: "Verify that all documents meet current USCIS requirements and guidelines."
  },
  {
    title: "Detailed Report",
    description: "Receive a detailed report with specific recommendations for improvements or corrections."
  },
  {
    title: "Expert Consultation",
    description: "Connect with our AI agent for clarification and guidance on implementing suggested changes."
  }
];

const benefits = [
  "Thorough review of all immigration documents",
  "AI-powered error detection and correction suggestions",
  "Compliance verification with current regulations",
  "Detailed feedback and improvement recommendations",
  "Fast turnaround time for document analysis",
  "Secure and confidential document handling"
];

export default function DocumentReviewPage() {
  return (
    <ServicePageTemplate
      title="Document Review"
      description="Ensure your immigration documents are accurate, complete, and ready for submission with our AI-powered review service."
      steps={steps}
      benefits={benefits}
      chatPath="/chat/document-review"
    />
  );
} 