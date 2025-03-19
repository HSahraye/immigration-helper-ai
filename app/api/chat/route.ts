import { NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

// Mark this route as dynamic to ensure it's not statically optimized
export const dynamic = 'force-dynamic';

// Set runtime to ensure we run in Node.js environment
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    console.log('Chat API route invoked, environment:', process.env.NODE_ENV);
    
    // Clone the request so we can read the body multiple times if needed
    const clonedReq = req.clone();
    
    // Parse the body and extract messages
    const body = await req.json();
    const messages = body.messages || [];

    if (messages.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize OpenAI with the shared client function
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

    // Use a lower-cost model for project API keys
    const apiKey = process.env.OPENAI_API_KEY || '';
    const model = apiKey.startsWith('sk-proj-') 
      ? "gpt-3.5-turbo" 
      : "gpt-4-turbo-preview";
    
    console.log(`Using model: ${model} for API requests with key type: ${apiKey.startsWith('sk-proj-') ? 'project' : 'standard'}`);

    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(`API response received successfully from model: ${model}`);

    return new NextResponse(JSON.stringify({
      role: completion.choices[0].message.role || 'assistant',
      content: completion.choices[0].message.content || 'I apologize, but I could not generate a response.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat API route:', error);
    
    // Return a more helpful error message for development
    const errorMessage = error.message || 'An error occurred';
    console.error('Full error details:', JSON.stringify(error, null, 2));
    
    const isMockKeyError = errorMessage.includes('invalid_api_key') || 
                           errorMessage.includes('Incorrect API key') ||
                           errorMessage.includes('Authentication error');
    
    if (isMockKeyError) {
      console.log('Using fallback responses due to invalid API key or authentication issues');
      // Generate a fallback response
      return generateFallbackResponse();
    }
    
    return new NextResponse(JSON.stringify({ 
      error: errorMessage,
      env: process.env.NODE_ENV,
      apiKeyExists: !!process.env.OPENAI_API_KEY,
      apiKeyFormat: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 7)}...` : 'none'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Fallback response generator for development
function generateFallbackResponse() {
  // Generate a simple fallback response without trying to parse the request again
  return new NextResponse(JSON.stringify({
    role: 'assistant',
    content: "There was an issue connecting to the AI service. This could be due to an authentication problem with your API key or a temporary service disruption. Please check that your API key is valid and properly configured in your environment variables.",
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
} 