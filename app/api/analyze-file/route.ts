import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { FileValidationResult } from '../../utils/fileProcessing';

// Initialize OpenAI with error handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return new OpenAI({ apiKey });
};

export async function POST(req: Request) {
  try {
    const { file, context } = await req.json();

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileData: FileValidationResult = {
      base64: file.base64,
      type: file.type,
      name: file.name
    };

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

    // Create the messages array for the chat completion
    const messages = [
      {
        role: 'system' as const,
        content: 'You are a helpful assistant analyzing files and documents.'
      },
      {
        role: 'user' as const,
        content: `Please analyze this ${fileData.type} file named "${fileData.name}". ${context || ''}`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({
      analysis: completion.choices[0].message.content
    });
  } catch (error: any) {
    console.error('Error in analyze-file route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze file' },
      { status: 500 }
    );
  }
} 