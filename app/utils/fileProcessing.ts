export interface FileValidationResult {
  base64: string;
  type: string;
  name: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SUPPORTED_FILE_TYPES = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'application/pdf': ['pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'text/plain': ['txt'],
  'text/csv': ['csv'],
  'application/json': ['json']
};

export function isFileTypeSupported(type: string): boolean {
  return type in SUPPORTED_FILE_TYPES;
}

export function validateFile(file: File): Promise<FileValidationResult> {
  return new Promise((resolve, reject) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`));
      return;
    }

    // Check file type
    if (!isFileTypeSupported(file.type)) {
      reject(new Error('Unsupported file type. Please upload a JPG, PNG, GIF, PDF, DOCX, TXT, CSV, or JSON file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        base64: base64String,
        type: file.type,
        name: file.name
      });
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

export async function analyzeFile(fileData: FileValidationResult, context?: string) {
  try {
    if (fileData.type.startsWith('image/')) {
      // Handle images with Vision API
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that analyzes files and provides detailed, relevant information about them.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: context || "Please analyze this image and provide relevant insights." },
              {
                type: "image_url",
                image_url: {
                  url: `data:${fileData.type};base64,${fileData.base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });
      return response.choices[0]?.message?.content || "Could not analyze the image.";
    } else {
      // For non-image files, you might want to implement different processing logic
      // For now, we'll return a simple confirmation
      return `File "${fileData.name}" has been received. This file type (${fileData.type}) will be processed accordingly.`;
    }
  } catch (error) {
    console.error('Error analyzing file:', error);
    throw new Error('Failed to analyze file. Please try again.');
  }
} 