'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, File, FileText, Trash2, PenSquare, Eye } from 'lucide-react';
import { getUserDocuments, deleteDocument } from '@/lib/services/documentService';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// DocumentType and Status as string literals to match service
type DocumentType = 'VISA_APPLICATION' | 'COVER_LETTER' | 'SUPPORT_LETTER' | 'LEGAL_DOCUMENT' | 'OTHER';
type DocumentStatus = 'DRAFT' | 'COMPLETED' | 'ARCHIVED';

interface Document {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentList() {
  const router = useRouter();
  const session = useSession();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  // Fetch documents on load
  useEffect(() => {
    const fetchDocuments = async () => {
      if (session.status === 'loading') return;
      
      if (session.data?.user?.id) {
        try {
          setIsLoading(true);
          const docs = await getUserDocuments(session.data.user.id);
          setDocuments(docs.map(doc => ({
            ...doc,
            createdAt: doc.createdAt.toString(),
            updatedAt: doc.updatedAt.toString(),
          })));
        } catch (err) {
          console.error('Error fetching documents:', err);
          setError('Failed to load documents. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [session.status, session.data]);

  const handleDelete = async () => {
    if (!documentToDelete || !session.data?.user?.id) return;

    try {
      const success = await deleteDocument(documentToDelete, session.data.user.id);
      if (success) {
        setDocuments(documents.filter(doc => doc.id !== documentToDelete));
      } else {
        setError('Failed to delete document');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again later.');
    } finally {
      setIsDeleteOpen(false);
      setDocumentToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDocumentToDelete(id);
    setIsDeleteOpen(true);
  };

  // Show loading state
  if (session.status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (session.status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-200 mb-4">Please sign in to view your documents.</p>
        <button
          onClick={() => router.push('/auth/signin')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Sign In
        </button>
      </div>
    );
  }

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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Button onClick={() => router.push('/documents/new')}>
          Create New Document
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Documents Yet</h3>
            <p className="text-gray-500 mb-6 text-center">
              You haven't created any documents yet. Create your first document to get started.
            </p>
            <Button onClick={() => router.push('/documents/new')}>
              Create Your First Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="truncate">{doc.title}</CardTitle>
                  <Badge variant={statusBadgeVariant[doc.status]}>
                    {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <CardDescription>
                  {documentTypeDisplay[doc.type]} • Updated {new Date(doc.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-4 flex justify-between border-t">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/documents/${doc.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/documents/${doc.id}/edit`)}
                  >
                    <PenSquare className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => confirmDelete(doc.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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