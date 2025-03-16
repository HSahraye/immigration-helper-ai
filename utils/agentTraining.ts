// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the structure for our training data
export interface TrainingData {
  topic: string;
  officialSources: Source[];
  applicationProcesses: Process[];
  faqs: QAPair[];
  caseStudies: CaseStudy[];
  legalResources: Resource[];
  updatedAt: string;
}

export interface Source {
  name: string;
  url: string;
  description: string;
  lastUpdated?: string;
}

export interface Process {
  name: string;
  steps: Step[];
  requirements: string[];
  timeframe: string;
  fees: string;
  notes?: string;
}

export interface Step {
  order: number;
  description: string;
  tips?: string;
}

export interface QAPair {
  question: string;
  answer: string;
  category: string;
  sources?: Source[];
}

export interface CaseStudy {
  title: string;
  scenario: string;
  outcome: string;
  keyLessons: string[];
}

export interface Resource {
  name: string;
  type: 'Organization' | 'Document' | 'Website' | 'Contact';
  description: string;
  url?: string;
  contact?: string;
}

// Interface for training examples
interface TrainingExample {
  messages: {
    role: string;
    content: string;
  }[];
}

// Function to save training data to a JSON file
export async function saveTrainingData(topic: string, data: TrainingData): Promise<void> {
  const dataDir = path.join(process.cwd(), 'data');
  
  // Create the data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  const filePath = path.join(dataDir, `${topic.toLowerCase().replace(/\s+/g, '-')}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Function to load training data from a JSON file
export async function loadTrainingData(topic: string): Promise<TrainingData | null> {
  const filePath = path.join(process.cwd(), 'data', `${topic.toLowerCase().replace(/\s+/g, '-')}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data) as TrainingData;
}

// Function to create a fine-tuned model for a specific topic
export async function createFineTunedModel(topic: string, trainingData: TrainingData): Promise<string> {
  try {
    // Convert training data to OpenAI fine-tuning format
    const trainingExamples = convertToFineTuningFormat(trainingData);
    
    // Create a temporary file with the training examples
    const tempFilePath = path.join(process.cwd(), 'data', `${topic.toLowerCase().replace(/\s+/g, '-')}-training.jsonl`);
    fs.writeFileSync(tempFilePath, trainingExamples.map(example => JSON.stringify(example)).join('\n'));
    
    // Upload the file to OpenAI
    const file = await openai.files.create({
      file: fs.createReadStream(tempFilePath),
      purpose: 'fine-tune',
    });
    
    // Create a fine-tuning job
    const fineTuningJob = await openai.fineTuning.jobs.create({
      training_file: file.id,
      model: 'gpt-3.5-turbo',
      suffix: `immigration-${topic.toLowerCase().replace(/\s+/g, '-')}`,
    });
    
    // Return the fine-tuning job ID
    return fineTuningJob.id;
  } catch (error) {
    console.error('Error creating fine-tuned model:', error);
    throw error;
  }
}

// Helper function to convert training data to OpenAI fine-tuning format
function convertToFineTuningFormat(trainingData: TrainingData): TrainingExample[] {
  const examples: TrainingExample[] = [];
  
  // Convert FAQs to training examples
  for (const faq of trainingData.faqs) {
    examples.push({
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable immigration assistant specializing in ${trainingData.topic}. Provide accurate, helpful, and empathetic responses.`
        },
        {
          role: 'user',
          content: faq.question
        },
        {
          role: 'assistant',
          content: faq.answer
        }
      ]
    });
  }
  
  // Convert application processes to training examples
  for (const process of trainingData.applicationProcesses) {
    examples.push({
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable immigration assistant specializing in ${trainingData.topic}. Provide accurate, helpful, and empathetic responses.`
        },
        {
          role: 'user',
          content: `Can you explain the ${process.name} process?`
        },
        {
          role: 'assistant',
          content: `Here's a guide to the ${process.name} process:\n\n${process.steps.map(step => `${step.order}. ${step.description}${step.tips ? ` (Tip: ${step.tips})` : ''}`).join('\n\n')}\n\nRequirements:\n${process.requirements.map(req => `- ${req}`).join('\n')}\n\nTimeframe: ${process.timeframe}\nFees: ${process.fees}${process.notes ? `\n\nAdditional notes: ${process.notes}` : ''}`
        }
      ]
    });
  }
  
  // Convert case studies to training examples
  for (const caseStudy of trainingData.caseStudies) {
    examples.push({
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable immigration assistant specializing in ${trainingData.topic}. Provide accurate, helpful, and empathetic responses.`
        },
        {
          role: 'user',
          content: `Can you share a case study or example related to ${caseStudy.title}?`
        },
        {
          role: 'assistant',
          content: `Case Study: ${caseStudy.title}\n\nScenario: ${caseStudy.scenario}\n\nOutcome: ${caseStudy.outcome}\n\nKey Lessons:\n${caseStudy.keyLessons.map(lesson => `- ${lesson}`).join('\n')}`
        }
      ]
    });
  }
  
  return examples;
}

// Function to check the status of a fine-tuning job
export async function checkFineTuningStatus(jobId: string): Promise<any> {
  try {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    return job;
  } catch (error) {
    console.error('Error checking fine-tuning status:', error);
    throw error;
  }
}

// Function to validate training data for completeness and quality
export function validateTrainingData(data: TrainingData): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for minimum requirements
  if (!data.officialSources || data.officialSources.length < 3) {
    issues.push('Insufficient official sources (minimum 3 required)');
  }
  
  if (!data.applicationProcesses || data.applicationProcesses.length < 1) {
    issues.push('At least one application process is required');
  }
  
  if (!data.faqs || data.faqs.length < 10) {
    issues.push('Insufficient FAQs (minimum 10 required)');
  }
  
  // Check for data quality
  data.faqs?.forEach((faq, index) => {
    if (faq.answer.length < 50) {
      issues.push(`FAQ #${index + 1} has an answer that is too short (minimum 50 characters)`);
    }
  });
  
  data.applicationProcesses?.forEach((process, index) => {
    if (!process.steps || process.steps.length < 3) {
      issues.push(`Process #${index + 1} (${process.name}) has insufficient steps (minimum 3 required)`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
} 