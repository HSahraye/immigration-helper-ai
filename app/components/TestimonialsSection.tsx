"use client";

import { AnimatedTestimonials } from "./ui/animated-testimonials";

export function TestimonialsSection({ isStandalone = false }) {
  const testimonials = [
    {
      quote:
        "The immigration assistance I received was life-changing. Their expert guidance made the green card process smooth and stress-free. I'm now happily settled with my family in the US.",
      name: "Maria Rodriguez",
      designation: "Green Card Recipient, Houston TX",
      src: "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?q=80&w=2924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "When my work visa was about to expire, I was desperate for solutions. Their team provided clear options and helped expedite my H-1B extension. Their knowledge of immigration law is exceptional.",
      name: "Raj Patel",
      designation: "Software Engineer, Seattle WA",
      src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "As an international student navigating USCIS requirements, I needed reliable advice. Their document preparation service was thorough and the personalized attention made a complex process manageable.",
      name: "Jin-Soo Park",
      designation: "Graduate Student, Boston MA",
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Their legal document services helped our family business establish proper contracts and agreements. The attention to detail and professional guidance gave us confidence in our legal foundation.",
      name: "Elena Vasquez",
      designation: "Small Business Owner, Miami FL",
      src: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=2889&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "After struggling with my asylum case for years, their expertise changed everything. The compassionate approach and thorough documentation they prepared made a difference in my successful outcome.",
      name: "Ahmed Hassan",
      designation: "Asylum Recipient, Chicago IL",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  
  // If this is a standalone component, wrap it with a section and container
  if (isStandalone) {
    return (
      <section className="bg-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">What Our Clients Say</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Real stories from people we've helped with immigration and legal document services
            </p>
          </div>
          
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </section>
    );
  }
  
  // Otherwise, just return the AnimatedTestimonials component directly
  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
} 