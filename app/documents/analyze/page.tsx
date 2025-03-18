import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Analyze Document | Immigration Helper AI',
  description: 'Analyze immigration documents with AI for feedback and improvements.',
};

export default async function AnalyzeDocumentPage() {
  const session = await getAuthSession();

  // Redirect unauthenticated users to sign in
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/documents/analyze');
  }

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Analyzer</h1>
        <Button asChild variant="outline">
          <Link href="/documents">Back to Documents</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Document</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Paste your document content below for AI analysis. Get professional feedback and suggestions for improvement.
          </p>
          <div className="space-y-4">
            <Textarea 
              className="min-h-[300px]" 
              placeholder="Paste your document content here..."
            />
            <Button>Analyze Document</Button>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                Document analysis is currently in development. Please check back soon for full functionality.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 