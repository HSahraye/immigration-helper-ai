"use client";

import React from 'react';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from './aceternity-ui/3d-card';

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  path: string;
}

export function ResourceCard({
  icon,
  title,
  description,
  color,
  path,
}: ResourceCardProps) {
  return (
    <CardContainer>
      <CardBody className="bg-[#303134] relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.1] border border-gray-700 hover:border-blue-500/30 w-full h-full rounded-xl p-6">
        <CardItem
          translateZ="50"
          className={`${color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white shadow-lg transform group-hover/card:scale-110 transition-transform`}
        >
          {icon}
        </CardItem>
        <CardItem
          translateZ="60"
          className="text-xl font-semibold mb-3 text-gray-200"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="80"
          className="text-gray-400"
        >
          {description}
        </CardItem>
        <CardItem
          as={Link}
          href={path}
          translateZ="100"
          className="absolute inset-0 rounded-xl"
          aria-label={title}
        >
          <span className="sr-only">Learn more about {title}</span>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
} 