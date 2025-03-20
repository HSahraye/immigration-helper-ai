"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const GlowingCard = ({
  children,
  className,
  containerClassName,
  glowClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowClassName?: string;
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-full bg-background rounded-3xl p-px",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          glowClassName
        )}
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, hsl(var(--primary) / 0.2), transparent 40%)`,
        }}
      />

      {/* Main content */}
      <div
        className={cn(
          "relative h-full w-full rounded-3xl bg-background p-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}; 