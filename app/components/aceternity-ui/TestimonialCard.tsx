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
      <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-white/[0.1] border border-white w-full h-full rounded-lg p-8">
        <CardItem
          translateZ="50"
          className="flex items-center mb-4"
        >
          <div className="text-yellow-400">★★★★★</div>
        </CardItem>
        <CardItem
          as="p"
          translateZ="80"
          className="text-white mb-4"
        >
          {quote}
        </CardItem>
        <CardItem
          translateZ="100"
          className="font-semibold text-white"
        >
          {author}
        </CardItem>
        <CardItem
          translateZ="100"
          className="text-sm text-white"
        >
          {role}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
} 