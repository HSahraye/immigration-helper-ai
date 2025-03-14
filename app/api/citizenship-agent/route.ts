import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant specializing in citizenship applications and requirements. 
You provide accurate, helpful information about:
- Citizenship eligibility requirements
- Application processes and timelines
- Required documentation
- Citizenship test preparation
- Rights and responsibilities of citizens
- Common issues and solutions

Provide clear, concise answers and always maintain a professional and supportive tone.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
    });

    return NextResponse.json({
      message: response.choices[0]?.message?.content || 'No response generated'
    });
  } catch (error) {
    console.error('Error in citizenship agent:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 