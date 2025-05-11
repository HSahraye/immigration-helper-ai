'use client';

import { ServicePageTemplate } from '@/app/components/ServicePageTemplate';

const steps = [
  {
    title: "Permit Type Selection",
    description: "Identify the most suitable work permit type based on your qualifications and employment situation."
  },
  {
    title: "Employer Verification",
    description: "Verify employer requirements and gather necessary documentation for sponsorship."
  },
  {
    title: "Documentation Assembly",
    description: "Compile all required forms, supporting documents, and evidence of qualifications."
  },
  {
    title: "Application Preparation",
    description: "Complete your work permit application with AI-guided assistance to ensure accuracy."
  },
  {
    title: "Compliance Check",
    description: "Review all materials for compliance with current immigration regulations."
  },
  {
    title: "Submission Support",
    description: "Get guidance on proper submission procedures and timeline expectations."
  }
];

const benefits = [
  "Tailored guidance for different work permit categories",
  "Automated document checklist generation",
  "Real-time updates on application status",
  "Expert assistance with employer documentation",
  "Compliance verification for all submissions",
  "Expedited processing support when available"
];

export default function WorkPermitsPage() {
  return (
    <ServicePageTemplate
      title="Work Permits"
      description="Secure your right to work in the United States with our comprehensive work permit application assistance."
      steps={steps}
      benefits={benefits}
      chatPath="/chat/work-permits"
    />
  );
} 