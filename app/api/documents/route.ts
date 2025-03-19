import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { generateDocument, getUserDocuments, getDocument, updateDocument, deleteDocument, analyzeDocument } from '@/lib/services/documentService';
import { usageService, SubscriptionStatus, UsageType } from '@/lib/services/usageService';

// GET /api/documents - Get all documents for the user
export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const documents = await getUserDocuments(session.user.id);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error getting documents:', error);
    return NextResponse.json({ error: 'Failed to get documents' }, { status: 500 });
  }
}

// POST /api/documents - Create a new document
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check subscription status for document generation
    const subscriptionStatus = await usageService.checkSubscriptionStatus(session.user.id);
    
    // For free users, check document generation limits
    if (subscriptionStatus === SubscriptionStatus.UNPAID) {
      const canGenerate = await usageService.checkResourceAccess(
        session.user.id, 
        UsageType.DOCUMENT_GENERATION,
        3 // Limit of 3 document generations for free users
      );
      
      if (!canGenerate) {
        return NextResponse.json(
          { error: 'Document generation limit reached. Please upgrade your plan.' }, 
          { status: 403 }
        );
      }
    }
    
    const { documentType, title, parameters } = await req.json();
    
    if (!documentType || !title || !parameters) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const documentContent = await generateDocument(
      session.user.id, 
      documentType, 
      title, 
      parameters
    );
    
    // Track document generation usage
    await usageService.trackUsage(session.user.id, UsageType.DOCUMENT_GENERATION);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Document created successfully',
      documentContent 
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create document' 
    }, { status: 500 });
  }
}

// Helper function for document analysis
async function handleDocumentAnalysis(req: NextRequest, session: any) {
  try {
    // Check subscription status for document analysis
    const subscriptionStatus = await usageService.checkSubscriptionStatus(session.user.id);
    
    // For free users, check document analysis limits
    if (subscriptionStatus === SubscriptionStatus.UNPAID) {
      const canAnalyze = await usageService.checkResourceAccess(
        session.user.id, 
        UsageType.DOCUMENT_ANALYSIS,
        2 // Limit of 2 document analyses for free users
      );
      
      if (!canAnalyze) {
        return NextResponse.json(
          { error: 'Document analysis limit reached. Please upgrade your plan.' }, 
          { status: 403 }
        );
      }
    }
    
    const { content } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: 'No document content provided' }, { status: 400 });
    }
    
    const analysis = await analyzeDocument(content);
    
    // Track document analysis usage
    await usageService.trackUsage(session.user.id, UsageType.DOCUMENT_ANALYSIS);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing document:', error);
    return NextResponse.json({ error: 'Failed to analyze document' }, { status: 500 });
  }
} 