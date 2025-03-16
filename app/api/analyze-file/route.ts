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

    // Handle images with Vision API
    if (fileData.type.startsWith('image/')) {
      try {
        // Log the image type and size for debugging
        console.log('Processing image:', {
          type: fileData.type,
          size: Math.round(fileData.base64.length * 0.75), // Approximate size in bytes
          name: fileData.name
        });

        // Ensure the base64 string is properly formatted
        const base64Data = fileData.base64.includes('base64,') 
          ? fileData.base64
          : `data:${fileData.type};base64,${fileData.base64}`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system" as const,
              content: "You are an AI assistant that analyzes images and provides detailed, relevant information about them. If you see any text in the image, make sure to mention it. If the image is a document, summarize its content. If it's a photo, describe what you see in detail."
            },
            {
              role: "user" as const,
              content: [
                { 
                  type: "text", 
                  text: context || "Please analyze this image and provide relevant insights." 
                },
                {
                  type: "image_url",
                  image_url: {
                    url: base64Data,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        });

        if (!response.choices[0]?.message?.content) {
          throw new Error('No response content from OpenAI');
        }

        return NextResponse.json({
          analysis: response.choices[0].message.content
        });
      } catch (error: any) {
        // Log detailed error information
        console.error('Error analyzing image:', {
          error: error.message,
          status: error.status,
          type: error.type,
          details: error.response?.data || error.cause,
        });

        // Check for specific error types and provide appropriate messages
        let errorMessage = 'Failed to analyze image. ';
        if (error.message.includes('invalid_api_key')) {
          errorMessage += 'Invalid API key configuration.';
        } else if (error.message.includes('insufficient_quota')) {
          errorMessage += 'API quota exceeded.';
        } else if (error.message.includes('invalid_format')) {
          errorMessage += 'Invalid image format. Please try a different image.';
        } else if (error.message.includes('file_size')) {
          errorMessage += 'Image file size too large. Please try a smaller image.';
        } else {
          errorMessage += 'Please try uploading a different image or contact support.';
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    }
    // Handle PDF files with a different approach
    else if (fileData.type === 'application/pdf') {
      try {
        console.log('Processing PDF:', {
          type: fileData.type,
          size: Math.round(fileData.base64.length * 0.75), // Approximate size in bytes
          name: fileData.name
        });

        // For PDFs, we'll use a text-based approach since GPT-4o doesn't support PDF files directly
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system" as const,
              content: "You are an AI assistant that analyzes documents and provides detailed summaries. You're specialized in immigration documents and forms."
            },
            {
              role: "user" as const,
              content: `I've uploaded a PDF document named "${fileData.name}". ${context || "Please provide information about this type of document and what it might contain in the context of immigration processes. Include details about how to properly fill it out, common mistakes to avoid, and any deadlines or important notes about this document type."}`
            },
          ],
          max_tokens: 800,
        });

        if (!response.choices[0]?.message?.content) {
          throw new Error('No response content from OpenAI');
        }

        return NextResponse.json({
          analysis: response.choices[0].message.content
        });
      } catch (error: any) {
        console.error('Error analyzing PDF:', {
          error: error.message,
          status: error.status,
          type: error.type,
          details: error.response?.data || error.cause,
        });

        let errorMessage = 'Failed to analyze PDF. ';
        if (error.message.includes('invalid_api_key')) {
          errorMessage += 'Invalid API key configuration.';
        } else if (error.message.includes('insufficient_quota')) {
          errorMessage += 'API quota exceeded.';
        } else if (error.message.includes('file_size')) {
          errorMessage += 'PDF file size too large. Please try a smaller file.';
        } else {
          errorMessage += 'Please try uploading a different PDF or contact support.';
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: 500 }
        );
      }
    }

    // For non-image files, use regular chat completion
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