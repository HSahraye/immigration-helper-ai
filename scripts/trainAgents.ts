// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { collectDataForTopic, updateTrainingData } from '../utils/dataCollection';
import { loadTrainingData, saveTrainingData, createFineTunedModel, validateTrainingData, TrainingData } from '../utils/agentTraining';

// Define the immigration topics
const IMMIGRATION_TOPICS = [
  'Visa Applications',
  'Family Sponsorship',
  'Travel Documents',
  'Citizenship',
  'Student Visas',
  'Legal Assistance',
  'Work Permits',
  'Permanent Residency'
];

// Function to train an agent for a specific topic
async function trainAgentForTopic(topic: string): Promise<void> {
  console.log(`\n=== Training agent for ${topic} ===\n`);
  
  // Check if we already have training data for this topic
  let trainingData = await loadTrainingData(topic);
  
  if (trainingData) {
    console.log(`Found existing training data for ${topic}, updating...`);
    trainingData = await updateTrainingData(trainingData);
  } else {
    console.log(`No existing training data for ${topic}, collecting new data...`);
    trainingData = await collectDataForTopic(topic);
  }
  
  // Validate the training data
  const validation = validateTrainingData(trainingData);
  if (!validation.valid) {
    console.error(`Training data for ${topic} is invalid:`);
    validation.issues.forEach(issue => console.error(`- ${issue}`));
    console.log('Attempting to fix issues by collecting more data...');
    
    // Try to collect more data to fix the issues
    const additionalData = await collectDataForTopic(topic, ['Australia', 'EU']);
    
    // Merge the additional data
    trainingData = {
      ...trainingData,
      officialSources: [...trainingData.officialSources, ...additionalData.officialSources],
      applicationProcesses: [...trainingData.applicationProcesses, ...additionalData.applicationProcesses],
      faqs: [...trainingData.faqs, ...additionalData.faqs],
      caseStudies: [...trainingData.caseStudies, ...additionalData.caseStudies],
      legalResources: [...trainingData.legalResources, ...additionalData.legalResources],
    };
    
    // Validate again
    const revalidation = validateTrainingData(trainingData);
    if (!revalidation.valid) {
      console.error(`Still unable to fix all issues with ${topic} training data:`);
      revalidation.issues.forEach(issue => console.error(`- ${issue}`));
      console.error('Skipping fine-tuning for this topic.');
      
      // Save the data anyway for manual review
      await saveTrainingData(topic, trainingData);
      return;
    }
  }
  
  // Save the training data
  await saveTrainingData(topic, trainingData);
  console.log(`Training data for ${topic} saved successfully.`);
  
  // Create a fine-tuned model
  console.log(`Creating fine-tuned model for ${topic}...`);
  try {
    const jobId = await createFineTunedModel(topic, trainingData);
    console.log(`Fine-tuning job created for ${topic} with ID: ${jobId}`);
    
    // Save the job ID for later reference
    const jobsFile = path.join(process.cwd(), 'data', 'fine-tuning-jobs.json');
    let jobs: Record<string, string> = {};
    
    if (fs.existsSync(jobsFile)) {
      jobs = JSON.parse(fs.readFileSync(jobsFile, 'utf8'));
    }
    
    jobs[topic] = jobId;
    fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2));
    
    console.log(`Fine-tuning job ID for ${topic} saved to data/fine-tuning-jobs.json`);
  } catch (error) {
    console.error(`Error creating fine-tuned model for ${topic}:`, error);
  }
}

// Main function to train all agents
async function trainAllAgents(): Promise<void> {
  console.log('=== Starting Immigration AI Agent Training ===\n');
  
  // Create the data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  
  // Train agents for each topic
  for (const topic of IMMIGRATION_TOPICS) {
    await trainAgentForTopic(topic);
  }
  
  console.log('\n=== Immigration AI Agent Training Complete ===');
}

// Run the training process
trainAllAgents().catch(error => {
  console.error('Error training agents:', error);
  process.exit(1);
}); 