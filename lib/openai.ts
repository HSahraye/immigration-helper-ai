import OpenAI from 'openai';
import { isBuildTime } from '@/app/api/setupMocksForBuild';

// Check if we're using a mock key
const isMockKey = (key: string) => {
  return key === 'sk_test_mock_key_for_development' || key.includes('mock') || key.includes('your-openai');
};

// Create an OpenAI client with proper error handling
export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not defined in environment variables');
  }
  
  // If we're in build time, return the mock client
  if (isBuildTime()) {
    console.log('Using mock OpenAI client for build time');
    return getMockOpenAIClient();
  }
  
  // If we're using a mock key in development, return the mock client
  if (isMockKey(apiKey)) {
    console.log('Using mock OpenAI client with mock key:', apiKey);
    return getMockOpenAIClient();
  }
  
  // Otherwise return the real client
  return new OpenAI({ apiKey });
}

// Mock OpenAI client with implementations for development
function getMockOpenAIClient() {
  // Create a mock client that responds with predefined messages
  return {
    chat: {
      completions: {
        create: async (params: any) => {
          // Log the request for debugging
          console.log('Mock OpenAI request:', JSON.stringify(params, null, 2));
          
          // Extract the last user message to determine a response
          const lastMessage = params.messages[params.messages.length - 1];
          const userQuery = lastMessage.content;
          
          // Generate a mock response based on the user query
          const content = generateMockResponse(userQuery, params.messages);
          
          // Return a structure matching OpenAI's response format
          return {
            id: 'mock-completion-id',
            object: 'chat.completion',
            created: Date.now(),
            model: params.model,
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: content,
                },
                logprobs: null,
                finish_reason: 'stop',
              },
            ],
            usage: {
              prompt_tokens: 100,
              completion_tokens: 150,
              total_tokens: 250,
            },
          };
        },
      },
    },
  };
}

// Generate a mock response based on the user query
function generateMockResponse(query: string, messages: any[]) {
  // Extract agent type from system prompt if available
  let agentType = 'general';
  for (const msg of messages) {
    if (msg.role === 'system' && msg.content) {
      if (msg.content.includes('visa')) agentType = 'visa';
      else if (msg.content.includes('green card')) agentType = 'green-card';
      else if (msg.content.includes('citizenship')) agentType = 'citizenship';
      else if (msg.content.includes('work permit')) agentType = 'work-permit';
      break;
    }
  }
  
  // Simple keyword matching for different agent types
  if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
    return `Hello! I'm the ${agentType} assistant. How can I help you today?`;
  }
  
  if (query.toLowerCase().includes('visa')) {
    return 'For visa applications, you typically need to demonstrate your eligibility, complete the appropriate forms, pay the application fees, and attend an interview. The specific requirements depend on the type of visa and your country of citizenship.';
  }
  
  if (query.toLowerCase().includes('green card')) {
    return 'Green card applications can be based on family sponsorship, employment, refugee/asylum status, or special programs. The process typically involves filing a petition, waiting for priority date to become current, completing medical exams, and attending an interview.';
  }
  
  if (query.toLowerCase().includes('citizen')) {
    return 'To become a U.S. citizen through naturalization, you generally need to be a permanent resident for 3-5 years, demonstrate good moral character, pass English and civics tests, and take an oath of allegiance.';
  }
  
  if (query.toLowerCase().includes('document')) {
    return "For most immigration processes, you'll need identity documents (passport, birth certificate), financial documents, and sometimes medical records. Specific requirements vary by application type.";
  }
  
  // Default response
  return "I'm a mock AI assistant for development purposes. In production, this would connect to OpenAI for real responses. You asked about: " + query;
} 