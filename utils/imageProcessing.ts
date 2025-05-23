import OpenAI from 'openai';

// Only initialize OpenAI client on the server side
const getOpenAIClient = () => {
  // Check if we're on the server side
  if (typeof window === 'undefined') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured in environment variables');
    }
    return new OpenAI({ apiKey });
  }
  return null;
};

export async function analyzeImage(imageBase64: string, prompt?: string) {
  try {
    // This function should only be called from the server side
    // We'll return a placeholder message if called from the client side
    if (typeof window !== 'undefined') {
      return "Image analysis is performed on the server side.";
    }
    
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error('OpenAI client could not be initialized');
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that analyzes images and provides detailed, relevant information about them. Focus on providing accurate, helpful insights that are relevant to the context.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt || "Please analyze this image and provide relevant insights." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "Could not analyze the image.";
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
}

export function validateImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please upload an image file (JPG, PNG, etc.).'));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image size should be less than 5MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
} 