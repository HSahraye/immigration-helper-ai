// This is a Server Component
import React from 'react';
import CategoryClient from './CategoryClient';

// Static definitions needed for generateStaticParams
const categoryTitles = {
  'visa-applications': 'Visa Applications',
  'citizenship': 'Citizenship',
  'work-permits': 'Work Permits',
  'family-sponsorship': 'Family Sponsorship',
  'student-visas': 'Student Visas',
  'permanent-residency': 'Permanent Residency',
  'travel-documents': 'Travel Documents',
  'legal-assistance': 'Legal Assistance',
};

// This function must be in a Server Component
export function generateStaticParams() {
  // Generate pages for all valid categories
  return Object.keys(categoryTitles).map(category => ({
    category,
  }));
}

// This is the main Server Component
export default function CategoryPage({ params }: { params: { category: string } }) {
  return <CategoryClient category={params.category} />;
}
