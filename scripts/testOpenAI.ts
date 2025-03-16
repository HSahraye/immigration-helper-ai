// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  console.log('Testing OpenAI API connection...');
  
  try {
    // Log the API key (first few characters)
    const apiKeyPreview = process.env.OPENAI_API_KEY?.substring(0, 5) + '...' + process.env.OPENAI_API_KEY?.substring(process.env.OPENAI_API_KEY.length - 5);
    console.log('Using API key: ', apiKeyPreview);
    
    // Make a simple request to the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, are you working?' }
      ],
      max_tokens: 50
    });
    
    console.log('OpenAI API response:');
    console.log(completion.choices[0].message.content);
    console.log('\nOpenAI API connection successful!');
  } catch (error) {
    console.error('Error connecting to OpenAI API:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testOpenAI().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 