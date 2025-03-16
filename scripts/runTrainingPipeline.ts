// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Define the steps in the training pipeline
const PIPELINE_STEPS = [
  {
    name: 'Data Collection and Training',
    script: 'dist/scripts/trainAgents.js',
    description: 'Collecting data and training AI agents for each immigration topic'
  },
  {
    name: 'Testing and Evaluation',
    script: 'dist/scripts/testAgents.js',
    description: 'Testing and evaluating the trained agents with sample queries'
  },
  {
    name: 'API Route Updates',
    script: 'dist/scripts/updateAgentRoutes.js',
    description: 'Updating API routes with the fine-tuned models and system prompts'
  }
];

// Function to run a script using Node.js
async function runScript(scriptPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning script: ${scriptPath}\n`);
    
    const process = spawn('node', [scriptPath], {
      stdio: 'inherit',
      shell: true
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`\nScript ${scriptPath} completed successfully\n`);
        resolve(code);
      } else {
        console.error(`\nScript ${scriptPath} failed with code ${code}\n`);
        reject(new Error(`Script exited with code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      console.error(`\nError running script ${scriptPath}: ${err}\n`);
      reject(err);
    });
  });
}

// Function to create a log entry
function createLogEntry(step: string, status: 'started' | 'completed' | 'failed', error?: any): string {
  return `[${new Date().toISOString()}] ${step} ${status}${error ? `: ${error.message}` : ''}\n`;
}

// Function to append to the log file
function appendToLog(entry: string): void {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, `training-pipeline-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, entry);
}

// Main function to run the training pipeline
async function runTrainingPipeline(): Promise<void> {
  console.log('=== Starting Immigration AI Agent Training Pipeline ===\n');
  appendToLog(createLogEntry('Training Pipeline', 'started'));
  
  // Create the necessary directories
  const dirs = ['data', 'logs', 'scripts', 'dist/scripts', 'dist/utils'];
  for (const dir of dirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
  
  // Run each step in the pipeline
  for (const step of PIPELINE_STEPS) {
    console.log(`\n=== Step: ${step.name} ===`);
    console.log(step.description);
    
    appendToLog(createLogEntry(step.name, 'started'));
    
    try {
      await runScript(step.script);
      appendToLog(createLogEntry(step.name, 'completed'));
    } catch (error) {
      appendToLog(createLogEntry(step.name, 'failed', error));
      console.error(`Error in step ${step.name}:`, error);
      
      // Ask if the user wants to continue
      console.log('\nAn error occurred in the pipeline. Do you want to continue with the next step? (y/n)');
      
      // This is a simple synchronous way to get user input in a script
      // In a real application, you might want to use a proper CLI library
      const response = await new Promise<string>(resolve => {
        process.stdin.once('data', data => {
          resolve(data.toString().trim().toLowerCase());
        });
      });
      
      if (response !== 'y') {
        console.log('\nPipeline execution stopped by user.');
        appendToLog(createLogEntry('Training Pipeline', 'failed', new Error('Stopped by user after step failure')));
        process.exit(1);
      }
    }
  }
  
  console.log('\n=== Immigration AI Agent Training Pipeline Complete ===');
  appendToLog(createLogEntry('Training Pipeline', 'completed'));
  
  console.log('\nNext steps:');
  console.log('1. Review the test results in data/test-results/');
  console.log('2. Check the updated API routes in app/api/');
  console.log('3. Deploy the changes to your production environment');
}

// Run the pipeline
runTrainingPipeline().catch(error => {
  console.error('Unhandled error in training pipeline:', error);
  appendToLog(createLogEntry('Training Pipeline', 'failed', error));
  process.exit(1);
}); 