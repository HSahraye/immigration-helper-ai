'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { analyzeDocument } from '@/lib/services/documentService';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * DocumentAnalyzer component
 * 
 * Allows users to submit documents for AI analysis and get feedback
 */
export default function DocumentAnalyzer() {
  const [documentContent, setDocumentContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!documentContent.trim()) {
      setError('Please enter some document content to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const result = await analyzeDocument(documentContent);
      setAnalysis(result.analysis);
      setSuggestions(result.suggestions);
      setIsSuccess(true);
    } catch (err) {
      console.error('Error analyzing document:', err);
      setError('Failed to analyze document. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Document Analyzer</CardTitle>
          <CardDescription>
            Submit your immigration document for AI analysis to get professional feedback and improvement suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your document content here..."
            className="min-h-[300px]"
            value={documentContent}
            onChange={(e) => setDocumentContent(e.target.value)}
          />
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

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Document Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{analysis}</div>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-800 dark:text-gray-200">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
} 