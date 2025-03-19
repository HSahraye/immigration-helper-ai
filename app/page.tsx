export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Welcome to Immigration Helper AI</h1>
        <p className="text-xl mb-12">Your intelligent assistant for immigration-related questions and document analysis.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#303134] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Document Analysis</h2>
            <p className="mb-4">Upload your immigration documents for AI-powered analysis and insights.</p>
            <a href="/documents" className="text-blue-400 hover:text-blue-300">Get Started →</a>
          </div>
          
          <div className="bg-[#303134] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">AI Chat Assistant</h2>
            <p className="mb-4">Get instant answers to your immigration-related questions.</p>
            <a href="/chat" className="text-blue-400 hover:text-blue-300">Start Chatting →</a>
          </div>
          
          <div className="bg-[#303134] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Resource Library</h2>
            <p className="mb-4">Access comprehensive immigration guides and resources.</p>
            <a href="/resources" className="text-blue-400 hover:text-blue-300">Browse Resources →</a>
          </div>
        </div>
      </div>
    </div>
  );
} 