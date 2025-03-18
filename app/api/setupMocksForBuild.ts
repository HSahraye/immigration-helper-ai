/**
 * Helper utility to set up mocks during build time
 * This prevents errors during static site generation
 */

// Detect if we're in a build environment
export const isBuildTime = () => {
  return (
    process.env.NODE_ENV === 'production' && 
    typeof window === 'undefined' && 
    !process.env.NETLIFY
  );
};

// Create a mock session for build time
export const getMockSession = () => {
  return {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: 'build-time-user-id',
      name: 'Build Time User',
      email: 'build@example.com',
      image: null
    }
  };
};

// Create a mock OpenAI client for build time
export const getMockOpenAIClient = () => {
  return {
    chat: {
      completions: {
        create: async () => ({
          choices: [
            {
              message: {
                content: 'Build time mock response'
              }
            }
          ]
        })
      }
    }
  };
};

// Define response types
type ResponseMap = {
  [key: string]: any;
  'test-openai': { status: string; message: string };
  'chat': { id: string; message: string; choices: never[] };
  'default': { success: boolean; message: string };
}

// Mock responses for API routes during build time
export const getBuildTimeMockResponse = (endpoint: string) => {
  const responses: ResponseMap = {
    'test-openai': {
      status: 'success',
      message: 'Build time mock OpenAI response'
    },
    'chat': {
      id: 'mock-chat-id',
      message: 'This is a mock chat response for build time.',
      choices: []
    },
    'default': {
      success: true,
      message: 'This is a mock response for build time.'
    }
  };

  return responses[endpoint] || responses.default;
}; 