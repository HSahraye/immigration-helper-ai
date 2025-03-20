"use client";

import React from 'react';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from './3d-card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

export function FeatureCard({ icon, title, description, link, linkText }: FeatureCardProps) {
  return (
    <CardContainer>
      <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-white/[0.1] border border-white w-full h-full rounded-lg p-8">
        <CardItem
          translateZ="50"
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/[0.2] text-white"
        >
          {icon}
        </CardItem>
        <CardItem
          translateZ="60"
          className="text-xl font-semibold mt-4 mb-2 text-white"
        >
          {title}
        </CardItem>
        <CardItem
          translateZ="80"
          className="text-white text-sm mb-4"
        >
          {description}
        </CardItem>
        <CardItem
          as={Link}
          href={link}
          translateZ="100"
          className="text-white hover:text-gray-300 flex items-center group-hover:translate-x-2 transition-transform text-sm"
        >
          {linkText} <span className="ml-2">→</span>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}