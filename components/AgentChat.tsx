'use client';

import React, { useState, useRef, useEffect } from 'react';
import FileUpload from './FileUpload';
import { FileValidationResult } from '../app/utils/fileProcessing';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

interface AgentChatProps {
  title: string;
  description?: string;
  endpoint: string;
}

export default function AgentChat({ title, description, endpoint }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (fileData: FileValidationResult) => {
    try {
      setIsFileUploading(true);
      setError(null);
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content: `[Uploading file: ${fileData.name}]` }
      ]);
      
      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: fileData,
          context: `You are an immigration assistant. Please analyze this ${fileData.type} file in the context of ${title} and provide relevant advice or insights. If this is a document like a PDF, please extract and summarize the key information.`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze file');
      }
      
      setMessages(prev => {
        const updatedMessages = [...prev];
        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].content.includes('Uploading file')) {
          updatedMessages[updatedMessages.length - 1] = { 
            role: 'user', 
            content: `[File uploaded: ${fileData.name}]` 
          };
        }
        updatedMessages.push({ role: 'assistant', content: data.analysis });
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error analyzing file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze file';
      setError(errorMessage);
      
      setMessages(prev => {
        const updatedMessages = [...prev];
        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].content.includes('Uploading file')) {
          updatedMessages[updatedMessages.length - 1] = { 
            role: 'user', 
            content: `[File upload attempted: ${fileData.name}]` 
          };
        }
        updatedMessages.push({ role: 'error', content: errorMessage });
        return updatedMessages;
      });
    } finally {
      setIsFileUploading(false);
    }
  };

  const handleFileError = (error: string) => {
    setError(error);
    setMessages(prev => [
      ...prev,
      { role: 'error', content: error }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      setError(errorMessage);
      setMessages(prev => [
        ...prev,
        { role: 'error', content: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto bg-[#202124] text-gray-200 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {description && <p className="text-gray-400">{description}</p>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-900 ml-auto max-w-[80%]'
                : message.role === 'error'
                ? 'bg-red-900 mr-auto max-w-[80%]'
                : 'bg-gray-800 mr-auto max-w-[80%]'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-4 bg-red-900 text-white text-sm">
          {error}
        </div>
      )}

      <div className="p-4 border-t border-gray-700 space-y-4">
        <FileUpload
          onFileSelect={handleFileSelect}
          onError={handleFileError}
          isLoading={isFileUploading}
        />

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            disabled={isLoading || isFileUploading}
          />
          <button
            type="submit"
            disabled={isLoading || isFileUploading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 