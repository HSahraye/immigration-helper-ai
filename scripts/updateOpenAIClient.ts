import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// The new code pattern to use
const newOpenAIClientCode = `
// Initialize the OpenAI client with error handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return new OpenAI({ apiKey });
};
`;

// The pattern to replace in the POST function
const oldPostFunctionPattern = `
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }`;

const newPostFunctionPattern = `
    // Initialize OpenAI with error handling
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI initialization error:', error);
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }`;

async function updateFiles() {
  try {
    // Find all API route files
    const files = await glob('app/api/**/route.ts');
    
    console.log(`Found ${files.length} API route files to update`);
    
    let updatedCount = 0;
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let updated = false;
      
      // Check if the file has references to 'openai' variable but doesn't initialize it in the POST function
      if (content.includes('getOpenAIClient') && content.includes('await openai.') && !content.includes('let openai;')) {
        console.log(`File ${file} has getOpenAIClient but doesn't initialize openai in the POST function`);
        
        // Replace the POST function to initialize openai
        const postFunctionMatch = content.match(/export async function POST\([^)]*\)\s*{[\s\S]*?try\s*{/);
        if (postFunctionMatch) {
          const postFunctionStart = postFunctionMatch[0];
          const newPostFunction = postFunctionStart + `
    // Initialize OpenAI with error handling
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI initialization error:', error);
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }
`;
          content = content.replace(postFunctionStart, newPostFunction);
          updated = true;
        }
      }
      // Skip files that already have the getOpenAIClient function and properly initialize openai
      else if (content.includes('getOpenAIClient') && content.includes('let openai;')) {
        console.log(`Skipping ${file} - already updated`);
        continue;
      }
      // Replace direct OpenAI initialization
      else if (content.includes('const openai = new OpenAI(')) {
        content = content.replace(
          /const openai = new OpenAI\(\{\s*apiKey: process\.env\.OPENAI_API_KEY,?\s*\}\);/,
          newOpenAIClientCode
        );
        updated = true;
      }
      
      // Replace the check in the POST function
      if (content.includes('if (!process.env.OPENAI_API_KEY)')) {
        content = content.replace(
          oldPostFunctionPattern,
          newPostFunctionPattern
        );
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(file, content);
        updatedCount++;
        console.log(`Updated ${file}`);
      } else {
        console.log(`No changes needed for ${file}`);
      }
    }
    
    console.log(`Updated ${updatedCount} files successfully`);
  } catch (error) {
    console.error('Error updating files:', error);
  }
}

updateFiles(); 