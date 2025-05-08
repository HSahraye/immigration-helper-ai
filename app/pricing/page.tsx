import { PricingTable } from '@/app/components/PricingTable';

export const metadata = {
  title: 'Pricing | Immigration Helper AI',
  description: 'View our pricing for document preparation, filing services, and immigration assistance.',
};

export default function PricingPage() {
  return (
    <main className="bg-black min-h-screen">
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Immigration Services Pricing</h1>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Affordable immigration and legal document preparation services with transparent pricing
              </p>
            </div>
            
            <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl p-6 md:p-8 mb-10">
              <PricingTable />
            </div>
            
            <div className="bg-blue-900 bg-opacity-30 backdrop-blur-sm rounded-lg border border-white/10 p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">Need a Custom Service?</h2>
              <p className="text-gray-300 mb-5">
                If you need specialized assistance or have questions about our service packages, our team is ready to help.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-white hover:bg-gray-200 text-blue-900 py-3 px-6 rounded-md text-lg font-medium transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 