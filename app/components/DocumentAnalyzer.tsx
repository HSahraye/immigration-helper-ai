'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { analyzeDocument } from '@/lib/services/documentService';

/**
 * DocumentAnalyzer component
 * 
 * Allows users to submit documents for AI analysis and get feedback
 */
export default function DocumentAnalyzer() {
  const [documentContent, setDocumentContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!documentContent.trim()) {
      setError('Please enter document content to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsSuccess(false);
    setAnalysis('');

    try {
      const result = await analyzeDocument(documentContent);
      setAnalysis(result);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error analyzing document:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze document');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Document Analysis</CardTitle>
          <CardDescription>
            Analyze your immigration documents for improvement suggestions.
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

          {isSuccess && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Document analysis completed successfully.</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Textarea
              placeholder="Paste your document content here..."
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              className="min-h-[200px]"
              disabled={isLoading}
            />
          </div>

          {analysis && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Analysis Results</h3>
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  {analysis.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAnalyze}
            disabled={isLoading || !documentContent.trim()}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Analyze Document'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 