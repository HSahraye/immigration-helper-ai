'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Trash2, PenSquare, FileDown, Share2, AlertCircle } from 'lucide-react';
import { getDocument, deleteDocument, updateDocument } from '@/lib/services/documentService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

// DocumentType and Status as string literals to match service
type DocumentType = 'VISA_APPLICATION' | 'COVER_LETTER' | 'SUPPORT_LETTER' | 'LEGAL_DOCUMENT' | 'OTHER';
type DocumentStatus = 'DRAFT' | 'COMPLETED' | 'ARCHIVED';

interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

interface DocumentDetailsProps {
  documentId: string;
}

export default function DocumentDetails({ documentId }: DocumentDetailsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        const doc = await getDocument(documentId, session.user.id);
        setDocument(doc);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, session]);

  const handleDelete = async () => {
    if (!document || !session?.user?.id) return;

    try {
      const success = await deleteDocument(document.id, session.user.id);
      if (success) {
        router.push('/documents');
      } else {
        setError('Failed to delete document');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const confirmDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleStatusChange = async (status: DocumentStatus) => {
    if (!document || !session?.user?.id) return;

    try {
      const updatedDoc = await updateDocument(document.id, session.user.id, { status });
      setDocument(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error('Error updating document status:', err);
      setError('Failed to update document status');
    }
  };

  const downloadDocument = () => {
    if (!document) return;
    
    const element = document.createElement('a');
    const file = new Blob([document.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${document.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Document type display names
  const documentTypeDisplay = {
    VISA_APPLICATION: 'Visa Application',
    COVER_LETTER: 'Cover Letter',
    SUPPORT_LETTER: 'Support Letter',
    LEGAL_DOCUMENT: 'Legal Document',
    OTHER: 'Other Document',
  };

  // Status badge styling
  const statusBadgeVariant: Record<DocumentStatus, 'default' | 'outline' | 'secondary' | 'destructive'> = {
    DRAFT: 'outline',
    COMPLETED: 'default',
    ARCHIVED: 'secondary',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Document Not Found</AlertTitle>
        <AlertDescription>
          The document could not be found or you don't have permission to access it.
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.push('/documents')}>
              Return to Documents
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold truncate">{document.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/documents')}>
            Back to Documents
          </Button>
          <Button variant="outline" onClick={downloadDocument}>
            <FileDown className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>Document Content</CardTitle>
                <Badge variant={statusBadgeVariant[document.status]}>
                  {document.status.charAt(0) + document.status.slice(1).toLowerCase()}
                </Badge>
              </div>
              <CardDescription>
                {documentTypeDisplay[document.type]} • Created {new Date(document.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div className="border p-6 rounded-md bg-white dark:bg-gray-900 overflow-auto max-h-[600px]">
                <ReactMarkdown>{document.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Actions</CardTitle>
              <CardDescription>
                Manage your document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Change Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    variant={document.status === 'DRAFT' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('DRAFT')}
                  >
                    Draft
                  </Button>
                  <Button 
                    size="sm"
                    variant={document.status === 'COMPLETED' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('COMPLETED')}
                  >
                    Completed
                  </Button>
                  <Button 
                    size="sm"
                    variant={document.status === 'ARCHIVED' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange('ARCHIVED')}
                  >
                    Archived
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Document Management</h3>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/documents/${document.id}/edit`)}
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    Edit Document
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/documents/${document.id}/analyze`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Analyze Document
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={confirmDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 