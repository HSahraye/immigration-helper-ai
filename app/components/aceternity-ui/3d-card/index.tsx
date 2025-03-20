"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, useRef, useState } from "react";

const MouseEnterContext = createContext<{
  mouseX: number;
  mouseY: number;
}>({
  mouseX: 0,
  mouseY: 0,
});

export const CardContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  return (
    <div
      className={cn("relative group/card", className)}
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <MouseEnterContext.Provider value={{ mouseX, mouseY }}>
        {children}
      </MouseEnterContext.Provider>
    </div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { mouseX, mouseY } = useContext(MouseEnterContext);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (mouseY - centerY) / 20;
    const rotateY = (centerX - mouseX) / 20;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("w-full h-full transition-transform duration-200 ease-out", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Component = "div",
  children,
  className,
  translateZ = 0,
  ...rest
}: {
  as?: any;
  children: React.ReactNode;
  className?: string;
  translateZ?: number | string;
  [key: string]: any;
}) => {
  return (
    <Component
      className={cn("", className)}
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}; 