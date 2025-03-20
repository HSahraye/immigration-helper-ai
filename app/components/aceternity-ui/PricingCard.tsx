"use client";

import React from 'react';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from './3d-card';

interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  title: string;
  price: string;
  features: PricingFeature[];
  buttonText: string;
  buttonLink: string;
  isPopular?: boolean;
}

export function PricingCard({
  title,
  price,
  features,
  buttonText,
  buttonLink,
  isPopular = false,
}: PricingCardProps) {
  return (
    <CardContainer>
      <CardBody className={`bg-black relative group/card hover:shadow-2xl hover:shadow-white/[0.1] border ${
        isPopular ? 'border-2 border-white' : 'border-white'
      } w-full h-full rounded-lg p-8`}>
        {isPopular && (
          <CardItem
            translateZ="50"
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-sm font-semibold"
          >
            Most Popular
          </CardItem>
        )}
        <CardItem
          translateZ="50"
          className="text-2xl font-semibold mb-4 text-white"
        >
          {title}
        </CardItem>
        <CardItem
          translateZ="60"
          className="text-3xl font-bold mb-6 text-white"
        >
          {price}
        </CardItem>
        <CardItem
          as="ul"
          translateZ="80"
          className="space-y-3 mb-8"
        >
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-white">
              <span className="text-white mr-2">✓</span>
              {feature.text}
            </li>
          ))}
        </CardItem>
        <CardItem
          as={Link}
          href={buttonLink}
          translateZ="100"
          className="block text-center bg-white text-black py-2 px-4 rounded-lg transition-colors hover:bg-gray-200"
        >
          {buttonText}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
} 