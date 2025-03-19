import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'AI Chat Assistant - Immigration Helper AI',
  description: 'Get instant answers to your immigration-related questions with our AI chat assistant.',
};

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">AI Chat Assistant</h1>
            <p className="text-xl text-gray-400">
              Get instant answers to your immigration-related questions.
            </p>
          </div>

          <div className="bg-[#303134] rounded-lg border border-gray-700 overflow-hidden">
            {/* Chat Messages Area */}
            <div className="h-[500px] p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-4">
                    AI
                  </div>
                  <div className="bg-[#202124] p-4 rounded-lg max-w-[80%]">
                    <p>Hello! I'm your immigration AI assistant. How can I help you today?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 p-4">
              <form className="flex gap-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-[#202124] border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#303134] p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
              <ul className="space-y-3">
                <li>
                  <button className="text-blue-400 hover:text-blue-300 text-left">
                    How do I apply for a student visa?
                  </button>
                </li>
                <li>
                  <button className="text-blue-400 hover:text-blue-300 text-left">
                    What documents do I need for a work permit?
                  </button>
                </li>
                <li>
                  <button className="text-blue-400 hover:text-blue-300 text-left">
                    How long does visa processing take?
                  </button>
                </li>
                <li>
                  <button className="text-blue-400 hover:text-blue-300 text-left">
                    What are the requirements for permanent residency?
                  </button>
                </li>
              </ul>
            </div>

            <div className="bg-[#303134] p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Tips for Better Results</h2>
              <ul className="space-y-3 text-gray-400">
                <li>• Be specific with your questions</li>
                <li>• Provide relevant context</li>
                <li>• Ask one question at a time</li>
                <li>• Use clear and simple language</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 