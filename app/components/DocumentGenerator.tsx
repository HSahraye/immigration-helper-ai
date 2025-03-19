'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// DocumentType as string literals to match service
type DocumentType = 'VISA_APPLICATION' | 'COVER_LETTER' | 'SUPPORT_LETTER' | 'LEGAL_DOCUMENT' | 'OTHER';

// Template param fields by document type
const TEMPLATE_FIELDS: Record<DocumentType, Array<{ key: string; label: string; type: 'text' | 'textarea' }>> = {
  VISA_APPLICATION: [
    { key: 'RECIPIENT_NAME', label: 'Recipient Name', type: 'text' },
    { key: 'ORGANIZATION_NAME', label: 'Organization Name', type: 'text' },
    { key: 'ADDRESS', label: 'Address', type: 'textarea' },
    { key: 'APPLICANT_NAME', label: 'Applicant Name', type: 'text' },
    { key: 'NATIONALITY', label: 'Nationality', type: 'text' },
    { key: 'PASSPORT_NUMBER', label: 'Passport Number', type: 'text' },
    { key: 'PURPOSE_OF_TRAVEL', label: 'Purpose of Travel', type: 'textarea' },
    { key: 'ARRIVAL_DATE', label: 'Arrival Date', type: 'text' },
    { key: 'DEPARTURE_DATE', label: 'Departure Date', type: 'text' },
    { key: 'ACCOMMODATION_DETAILS', label: 'Accommodation Details', type: 'textarea' },
    { key: 'ADDITIONAL_DOCUMENTS', label: 'Additional Documents', type: 'textarea' },
  ],
  
  COVER_LETTER: [
    { key: 'APPLICANT_NAME', label: 'Applicant Name', type: 'text' },
    { key: 'RECIPIENT_NAME', label: 'Recipient Name', type: 'text' },
    { key: 'RECIPIENT_TITLE', label: 'Recipient Title', type: 'text' },
    { key: 'ORGANIZATION_NAME', label: 'Organization Name', type: 'text' },
    { key: 'ADDRESS', label: 'Address', type: 'textarea' },
    { key: 'PURPOSE_STATEMENT', label: 'Purpose Statement', type: 'textarea' },
    { key: 'BACKGROUND_DETAILS', label: 'Background Details', type: 'textarea' },
    { key: 'IMMIGRATION_INTENT', label: 'Immigration Intent', type: 'textarea' },
    { key: 'SUPPORTING_EVIDENCE', label: 'Supporting Evidence', type: 'textarea' },
    { key: 'CONCLUSION', label: 'Conclusion', type: 'textarea' },
    { key: 'CONTACT_INFORMATION', label: 'Contact Information', type: 'text' },
  ],
  
  SUPPORT_LETTER: [
    { key: 'SUPPORTER_NAME', label: 'Your Name', type: 'text' },
    { key: 'RECIPIENT_NAME', label: 'Recipient Name', type: 'text' },
    { key: 'RECIPIENT_TITLE', label: 'Recipient Title', type: 'text' },
    { key: 'ORGANIZATION_NAME', label: 'Organization Name', type: 'text' },
    { key: 'ADDRESS', label: 'Address', type: 'textarea' },
    { key: 'APPLICANT_NAME', label: 'Applicant Name', type: 'text' },
    { key: 'APPLICATION_TYPE', label: 'Application Type', type: 'text' },
    { key: 'LENGTH_OF_RELATIONSHIP', label: 'Length of Relationship', type: 'text' },
    { key: 'RELATIONSHIP_TYPE', label: 'Relationship Type', type: 'text' },
    { key: 'CHARACTER_REFERENCE', label: 'Character Reference', type: 'textarea' },
    { key: 'RELATIONSHIP_DETAILS', label: 'Relationship Details', type: 'textarea' },
    { key: 'SUPPORT_DETAILS', label: 'Support Details', type: 'textarea' },
    { key: 'SUPPORTER_TITLE/POSITION', label: 'Your Title/Position', type: 'text' },
    { key: 'SUPPORTER_CONTACT', label: 'Your Contact Information', type: 'text' },
  ],
  
  LEGAL_DOCUMENT: [
    { key: 'DOCUMENT_TITLE', label: 'Document Title', type: 'text' },
    { key: 'PARTY_A_NAME', label: 'Party A Full Name', type: 'text' },
    { key: 'PARTY_A_SHORT', label: 'Party A Short Name', type: 'text' },
    { key: 'PARTY_B_NAME', label: 'Party B Full Name', type: 'text' },
    { key: 'PARTY_B_SHORT', label: 'Party B Short Name', type: 'text' },
    { key: 'PURPOSE_STATEMENT', label: 'Purpose Statement', type: 'textarea' },
    { key: 'TERM_1', label: 'Term 1', type: 'textarea' },
    { key: 'TERM_2', label: 'Term 2', type: 'textarea' },
    { key: 'TERM_3', label: 'Term 3', type: 'textarea' },
    { key: 'ADDITIONAL_TERMS', label: 'Additional Terms', type: 'textarea' },
    { key: 'DECLARATION_STATEMENT', label: 'Declaration Statement', type: 'textarea' },
    { key: 'WITNESS_1_NAME', label: 'Witness 1 Name', type: 'text' },
    { key: 'WITNESS_2_NAME', label: 'Witness 2 Name', type: 'text' },
  ],
  
  OTHER: [
    { key: 'DOCUMENT_TITLE', label: 'Document Title', type: 'text' },
    { key: 'NAME', label: 'Your Name', type: 'text' },
    { key: 'CONTACT_INFORMATION', label: 'Contact Information', type: 'text' },
    { key: 'INTRODUCTION_TEXT', label: 'Introduction', type: 'textarea' },
    { key: 'MAIN_CONTENT', label: 'Main Content', type: 'textarea' },
    { key: 'CONCLUSION', label: 'Conclusion', type: 'textarea' },
  ],
};

export default function DocumentGenerator() {
  const router = useRouter();
  const session = useSession();
  
  const [selectedType, setSelectedType] = useState<DocumentType>('VISA_APPLICATION');
  const [title, setTitle] = useState('');
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Update parameters when document type changes
  React.useEffect(() => {
    // Reset parameters when type changes
    const initialParams: Record<string, string> = {};
    TEMPLATE_FIELDS[selectedType].forEach(field => {
      initialParams[field.key] = '';
    });
    setParameters(initialParams);
  }, [selectedType]);

  const handleParamChange = (key: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a document title');
      return;
    }

    // Check if required fields are filled
    const requiredFields = TEMPLATE_FIELDS[selectedType].filter(
      field => !parameters[field.key]?.trim()
    );
    
    if (requiredFields.length > 0) {
      setError(`Please fill in all required fields: ${requiredFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (session.status !== 'authenticated' || !session.data?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType: selectedType,
          title,
          parameters,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate document');
      }

      // Redirect to documents list page
      router.push('/documents');
    } catch (err) {
      console.error('Error generating document:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate document. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while session is loading
  if (session.status === 'loading') {
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
        <p className="text-gray-200 mb-4">Please sign in to generate documents.</p>
        <Button
          onClick={() => router.push('/auth/signin')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Generate Legal Document</CardTitle>
          <CardDescription>
            Create professional immigration documents using AI. Fill in the required information below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="document-title">Document Title</Label>
            <Input
              id="document-title"
              placeholder="Enter a title for your document"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="document-type">Document Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as DocumentType)}
              disabled={isLoading}
            >
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

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Document Details</h3>
            {TEMPLATE_FIELDS[selectedType].map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    placeholder={`Enter ${field.label}`}
                    value={parameters[field.key] || ''}
                    onChange={(e) => handleParamChange(field.key, e.target.value)}
                    className="min-h-[100px]"
                    disabled={isLoading}
                  />
                ) : (
                  <Input
                    id={field.key}
                    placeholder={`Enter ${field.label}`}
                    value={parameters[field.key] || ''}
                    onChange={(e) => handleParamChange(field.key, e.target.value)}
                    disabled={isLoading}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !title.trim()}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Generating...' : 'Generate Document'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 