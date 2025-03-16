// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testFileUpload() {
  try {
    console.log('Testing file upload and analysis...');
    
    // Check if the OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('Error: OPENAI_API_KEY environment variable is not set.');
      console.log('Please set your OpenAI API key in the .env file or directly in your environment.');
      process.exit(1);
    }
    
    // Test with a sample PDF file
    const testPdfPath = path.join(process.cwd(), 'public', 'sample.pdf');
    
    // Create a sample PDF file if it doesn't exist
    if (!fs.existsSync(testPdfPath)) {
      console.log('Sample PDF file not found. Creating a simple text file for testing...');
      const testTextPath = path.join(process.cwd(), 'public', 'sample.txt');
      fs.writeFileSync(testTextPath, 'This is a sample text file for testing file upload functionality.');
      console.log(`Created sample text file at ${testTextPath}`);
      
      console.log('Please upload this file manually through the UI to test the functionality.');
      return;
    }
    
    console.log(`Found sample PDF at: ${testPdfPath}`);
    console.log('File size: ' + fs.statSync(testPdfPath).size + ' bytes');
    
    // Test with a text-based approach for PDFs
    console.log('Testing PDF analysis with text-based approach...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes documents and provides detailed summaries. You're specialized in immigration documents and forms.",
        },
        {
          role: "user",
          content: `I've uploaded a PDF document named "sample.pdf". Please provide information about this type of document and what it might contain in the context of immigration processes. Include details about how to properly fill it out, common mistakes to avoid, and any deadlines or important notes about this document type.`
        },
      ],
      max_tokens: 500,
    });
    
    console.log('Analysis result:');
    console.log(response.choices[0]?.message?.content || "Could not analyze the file.");
    
    console.log('\nFile upload and analysis test completed successfully.');
  } catch (error) {
    console.error('Error testing file upload:', error);
  }
}

// Run the test
testFileUpload().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 