import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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