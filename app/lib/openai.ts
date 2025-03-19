import OpenAI from 'openai';

export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }

  return new OpenAI({
    apiKey,
    baseURL: 'https://api.openai.com/v1', // Explicitly set the base URL
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
    defaultQuery: undefined,
    timeout: 30000, // 30 second timeout
  });
}; 