import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { isBuildTime, getMockOpenAIClient, getBuildTimeMockResponse } from '../setupMocksForBuild';

export const runtime = 'nodejs';

// Initialize the OpenAI client with error handling
const getOpenAIClient = () => {
  // Return mock during build time
  if (isBuildTime()) {
    console.log('Build time detected, returning mock OpenAI client');
    return getMockOpenAIClient() as unknown as OpenAI;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return new OpenAI({ apiKey });
};

export async function GET() {
  try {
    console.log('Test route: Checking OpenAI configuration');
    
    // For build time, return mock data
    if (isBuildTime()) {
      console.log('Build time detected, returning mock response');
      return NextResponse.json({
        success: true,
        message: "Test successful (mock response for build)",
        isMock: true
      });
    }
    
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 8));

    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "test successful"' }],
    });

    return NextResponse.json({
      success: true,
      message: response.choices[0]?.message?.content,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 8)
    });
  } catch (error) {
    console.error('Test route error:', error);
    
    // If we're in build time and still hit an error, return a success response with mock data
    if (isBuildTime()) {
      return NextResponse.json({
        success: true,
        message: "Test successful (mock response for build after error)",
        isMock: true
      });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.name : undefined,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 8)
    }, { status: 500 });
  }
} 