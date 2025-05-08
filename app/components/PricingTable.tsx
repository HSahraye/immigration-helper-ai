"use client";

import Link from 'next/link';

export function PricingTable() {
  const pricingData = [
    { service: "Green Card Application", standardPrice: 25, rushService: 35 },
    { service: "Work Permits", standardPrice: 25, rushService: 35 },
    { service: "Document Review", standardPrice: 17, rushService: 30 },
    { service: "Family Sponsorship", standardPrice: 45, rushService: 50 },
    { service: "Citizenship Application", standardPrice: 33, rushService: 45 },
    { service: "Translation & Review", standardPrice: 45, rushService: 60 },
    { service: "Diversity Visa Lottery", standardPrice: 55, rushService: 75 },
  ];

  return (
    <div className="w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-8">Pricing</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="p-4 text-left text-xl">Services</th>
              <th className="p-4 text-center text-xl">Standard Price</th>
              <th className="p-4 text-center text-xl">Rush Service</th>
            </tr>
          </thead>
          <tbody>
            {pricingData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-900 bg-opacity-50" : "bg-gray-800 bg-opacity-50"}>
                <td className="p-4 text-left border-t border-gray-700 text-lg font-medium text-white">
                  {item.service}
                </td>
                <td className="p-4 text-center border-t border-gray-700 text-lg font-medium text-white">
                  ${item.standardPrice}
                </td>
                <td className="p-4 text-center border-t border-gray-700 text-lg font-medium text-white">
                  ${item.rushService}+
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-gray-400 text-sm mt-2 italic">* The "+" indicates prices may vary depending on complexity and urgency.</p>
      </div>
      
      <div className="mt-8 flex justify-center">
        <a
          href="/api/download-pricing"
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md text-lg font-medium transition-colors"
          download
        >
          Download Pricing Sheet
        </a>
      </div>
    </div>
  );
} 