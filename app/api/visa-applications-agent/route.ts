import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable immigration assistant specializing in visa applications. Your role is to:
1. Provide accurate information about different types of visas
2. Explain application processes and requirements
3. Help users understand eligibility criteria
4. Guide users through document requirements
5. Answer questions about processing times and fees
6. Provide helpful resources and next steps

Always be professional, accurate, and empathetic. If you're unsure about something, say so rather than providing incorrect information.`;

export async function POST(request: Request) {
  try {
    // Log the API key (first few characters)
    const apiKeyPreview = process.env.OPENAI_API_KEY?.substring(0, 10) + '...';
    console.log('Using API key starting with:', apiKeyPreview);

    const { message } = await request.json();
    console.log('Received message:', message);

    if (!message) {
      console.log('No message provided');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    console.log('Making request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed to a more widely available model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('Received response from OpenAI');
    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error: any) {
    // Log detailed error information
    console.error('Detailed error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response?.data
    });

    // Return a more specific error message
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 