import { TestimonialsSection } from "@/app/components/TestimonialsSection";

export const metadata = {
  title: "Testimonials | Immigration Helper AI",
  description: "Hear from our clients about their immigration and legal document experiences",
};

export default function TestimonialsPage() {
  return (
    <main className="bg-black min-h-screen">
      <section className="py-12 md:py-16 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Client Testimonials</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Success stories from people we've helped with immigration and legal document services
          </p>
        </div>
      </section>
      
      <TestimonialsSection isStandalone={true} />
    </main>
  );
} 