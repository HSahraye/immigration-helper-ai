"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  children: React.ReactNode;
  className?: string;
  fill?: string;
};

export const Spotlight = ({
  children,
  className = "",
  fill = "white",
}: SpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mousePositionRef.current = { x, y };
      }
    };

    containerRef.current?.addEventListener("mousemove", handleMouseMove);

    return () => {
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMounted]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      {isMounted && (
        <div
          className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePositionRef.current.x}px ${mousePositionRef.current.y}px, ${fill}, transparent 40%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}; 