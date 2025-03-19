'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChatLimit } from '../contexts/ChatLimitContext';
import ChatLimitWarning from './ChatLimitWarning';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
  details?: {
    type?: string;
    code?: string;
  };
}

interface AgentChatProps {
  title: string;
  description?: string;
  endpoint: string;
}

export default function AgentChat({ endpoint, title, description }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isLimitReached, incrementChatCount } = useChatLimit();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isLimitReached) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to get response');
      }

      // Add assistant message to chat
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      incrementChatCount();
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request';
      
      // Add error message to chat with any additional details
      setMessages((prev) => [...prev, { 
        role: 'error', 
        content: errorMessage,
        details: {
          type: error instanceof Error ? error.name : undefined,
          code: (error as any)?.code
        }
      }]);
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#202124]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <ChatLimitWarning />
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {description && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
              )}
            </div>

            <div className="h-[calc(100vh-24rem)] overflow-y-auto mb-6 rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white ml-auto max-w-[80%]'
                      : message.role === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 max-w-[80%]'
                  }`}
                >
                  <div>{message.content}</div>
                  {message.role === 'error' && message.details && (
                    <div className="mt-2 text-sm opacity-75">
                      {message.details.type && <div>Type: {message.details.type}</div>}
                      {message.details.code && <div>Code: {message.details.code}</div>}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLimitReached ? "Please sign in to continue..." : "Type your message..."}
                disabled={isLimitReached || isLoading}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="submit"
                disabled={isLimitReached || isLoading || !input.trim()}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 