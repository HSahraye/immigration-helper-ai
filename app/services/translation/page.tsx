'use client';

import { ServicePageTemplate } from '@/app/components/ServicePageTemplate';

const steps = [
  {
    title: "Document Upload",
    description: "Securely upload your documents requiring translation through our platform."
  },
  {
    title: "Language Assessment",
    description: "AI analysis of source language and confirmation of target language requirements."
  },
  {
    title: "Professional Translation",
    description: "High-quality translation by certified translators with immigration expertise."
  },
  {
    title: "Quality Review",
    description: "AI-assisted review for accuracy and consistency in translation."
  },
  {
    title: "Certification",
    description: "Preparation of certified translations meeting USCIS requirements."
  },
  {
    title: "Final Verification",
    description: "Final quality check and formatting for submission readiness."
  }
];

const benefits = [
  "Certified translations accepted by USCIS and other agencies",
  "Fast turnaround times for urgent documents",
  "Quality assurance through AI-powered review",
  "Support for multiple language pairs",
  "Competitive pricing with no hidden fees",
  "Secure handling of sensitive documents"
];

export default function TranslationPage() {
  return (
    <ServicePageTemplate
      title="Translation & Review"
      description="Get professional, certified translations of your immigration documents with comprehensive quality review."
      steps={steps}
      benefits={benefits}
      chatPath="/chat/translation"
    />
  );
} 