import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the ChatInterface component with no SSR to avoid hydration issues
const ChatInterface = dynamic(() => import('../components/ChatInterface'), { ssr: false });

export const metadata: Metadata = {
  title: 'AI Chat Assistant - Immigration Helper AI',
  description: 'Get instant answers to your immigration-related questions with our AI chat assistant.',
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex flex-col">
      <div className="container mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-6">AI Chat Assistant</h1>
            <p className="text-lg md:text-xl text-gray-400">
              Get instant answers to your immigration-related questions.
            </p>
          </div>

          <div className="bg-[#303134] rounded-lg border border-gray-700 overflow-hidden flex-1 flex flex-col min-h-[500px]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
} 