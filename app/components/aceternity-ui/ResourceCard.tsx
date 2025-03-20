"use client";

import React from 'react';
import Link from 'next/link';
import { CardBody, CardContainer, CardItem } from './3d-card';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

export function ResourceCard({
  title,
  description,
  icon,
  color,
  path,
}: ResourceCardProps) {
  return (
    <CardContainer>
      <CardBody className="bg-[#303134] relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border border-gray-700 w-full h-full rounded-lg p-8">
        <CardItem
          translateZ="50"
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
        >
          {icon}
        </CardItem>
        <CardItem
          translateZ="60"
          className="text-xl font-semibold mt-4 mb-2 text-gray-200"
        >
          {title}
        </CardItem>
        <CardItem
          translateZ="80"
          className="text-gray-400 text-sm mb-8"
        >
          {description}
        </CardItem>
        <CardItem
          as={Link}
          href={path}
          translateZ="100"
          className="text-sm text-emerald-500 flex items-center gap-2 hover:text-emerald-400 transition-colors"
        >
          Learn more
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}