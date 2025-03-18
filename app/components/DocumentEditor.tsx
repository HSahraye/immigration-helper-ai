'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { getDocument, updateDocument } from '@/lib/services/documentService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentEditorProps {
  documentId: string;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        const doc = await getDocument(documentId, session.user.id);
        setTitle(doc.title);
        setContent(doc.content);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, session]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    if (!title.trim()) {
      setError('Please enter a document title.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError('');
      
      await updateDocument(documentId, session.user.id, {
        title,
        content,
      });
      
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving document:', err);
      setError('Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Document</h1>
        <Button variant="outline" onClick={() => router.push(`/documents/${documentId}`)}>
          Back to Document
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="mb-6 bg-green-100 dark:bg-green-900 border-green-400">
          <AlertTitle className="text-green-800 dark:text-green-100">Success</AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-100">
            Your document has been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Document Editor</CardTitle>
          <CardDescription>
            Edit your document content below. Use Markdown formatting for better document structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="document-title">Document Title</Label>
            <Input
              id="document-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-content">Document Content (Markdown)</Label>
            <Textarea
              id="document-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter document content using Markdown..."
              className="min-h-[400px] font-mono"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push(`/documents/${documentId}`)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !title.trim()}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Document
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 