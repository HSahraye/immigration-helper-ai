import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { getDocument, updateDocument, deleteDocument } from '@/lib/services/documentService';
import { generateStaticParams } from '../../route-config';

// Export the generateStaticParams function for static export compatibility
export { generateStaticParams };

// GET /api/documents/[id] - Get a specific document
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const document = await getDocument(params.id, session.user.id);
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error getting document:', error);
    return NextResponse.json({ error: 'Failed to get document' }, { status: 500 });
  }
}

// PATCH /api/documents/[id] - Update a document
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const updates = await req.json();
    
    // Validate updates
    if (!updates || (updates.title === undefined && updates.content === undefined && updates.status === undefined)) {
      return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 });
    }
    
    const updatedDocument = await updateDocument(params.id, session.user.id, updates);
    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const success = await deleteDocument(params.id, session.user.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
} 