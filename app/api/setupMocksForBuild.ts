/**
 * Helper utility to set up mocks during build time
 * This prevents errors during static site generation
 */

// Detect if we're in a build environment
export const isBuildTime = () => {
  // Check for various build-time indicators
  const isProduction = process.env.NODE_ENV === 'production';
  const isServerSide = typeof window === 'undefined';
  const isVercel = !!process.env.VERCEL;
  const isNetlify = !!process.env.NETLIFY;
  
  // Check for Next.js build time variables - these should only be true during actual builds
  const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build';
  
  // This is more accurate than checking NEXT_RUNTIME, as we want to use the real API
  // in production runtime (not just during build)
  
  // For debugging - this helps us identify why the function is returning true
  if (isServerSide && isNextBuild) {
    console.log('Build time detected with flags:', {
      isProduction,
      isServerSide,
      isVercel,
      isNetlify,
      isNextBuild,
      nextPhase: process.env.NEXT_PHASE
    });
  }
  
  // During local development with `npm run dev`, we don't want to use the mock
  const isLocalDev = process.env.NODE_ENV === 'development';
  
  // If we're in local development and server-side (but not doing a build),
  // we should return false to use the real API
  if (isLocalDev && isServerSide && !isNextBuild) {
    return false;
  }
  
  // In production runtime (not build time), we should use the real API
  if (isProduction && isServerSide && !isNextBuild) {
    console.log('Production runtime detected, using real API');
    return false;
  }
  
  // Only use mocks during the actual build process
  return isServerSide && isNextBuild;
};

// Create a mock session for build time
export const getMockSession = () => {
  // Make sure this is safe to be used during server-side rendering
  // Return null if we're in a client environment to prevent React errors
  if (typeof window !== 'undefined') {
    return null;
  }
  
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