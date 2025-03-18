import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Document | Immigration Helper AI',
  description: 'Edit your immigration document.',
};

export default async function EditDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getAuthSession();

  // Redirect unauthenticated users
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/documents/${params.id}/edit`);
  }

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Document</h1>
        <Button asChild variant="outline">
          <Link href={`/documents/${params.id}`}>Back to Document</Link>
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Document editing is currently in development. This is a placeholder page. Please check back soon for full functionality.
        </AlertDescription>
      </Alert>

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
              defaultValue="Sample Document"
              placeholder="Enter document title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-content">Document Content (Markdown)</Label>
            <Textarea
              id="document-content"
              defaultValue="# Sample Document Content

This is a sample document. The actual document content would appear here once the integration with the database is complete.

## Next Steps

* Complete integration with the database
* Implement document editing
* Add document download functionality"
              placeholder="Enter document content using Markdown..."
              className="min-h-[400px] font-mono"
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save Document</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 