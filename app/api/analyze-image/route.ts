import { NextResponse } from 'next/server';
import { analyzeImage } from '../../../utils/imageProcessing';

export async function POST(req: Request) {
  try {
    const { image, prompt } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const analysis = await analyzeImage(image, prompt);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error in analyze-image route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
} 