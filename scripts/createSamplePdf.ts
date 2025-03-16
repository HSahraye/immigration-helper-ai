import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createSamplePdf() {
  try {
    console.log('Creating sample PDF file for testing...');
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Add a page to the document
    const page = pdfDoc.addPage([600, 800]);
    
    // Get the standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Draw text on the page
    page.drawText('Sample PDF for Immigration Helper AI', {
      x: 50,
      y: 750,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('This is a sample PDF file created for testing the file upload', {
      x: 50,
      y: 700,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    
    page.drawText('and analysis functionality of the Immigration Helper AI.', {
      x: 50,
      y: 680,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    
    // Add some sample immigration-related content
    page.drawText('Immigration Document Sample', {
      x: 50,
      y: 620,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });
    
    const content = [
      'Name: John Doe',
      'Date of Birth: January 1, 1980',
      'Country of Origin: Canada',
      'Visa Type: H-1B',
      'Visa Expiration: December 31, 2025',
      'Passport Number: AB123456',
      'Passport Expiration: June 30, 2028',
      'Current Status: Employed',
      'Employer: Tech Company Inc.',
      'Position: Software Engineer',
      'Address: 123 Main St, Anytown, USA',
      'Phone: (555) 123-4567',
      'Email: john.doe@example.com'
    ];
    
    content.forEach((line, index) => {
      page.drawText(line, {
        x: 50,
        y: 580 - (index * 20),
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
    });
    
    // Add a note at the bottom
    page.drawText('This is a sample document for testing purposes only.', {
      x: 50,
      y: 50,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Write the PDF to a file
    const outputPath = path.join(process.cwd(), 'public', 'sample.pdf');
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`Sample PDF created at: ${outputPath}`);
  } catch (error) {
    console.error('Error creating sample PDF:', error);
  }
}

// Run the function
createSamplePdf().catch(console.error); 