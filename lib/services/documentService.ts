import OpenAI from 'openai';
import { prisma } from '../prisma';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define document types and statuses as string literals
type DocumentType = 'VISA_APPLICATION' | 'COVER_LETTER' | 'SUPPORT_LETTER' | 'LEGAL_DOCUMENT' | 'OTHER';
type DocumentStatus = 'DRAFT' | 'COMPLETED' | 'ARCHIVED';

// Document templates by type
const DOCUMENT_TEMPLATES: Record<DocumentType | string, string> = {
  VISA_APPLICATION: `# Visa Application Cover Letter

## Applicant Information
- Name: [APPLICANT_NAME]
- Date of Birth: [DOB]
- Nationality: [NATIONALITY]
- Passport Number: [PASSPORT_NUMBER]

## Purpose of Travel
[PURPOSE_OF_TRAVEL]

## Travel Details
- Intended Arrival Date: [ARRIVAL_DATE]
- Intended Departure Date: [DEPARTURE_DATE]
- Accommodation: [ACCOMMODATION_DETAILS]

## Supporting Documents
1. Passport
2. Proof of financial means
3. Travel itinerary
4. Accommodation details
5. [ADDITIONAL_DOCUMENTS]

## Statement
I hereby confirm that the information provided in this application is true and complete. I understand that any false or misleading information may result in the refusal of my visa application.

Sincerely,
[APPLICANT_NAME]
[CURRENT_DATE]
`,

  COVER_LETTER: `# Immigration Cover Letter

[CURRENT_DATE]

[RECIPIENT_NAME]
[RECIPIENT_TITLE]
[ORGANIZATION_NAME]
[ADDRESS]

Dear [RECIPIENT_NAME],

I am writing to [PURPOSE_STATEMENT].

## Background and Qualifications
[BACKGROUND_DETAILS]

## Immigration Intent
[IMMIGRATION_INTENT]

## Supporting Evidence
[SUPPORTING_EVIDENCE]

## Conclusion
[CONCLUSION]

Thank you for your consideration of my application. I look forward to your favorable response.

Sincerely,

[APPLICANT_NAME]
[CONTACT_INFORMATION]
`,

  SUPPORT_LETTER: `# Letter of Support

[CURRENT_DATE]

[RECIPIENT_NAME]
[RECIPIENT_TITLE]
[ORGANIZATION_NAME]
[ADDRESS]

Re: Support for [APPLICANT_NAME]'s [APPLICATION_TYPE]

Dear [RECIPIENT_NAME],

I am writing this letter in support of [APPLICANT_NAME]'s application for [APPLICATION_TYPE]. I have known [APPLICANT_NAME] for [LENGTH_OF_RELATIONSHIP] in my capacity as [RELATIONSHIP_TYPE].

## Character Reference
[CHARACTER_REFERENCE]

## Relationship Details
[RELATIONSHIP_DETAILS]

## Support Statement
[SUPPORT_DETAILS]

I firmly believe that [APPLICANT_NAME] would be an excellent candidate for [APPLICATION_TYPE]. If you require any further information, please do not hesitate to contact me at [CONTACT_INFORMATION].

Sincerely,

[SUPPORTER_NAME]
[SUPPORTER_TITLE/POSITION]
[SUPPORTER_CONTACT]
`,

  LEGAL_DOCUMENT: `# Legal Document

[DOCUMENT_TITLE]

## Parties
- [PARTY_A_NAME], hereinafter referred to as "[PARTY_A_SHORT]"
- [PARTY_B_NAME], hereinafter referred to as "[PARTY_B_SHORT]"

## Purpose
[PURPOSE_STATEMENT]

## Terms and Conditions
1. [TERM_1]
2. [TERM_2]
3. [TERM_3]
4. [ADDITIONAL_TERMS]

## Declaration
[DECLARATION_STATEMENT]

## Signatures

___________________________
[PARTY_A_NAME]
[DATE]

___________________________
[PARTY_B_NAME]
[DATE]

## Witnesses (if applicable)

___________________________
[WITNESS_1_NAME]
[DATE]

___________________________
[WITNESS_2_NAME]
[DATE]
`,

  OTHER: `# [DOCUMENT_TITLE]

[CURRENT_DATE]

## Introduction
[INTRODUCTION_TEXT]

## Main Content
[MAIN_CONTENT]

## Conclusion
[CONCLUSION]

Sincerely,

[NAME]
[CONTACT_INFORMATION]
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
    await saveDocument(userId, documentType, title, enhancedDocument);
    
    return enhancedDocument;
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error('Failed to generate document');
  }
}

/**
 * Save a document to the database
 */
export async function saveDocument(
  userId: string,
  documentType: DocumentType,
  title: string,
  content: string,
  status: DocumentStatus = 'DRAFT'
): Promise<void> {
  try {
    await prisma.document.create({
      data: {
        userId,
        title,
        content,
        type: documentType,
        status,
      },
    });
  } catch (error) {
    console.error('Error saving document:', error);
    throw new Error('Failed to save document');
  }
}

/**
 * Get all documents for a user
 */
export async function getUserDocuments(userId: string) {
  try {
    return await prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error getting user documents:', error);
    throw new Error('Failed to get user documents');
  }
}

/**
 * Get a specific document
 */
export async function getDocument(documentId: string, userId: string) {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    return document;
  } catch (error) {
    console.error('Error getting document:', error);
    throw new Error('Failed to get document');
  }
}

/**
 * Update a document
 */
export async function updateDocument(
  documentId: string,
  userId: string,
  updates: {
    title?: string;
    content?: string;
    status?: DocumentStatus;
  }
) {
  try {
    // Check if document exists and belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });
    
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized');
    }
    
    // Update document
    return await prisma.document.update({
      where: {
        id: documentId,
      },
      data: updates,
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error('Failed to update document');
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string, userId: string): Promise<boolean> {
  try {
    // Check if document exists and belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId,
      },
    });
    
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized');
    }
    
    // Delete document
    await prisma.document.delete({
      where: {
        id: documentId,
      },
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
export async function analyzeDocument(content: string): Promise<{ analysis: string; suggestions: string[] }> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: `You are an expert immigration document analyst. Your task is to analyze the provided document, assess its quality, completeness, and effectiveness for immigration purposes. Provide a thorough analysis and clear, actionable suggestions for improvement.`
        },
        {
          role: "user",
          content: `Please analyze this immigration document and provide feedback:\n\n${content}\n\nProvide: 1) A detailed analysis of the document's strengths and weaknesses, and 2) A numbered list of specific suggestions for improvement.`
        }
      ],
      temperature: 0.5,
    });
    
    const response = completion.choices[0].message.content || '';
    
    // Extract analysis and suggestions
    const analysisPart = response.split('Suggestions:')[0] || response;
    
    // Extract the suggestions as an array
    const suggestionText = response.includes('Suggestions:') 
      ? response.split('Suggestions:')[1] 
      : '';
      
    const suggestions = suggestionText
      .split(/\d+\./)
      .filter(item => item.trim().length > 0)
      .map(item => item.trim());
    
    return {
      analysis: analysisPart.trim(),
      suggestions,
    };
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw new Error('Failed to analyze document');
  }
} 