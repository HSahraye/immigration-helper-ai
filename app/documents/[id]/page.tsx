import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileDown, PenSquare } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Document Details | Immigration Helper AI',
  description: 'View and manage your immigration document.',
};

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

interface Params {
  id: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function DocumentDetailsPage({ params }: Props) {
  const { id } = await params;
  const session = await getAuthSession();

  // Redirect unauthenticated users
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/documents/${id}`);
  }

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Details</h1>
        <Button asChild variant="outline">
          <Link href="/documents">Back to Documents</Link>
        </Button>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Document viewing is currently in development. This is a placeholder page. Please check back soon for full functionality.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>Sample Document</CardTitle>
                <Badge>Draft</Badge>
              </div>
              <CardDescription>
                Visa Application • Created March 18, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div className="border p-6 rounded-md bg-white dark:bg-gray-900 overflow-auto max-h-[600px]">
                <h1>Sample Document Content</h1>
                <p>This is a sample document. The actual document content would appear here once the integration with the database is complete.</p>
                <h2>Next Steps</h2>
                <ul>
                  <li>Complete integration with the database</li>
                  <li>Implement document editing</li>
                  <li>Add document download functionality</li>
                </ul>
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
                <h3 className="font-medium mb-2">Document Management</h3>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline">
                    <Link href={`/documents/${id}/edit`}>
                      <PenSquare className="h-4 w-4 mr-2" />
                      Edit Document
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 