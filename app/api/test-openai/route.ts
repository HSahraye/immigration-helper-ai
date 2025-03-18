import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Skip OpenAI operations during static site generation
const isBuildTime = () => {
  return process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.NETLIFY;
};

// Initialize the OpenAI client with error handling
const getOpenAIClient = () => {
  // Return mock during build time
  if (isBuildTime()) {
    console.log('Build time detected, returning mock OpenAI client');
    return {
      chat: {
        completions: {
          create: async () => ({ choices: [{ message: { content: 'Build time mock response' } }] })
        }
      }
    } as unknown as OpenAI;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return new OpenAI({ apiKey });
};

export async function GET() {
  try {
    // Skip actual API calls during build time
    if (isBuildTime()) {
      return NextResponse.json({
        status: 'success',
        message: 'Build time mock response'
      });
    }

    // Initialize OpenAI with error handling
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI initialization error:', error);
      return NextResponse.json({
        status: 'error',
        message: 'OpenAI API key is not configured',
      }, { status: 500 });
    }

    // Try a simple completion to verify the API key
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
    });

    return NextResponse.json({
      status: 'success',
      message: 'OpenAI API key is valid and working'
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to verify OpenAI API key',
    }, { status: 500 });
  }
} 