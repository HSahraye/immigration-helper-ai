import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable immigration assistant specializing in legal assistance. Your role is to:
1. Explain immigration legal processes and procedures
2. Provide information about legal rights and obligations
3. Guide users on finding legal representation
4. Help understand appeal processes
5. Explain documentation requirements for legal proceedings
6. Assist with understanding legal terminology

Important: Always include a disclaimer that you are not a lawyer and cannot provide legal advice. Recommend consulting with a qualified immigration lawyer for specific legal advice.

Always be professional, accurate, and empathetic. If you're unsure about something, say so rather than providing incorrect information.`;

export async function POST(request: Request) {
  try {
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
      model: "gpt-3.5-turbo",
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
    console.error('Detailed error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response?.data
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 