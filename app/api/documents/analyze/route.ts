import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeDocument } from '@/lib/agents/documentAnalyzer';
import { DocumentStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get document from database
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        user: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user owns the document
    if (document.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Analyze document
    const analysis = await analyzeDocument(document);

    // Update document with analysis
    await prisma.document.update({
      where: { id: documentId },
      data: {
        metadata: document.metadata ? {
          ...document.metadata as Record<string, any>,
          analysis,
        } : { analysis },
        status: DocumentStatus.COMPLETED,
      },
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error('Error analyzing document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 