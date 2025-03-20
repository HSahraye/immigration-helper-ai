"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const MovingBorder = ({
  children,
  duration = 2000,
  bgColor = "transparent",
  borderWidth = 2,
  containerClassName,
  borderRadius = "1rem",
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  bgColor?: string;
  borderWidth?: number;
  containerClassName?: string;
  borderRadius?: string;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <div
      className={cn(
        "relative flex h-fit w-fit overflow-hidden rounded-[--border-radius]",
        containerClassName
      )}
      style={
        {
          "--border-radius": borderRadius,
        } as React.CSSProperties
      }
    >
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, transparent 40%, transparent 60%, hsl(var(--primary)) 100%)`,
        }}
        animate={{
          x: ["0%", "100%"],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{
          background: `linear-gradient(to bottom, hsl(var(--primary)) 0%, transparent 40%, transparent 60%, hsl(var(--primary)) 100%)`,
        }}
        animate={{
          y: ["0%", "100%"],
        }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className={cn(
          "z-10 flex overflow-hidden rounded-[calc(var(--border-radius)-borderWidth)]",
          className
        )}
        style={{
          background: bgColor,
          padding: borderWidth,
          margin: borderWidth,
        }}
        {...otherProps}
      >
        {children}
      </div>
    </div>
  );
}; 