import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Documents | Immigration Helper AI',
  description: 'Manage your immigration documents, forms, and templates.',
};

export default async function DocumentsPage() {
  const session = await getAuthSession();

  // Redirect unauthenticated users
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/documents');
  }

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Button asChild>
          <Link href="/documents/new">Create New Document</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create professional immigration documents with AI assistance.</p>
            <Button asChild className="w-full">
              <Link href="/documents/new">Generate Document</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Analyze your immigration documents for improvement suggestions.</p>
            <Button asChild className="w-full">
              <Link href="/documents/analyze">Analyze Document</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 