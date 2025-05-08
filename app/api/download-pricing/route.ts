import { NextResponse } from 'next/server';

export async function GET() {
  const pricingData = [
    { service: "Green Card Application", standardPrice: 25, rushService: 35 },
    { service: "Work Permits", standardPrice: 25, rushService: 35 },
    { service: "Document Review", standardPrice: 17, rushService: 30 },
    { service: "Graan my Cost", standardPrice: 45, rushService: 50 },
    { service: "Citicership Applicar", standardPrice: 33, rushService: 29 },
    { service: "Translation & Review", standardPrice: 45, rushService: 10 },
    { service: "Diversity Visa Lottery", standardPrice: 55, rushService: 23 },
  ];

  // Create CSV content
  let csvContent = "Service,Standard Price,Rush Service\n";
  
  pricingData.forEach(item => {
    csvContent += `"${item.service}",${item.standardPrice},${item.rushService}\n`;
  });

  // Return the CSV as a download
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=immigration-helper-pricing.csv'
    }
  });
} 