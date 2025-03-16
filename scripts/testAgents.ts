// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

// Define the immigration topics (matching those in trainAgents.ts)
const IMMIGRATION_TOPICS = [
  'student-visas',
  'permanent-residency',
  'citizenship',
  'family-sponsorship',
  'legal-assistance'
];

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAgent(topic: string): Promise<void> {
  console.log(`\nTesting ${topic} agent...`);
  
  // Check if the agent file exists
  const agentFilePath = path.join(process.cwd(), 'data', 'agents', `${topic}.json`);
  if (!fs.existsSync(agentFilePath)) {
    console.error(`Agent file not found: ${agentFilePath}`);
    return;
  }
  
  // Load the agent file
  const agentData = JSON.parse(fs.readFileSync(agentFilePath, 'utf8'));
  
  // Prepare a test question based on the topic
  let testQuestion = '';
  switch (topic) {
    case 'student-visas':
      testQuestion = 'What are the requirements for an F-1 student visa?';
      break;
    case 'permanent-residency':
      testQuestion = 'How can I apply for a green card through employment?';
      break;
    case 'citizenship':
      testQuestion = 'What are the requirements for naturalization?';
      break;
    case 'family-sponsorship':
      testQuestion = 'How can I sponsor my spouse for a green card?';
      break;
    case 'legal-assistance':
      testQuestion = 'What should I do if I receive a Notice to Appear?';
      break;
    default:
      testQuestion = `Tell me about ${topic.replace(/-/g, ' ')}`;
  }
  
  try {
    // Test the agent with a simple question
    console.log(`Test question: "${testQuestion}"`);
    
    // Create a completion using the agent's instructions
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: agentData.instructions },
        { role: "user", content: testQuestion }
      ],
      max_tokens: 300,
    });
    
    // Display the response
    console.log('Agent response:');
    console.log(completion.choices[0].message.content);
    console.log(`\n${topic} agent test completed successfully.`);
  } catch (error) {
    console.error(`Error testing ${topic} agent:`, error);
  }
}

async function testAllAgents(): Promise<void> {
  console.log('Testing all trained agents...');
  
  // Check if the OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    console.log('Please set your OpenAI API key in the .env file or directly in your environment.');
    process.exit(1);
  }
  
  // Check if the agents directory exists
  const agentsDir = path.join(process.cwd(), 'data', 'agents');
  if (!fs.existsSync(agentsDir)) {
    console.log('Agents directory not found. Creating sample agent files for testing...');
    
    // Create the directory
    fs.mkdirSync(agentsDir, { recursive: true });
    
    // Create sample agent files for testing
    for (const topic of IMMIGRATION_TOPICS) {
      const sampleAgent = {
        instructions: `You are a helpful assistant specializing in ${topic.replace(/-/g, ' ')} immigration matters. Provide accurate, concise, and helpful information to users based on current immigration laws and procedures.`,
        model: "gpt-3.5-turbo",
        created_at: new Date().toISOString()
      };
      
      fs.writeFileSync(
        path.join(agentsDir, `${topic}.json`),
        JSON.stringify(sampleAgent, null, 2)
      );
      
      console.log(`Created sample agent file for ${topic}`);
    }
  }
  
  // Test each agent
  for (const topic of IMMIGRATION_TOPICS) {
    await testAgent(topic);
  }
  
  console.log('\nAll agent tests completed.');
}

// Run the tests
testAllAgents().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 