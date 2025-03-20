"use client";

import React from 'react';
import { CardBody, CardContainer, CardItem } from './3d-card';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <CardContainer>
      <CardBody className="bg-[#303134] relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.1] border border-gray-700 w-full h-full rounded-lg p-8">
        <CardItem
          translateZ="50"
          className="flex items-center mb-4"
        >
          <div className="text-yellow-400">★★★★★</div>
        </CardItem>
        <CardItem
          as="p"
          translateZ="80"
          className="text-gray-400 mb-4"
        >
          {quote}
        </CardItem>
        <CardItem
          translateZ="100"
          className="font-semibold text-gray-200"
        >
          {author}
        </CardItem>
        <CardItem
          translateZ="100"
          className="text-sm text-gray-500"
        >
          {role}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
} 