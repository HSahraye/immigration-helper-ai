import OpenAI from 'openai';
import { prisma } from '../prisma';

// Initialize OpenAI client with error handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in environment variables');
  }
  return new OpenAI({ apiKey });
};

// Define document types and statuses as string literals
type DocumentType = 'VISA_APPLICATION' | 'COVER_LETTER' | 'SUPPORT_LETTER' | 'LEGAL_DOCUMENT' | 'OTHER';
type DocumentStatus = 'DRAFT' | 'COMPLETED' | 'ARCHIVED';

// Document templates
const DOCUMENT_TEMPLATES: Record<DocumentType, string> = {
  VISA_APPLICATION: `
[CURRENT_DATE]

To: [RECIPIENT_NAME]
[ORGANIZATION_NAME]
[ADDRESS]

Subject: Visa Application - [APPLICANT_NAME]

Dear [RECIPIENT_NAME],

I, [APPLICANT_NAME], a citizen of [NATIONALITY], am writing to apply for a visa to [PURPOSE_OF_TRAVEL]. I plan to arrive on [ARRIVAL_DATE] and depart on [DEPARTURE_DATE].

During my stay, I will be residing at:
[ACCOMMODATION_DETAILS]

Additional Documents Attached:
[ADDITIONAL_DOCUMENTS]

I hereby declare that all information provided is true and accurate to the best of my knowledge.

Sincerely,
[APPLICANT_NAME]
Passport Number: [PASSPORT_NUMBER]
  `,
  
  COVER_LETTER: `
[CURRENT_DATE]

[RECIPIENT_NAME]
[RECIPIENT_TITLE]
[ORGANIZATION_NAME]
[ADDRESS]

Dear [RECIPIENT_NAME],

[PURPOSE_STATEMENT]

[BACKGROUND_DETAILS]

[IMMIGRATION_INTENT]

[SUPPORTING_EVIDENCE]

[CONCLUSION]

Sincerely,
[APPLICANT_NAME]
[CONTACT_INFORMATION]
  `,
  
  SUPPORT_LETTER: `
[CURRENT_DATE]

[RECIPIENT_NAME]
[RECIPIENT_TITLE]
[ORGANIZATION_NAME]
[ADDRESS]

Dear [RECIPIENT_NAME],

I, [SUPPORTER_NAME], am writing this letter in support of [APPLICANT_NAME]'s [APPLICATION_TYPE] application.

I have known [APPLICANT_NAME] for [LENGTH_OF_RELATIONSHIP] as [RELATIONSHIP_TYPE]. [CHARACTER_REFERENCE]

[RELATIONSHIP_DETAILS]

[SUPPORT_DETAILS]

Sincerely,
[SUPPORTER_NAME]
[SUPPORTER_TITLE/POSITION]
[SUPPORTER_CONTACT]
  `,
  
  LEGAL_DOCUMENT: `
[DOCUMENT_TITLE]

THIS AGREEMENT is made on [CURRENT_DATE] between:

[PARTY_A_NAME] (hereinafter referred to as "[PARTY_A_SHORT]")
and
[PARTY_B_NAME] (hereinafter referred to as "[PARTY_B_SHORT]")

[PURPOSE_STATEMENT]

1. [TERM_1]

2. [TERM_2]

3. [TERM_3]

[ADDITIONAL_TERMS]

[DECLARATION_STATEMENT]

SIGNED by:

________________________
[PARTY_A_NAME]

________________________
[PARTY_B_NAME]

Witnessed by:

________________________
[WITNESS_1_NAME]

________________________
[WITNESS_2_NAME]
  `,
  
  OTHER: `
[DOCUMENT_TITLE]

[CURRENT_DATE]

[NAME]
[CONTACT_INFORMATION]

[INTRODUCTION_TEXT]

[MAIN_CONTENT]

[CONCLUSION]

Sincerely,
[NAME]
  `,
};

/**
 * Generate a document using AI based on user input
 */
export async function generateDocument(
  userId: string,
  documentType: DocumentType,
  title: string,
  parameters: Record<string, string>,
): Promise<string> {
  try {
    // Get document template
    let template = DOCUMENT_TEMPLATES[documentType] || DOCUMENT_TEMPLATES.OTHER;
    
    // Replace template placeholders with user parameters
    Object.entries(parameters).forEach(([key, value]) => {
      template = template.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });
    
    // Add current date if not provided
    if (template.includes('[CURRENT_DATE]')) {
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      template = template.replace(/\[CURRENT_DATE\]/g, currentDate);
    }
    
    // Initialize OpenAI with error handling
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI initialization error:', error);
      throw new Error('OpenAI API key not configured');
    }
    
    // Use OpenAI to enhance the document
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: `You are an expert immigration document assistant. Your task is to enhance, improve, and complete the provided document template based on the available information. Fill in any missing details with reasonable, professional content. The document should be formal, clear, and adhere to standard immigration document practices.`
        },
        {
          role: "user",
          content: `Please enhance and complete this ${documentType.toString().toLowerCase().replace('_', ' ')} document:\n\n${template}\n\nMake it more professional, formal, and complete. Fill in any missing placeholders with appropriate professional content. Maintain the existing structure but improve the language and add any necessary details.`
        }
      ],
      temperature: 0.5,
    });
    
    // Get the AI-enhanced document
    const enhancedDocument = completion.choices[0].message.content || template;
    
    // Save document to database
    const document = await prisma.document.create({
      data: {
        userId,
        type: documentType,
        title,
        content: enhancedDocument,
        status: 'DRAFT',
      },
    });
    
    return enhancedDocument;
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error('Failed to generate document');
  }
}

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId: string) {
  return prisma.document.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

/**
 * Get a specific document
 */
export async function getDocument(id: string, userId: string) {
  return prisma.document.findFirst({
    where: { id, userId },
  });
}

/**
 * Update a document
 */
export async function updateDocument(id: string, userId: string, data: Partial<{ title: string; content: string; status: DocumentStatus }>) {
  return prisma.document.update({
    where: { id, userId },
    data,
  });
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string, userId: string) {
  try {
    await prisma.document.delete({
      where: { id, userId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

/**
 * Analyze a document using AI
 */
export async function analyzeDocument(content: string): Promise<string> {
  try {
    // Initialize OpenAI with error handling
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (error) {
      console.error('OpenAI initialization error:', error);
      throw new Error('OpenAI API key not configured');
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert immigration document analyzer. Your task is to analyze the provided document and provide detailed feedback on its content, structure, and potential improvements."
        },
        {
          role: "user",
          content: `Please analyze this immigration document and provide detailed feedback:\n\n${content}`
        }
      ],
      temperature: 0.7,
    });
    
    return completion.choices[0].message.content || 'Unable to analyze document.';
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error('Failed to analyze document');
  }
} 