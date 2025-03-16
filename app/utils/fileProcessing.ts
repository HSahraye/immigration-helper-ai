import OpenAI from 'openai';

export interface FileValidationResult {
  base64: string;
  type: string;
  name: string;
}

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

// Client-side function
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
      const result = reader.result as string;
      // For images and PDFs, we want to keep the full data URL
      const base64String = file.type.startsWith('image/') || file.type === 'application/pdf'
        ? result 
        : result.split(',')[1];
      
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

// This function should only be called from the server side
export async function analyzeFile(fileData: FileValidationResult, context?: string) {
  try {
    // We don't need to analyze files on the client side
    // This function will be called from the API route
    return `File "${fileData.name}" has been received and will be analyzed on the server.`;
  } catch (error) {
    console.error('Error analyzing file:', error);
    throw new Error('Failed to analyze file. Please try again.');
  }
} 