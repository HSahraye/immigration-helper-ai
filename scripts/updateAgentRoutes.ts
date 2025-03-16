import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { loadTrainingData, Process, QAPair } from '../utils/agentTraining';

// Define the immigration topics and their corresponding API routes
const TOPIC_ROUTES = [
  { topic: 'Visa Applications', route: 'visa-applications-agent' },
  { topic: 'Family Sponsorship', route: 'family-sponsorship-agent' },
  { topic: 'Travel Documents', route: 'travel-documents-agent' },
  { topic: 'Citizenship', route: 'citizenship-agent' },
  { topic: 'Student Visas', route: 'student-visas-agent' },
  { topic: 'Legal Assistance', route: 'legal-assistance-agent' },
  { topic: 'Work Permits', route: 'work-permits-agent' },
  { topic: 'Permanent Residency', route: 'permanent-residency-agent' }
];

// Function to generate a system prompt from training data
function generateSystemPrompt(trainingData: any): string {
  // Extract key information from training data
  const { topic, applicationProcesses, faqs } = trainingData;
  
  // Create a comprehensive system prompt
  let prompt = `You are a knowledgeable immigration assistant specializing in ${topic}. Your role is to:
1. Provide accurate information about ${topic.toLowerCase()}
2. Explain application processes and requirements
3. Help users understand eligibility criteria
4. Guide users through document requirements
5. Answer questions about processing times and fees
6. Provide helpful resources and next steps

You have been trained on comprehensive data including:
- Official government sources and policies
- Detailed application processes
- Frequently asked questions
- Case studies and examples
- Legal resources and assistance options

Always be professional, accurate, and empathetic. If you're unsure about something, say so rather than providing incorrect information.`;

  // Add some specific knowledge examples to the prompt
  if (applicationProcesses && applicationProcesses.length > 0) {
    prompt += `\n\nYou are familiar with these application processes:`;
    applicationProcesses.slice(0, 3).forEach((process: Process) => {
      prompt += `\n- ${process.name}`;
    });
  }
  
  if (faqs && faqs.length > 0) {
    prompt += `\n\nYou can answer questions like:`;
    faqs.slice(0, 5).forEach((faq: QAPair) => {
      prompt += `\n- ${faq.question}`;
    });
  }
  
  return prompt;
}

// Function to update an API route with the fine-tuned model
async function updateApiRoute(topic: string, routeName: string): Promise<void> {
  console.log(`Updating API route for ${topic}...`);
  
  // Load the training data
  const trainingData = await loadTrainingData(topic);
  if (!trainingData) {
    console.error(`No training data found for ${topic}, skipping route update.`);
    return;
  }
  
  // Load the fine-tuning jobs
  const jobsFile = path.join(process.cwd(), 'data', 'fine-tuning-jobs.json');
  if (!fs.existsSync(jobsFile)) {
    console.error('No fine-tuning jobs file found, skipping route update.');
    return;
  }
  
  const jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
  const modelSuffix = jobs[topic] ? `immigration-${topic.toLowerCase().replace(/\s+/g, '-')}` : '';
  
  // Generate the system prompt
  const systemPrompt = generateSystemPrompt(trainingData);
  
  // Create the route file path
  const routeFilePath = path.join(process.cwd(), 'app', 'api', routeName, 'route.ts');
  
  // Check if the route file exists
  if (!fs.existsSync(routeFilePath)) {
    console.error(`Route file not found: ${routeFilePath}`);
    return;
  }
  
  // Read the existing route file
  const existingRouteContent = fs.readFileSync(routeFilePath, 'utf8');
  
  // Create the updated route content
  const updatedRouteContent = `import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = \`${systemPrompt}\`;

export async function POST(request: Request) {
  try {
    // Log the API key (first few characters)
    const apiKeyPreview = process.env.OPENAI_API_KEY?.substring(0, 10) + '...';
    console.log('Using API key starting with:', apiKeyPreview);

    const { message } = await request.json();
    console.log('Received message:', message);

    if (!message) {
      console.log('No message provided');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    console.log('Making request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: ${modelSuffix ? `"ft:gpt-3.5-turbo:${modelSuffix}"` : '"gpt-4"'},
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    console.log('Received response from OpenAI');
    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error: any) {
    // Log detailed error information
    console.error('Detailed error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response?.data
    });

    // Return a more specific error message
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}`;

  // Write the updated route file
  fs.writeFileSync(routeFilePath, updatedRouteContent);
  console.log(`Updated API route for ${topic} successfully.`);
}

// Main function to update all API routes
async function updateAllApiRoutes(): Promise<void> {
  console.log('=== Updating Immigration AI Agent API Routes ===\n');
  
  // Update routes for each topic
  for (const { topic, route } of TOPIC_ROUTES) {
    await updateApiRoute(topic, route);
  }
  
  console.log('\n=== Immigration AI Agent API Routes Updated ===');
}

// Run the update process
updateAllApiRoutes().catch(error => {
  console.error('Error updating API routes:', error);
  process.exit(1);
}); 