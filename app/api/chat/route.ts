import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize the OpenAI client with error handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return new OpenAI({ apiKey });
};

export async function POST(req: Request) {
  try {
    // Initialize OpenAI with error handling
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI initialization error:', error);
      return new NextResponse(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const messages = body.messages || [];

    if (messages.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return new NextResponse(JSON.stringify({
      role: completion.choices[0].message.role || 'assistant',
      content: completion.choices[0].message.content || 'I apologize, but I could not generate a response.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 