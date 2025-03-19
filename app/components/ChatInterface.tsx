'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your immigration AI assistant. How can I help you today?",
      role: 'assistant',
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input field on load
  useEffect(() => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);

  // Sample questions for quick responses
  const sampleQuestions = [
    "How do I apply for a student visa?",
    "What documents do I need for a work permit?",
    "How long does visa processing take?",
    "What are the requirements for permanent residency?"
  ];

  // Convert chat history to OpenAI format
  const prepareMessagesForAPI = () => {
    // System message to provide context about the assistant's purpose
    const systemMessage = {
      role: "system",
      content: "You are a helpful immigration assistant who provides accurate information about visas, work permits, and immigration processes. Your answers should be clear, concise, and helpful. Provide factual information and avoid speculation. When you don't know something, acknowledge it and suggest reliable sources where the user might find more information."
    };
    
    // Map our UI messages to the OpenAI API format
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the system message at the beginning
    return [systemMessage, ...formattedMessages];
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare messages for the API
      const apiMessages = prepareMessagesForAPI();
      // Add the latest user message
      apiMessages.push({ role: 'user', content: userMessage.content });
      
      // Make the API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: 'assistant',
        createdAt: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        role: 'assistant',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clicking a sample question
  const handleSampleQuestion = (question: string) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  AI
                </div>
              )}
              
              <div 
                className={`p-4 rounded-lg max-w-[80%] md:max-w-[70%] ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#202124] border border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0 bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center ml-3">
                  <span className="text-sm">You</span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                AI
              </div>
              <div className="bg-[#202124] p-4 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 bg-[#303134]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleTextareaChange}
              placeholder="Type your message..."
              className="w-full bg-[#202124] border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 resize-none overflow-hidden"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </div>
        </form>
      </div>

      {/* Sample Questions */}
      <div className="p-4 bg-[#303134] border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Try asking about:</h3>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((question) => (
            <button
              key={question}
              onClick={() => handleSampleQuestion(question)}
              className="text-sm bg-[#202124] hover:bg-[#252525] text-blue-400 px-3 py-1.5 rounded-full whitespace-nowrap"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 