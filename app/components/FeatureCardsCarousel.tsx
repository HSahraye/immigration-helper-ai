"use client";

import React from "react";
import { Carousel, Card } from "@/app/components/ui/apple-cards-carousel";
import Link from "next/link";

export function FeatureCardsCarousel() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-10">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-4xl font-bold text-white font-sans">
        Our Services
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const FeatureContent = ({
  title,
  description,
  bulletPoints,
  link,
  linkText,
  contactLink,
  contactText,
}: {
  title: string;
  description: string;
  bulletPoints?: string[];
  link: string;
  linkText: string;
  contactLink?: string;
  contactText?: string;
}) => {
  return (
    <div className="bg-black/70 dark:bg-neutral-900 p-8 md:p-14 rounded-3xl mb-4 backdrop-blur-sm border border-white/10">
      <div className="text-neutral-100 dark:text-neutral-200 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <p className="mb-6">{description}</p>
        {bulletPoints && (
          <ul className="list-disc pl-6 mb-6 space-y-2">
            {bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={link}
            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
          >
            {linkText}
          </Link>
          {contactLink && contactText && (
            <Link
              href={contactLink}
              className="inline-block bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center"
            >
              {contactText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const data = [
  {
    category: "Immigration Services",
    title: "Immigration Documents",
    src: "https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    content: (
      <FeatureContent
        title="Immigration Documents"
        description="Our expert team assists with all types of immigration documentation to ensure your immigration journey proceeds smoothly."
        bulletPoints={[
          "Green Card Applications",
          "Work Permits",
          "Document Review",
          "Comprehensive Case Filing"
        ]}
        link="/services/immigration-documents"
        linkText="Learn More"
        contactLink="/contact"
        contactText="Contact Us"
      />
    ),
  },
  {
    category: "Legal Services",
    title: "Legal Documents",
    src: "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    content: (
      <FeatureContent
        title="Legal Documents"
        description="Our legal document preparation services help you navigate complex legal requirements with confidence and accuracy."
        bulletPoints={[
          "Power of Attorney",
          "Small Claims",
          "Affidavits"
        ]}
        link="/services/legal-documents"
        linkText="Get Started"
        contactLink="/contact"
        contactText="Contact Us"
      />
    ),
  },
  {
    category: "Translation Services",
    title: "Translation & Review",
    src: "https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    content: (
      <FeatureContent
        title="Translation & Review"
        description="Professional translation services to ensure your important documents meet all international and immigration requirements."
        bulletPoints={[
          "Certified Translations",
          "Diversity Visa Lottery"
        ]}
        link="/services/translation-services"
        linkText="Explore Services"
      />
    ),
  },
  {
    category: "Document Analysis",
    title: "Upload your immigration documents for AI-powered analysis and insights.",
    src: "https://images.pexels.com/photos/6693662/pexels-photo-6693662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    content: (
      <FeatureContent
        title="Document Analysis"
        description="Our AI technology scans your immigration documents and provides detailed analysis, highlighting potential issues and offering guidance on how to address them. Upload your forms, applications, and supporting materials to get instant feedback."
        link="/documents"
        linkText="Get Started"
      />
    ),
  },
  {
    category: "AI Chat Assistant",
    title: "Get instant answers to your immigration-related questions.",
    src: "https://images.pexels.com/photos/2312369/pexels-photo-2312369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    content: (
      <FeatureContent
        title="AI Chat Assistant"
        description="Our AI assistant is available 24/7 to answer your immigration questions. Get accurate information about visa processes, required documents, eligibility criteria, and more. Chat in real-time and receive personalized guidance for your unique situation."
        link="/chat"
        linkText="Start Chatting"
      />
    ),
  },
  {
    category: "Resource Library",
    title: "Access comprehensive guides and resources for various immigration processes.",
    src: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    content: (
      <FeatureContent
        title="Resource Library"
        description="Browse our extensive collection of immigration resources, including step-by-step guides, checklists, sample forms, and country-specific information. Stay updated with the latest immigration policies and requirements to ensure a smooth application process."
        link="/resources"
        linkText="Browse Resources"
      />
    ),
  },
]; 