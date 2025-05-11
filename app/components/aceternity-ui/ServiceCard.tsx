"use client";

import React from "react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "./3d-card";

interface ServiceCardProps {
  title: string;
  description: string;
  path: string;
}

export function ServiceCard({ title, description, path }: ServiceCardProps) {
  return (
    <CardContainer>
      <CardBody className="bg-black relative group/card hover:shadow-2xl hover:shadow-white/[0.1] border border-white/[0.2] w-full h-full rounded-xl p-6">
        <CardItem
          translateZ="60"
          className="text-xl font-bold text-white mb-4"
        >
          {title}
        </CardItem>
        <CardItem
          translateZ="80"
          className="text-white/80 text-sm"
        >
          {description}
        </CardItem>
        <div className="flex justify-between items-center mt-8">
          <CardItem
            as={Link}
            href={path}
            translateZ={20}
            className="px-4 py-2 rounded-xl text-xs font-normal text-white hover:text-white/80"
          >
            Learn More →
          </CardItem>
          <CardItem
            as={Link}
            href={path}
            translateZ={20}
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90"
          >
            Start
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
} 