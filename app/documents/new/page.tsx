import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create Document | Immigration Helper AI',
  description: 'Generate new immigration documents with AI assistance.',
};

export default async function NewDocumentPage() {
  const session = await getAuthSession();

  // Redirect unauthenticated users
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/documents/new');
  }

  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Document</h1>
        <Button asChild variant="outline">
          <Link href="/documents">Back to Documents</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Legal Document</CardTitle>
          <CardDescription>
            Create professional immigration documents with AI assistance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              Document generation is currently in development. Please check back soon for full functionality.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="document-title">Document Title</Label>
            <Input id="document-title" placeholder="Enter a title for your document" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select>
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VISA_APPLICATION">Visa Application</SelectItem>
                <SelectItem value="COVER_LETTER">Cover Letter</SelectItem>
                <SelectItem value="SUPPORT_LETTER">Support Letter</SelectItem>
                <SelectItem value="LEGAL_DOCUMENT">Legal Document</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-content">Content Template</Label>
            <Textarea
              id="document-content"
              placeholder="Your document content will appear here after generation..."
              className="min-h-[200px]"
              readOnly
            />
          </div>

          <Button className="w-full">Generate Document</Button>
        </CardContent>
      </Card>
    </main>
  );
} 