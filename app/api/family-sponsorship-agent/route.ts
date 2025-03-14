import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with error handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return new OpenAI({ apiKey });
};

const SYSTEM_PROMPT = `You are a knowledgeable immigration assistant specializing in family sponsorship. Your role is to:
1. Explain family sponsorship eligibility requirements
2. Guide users through the sponsorship application process
3. Clarify which family members can be sponsored
4. Provide information about financial requirements
5. Explain processing times and fees
6. Help with documentation requirements

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

    // Initialize OpenAI with error handling
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI initialization error:', error);
      return NextResponse.json(
        { error: 'Failed to initialize OpenAI client' },
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