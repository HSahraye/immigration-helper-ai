import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Document Analysis - Immigration Helper AI',
  description: 'Upload and analyze your immigration documents with AI-powered insights.',
};

export default async function DocumentsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Document Analysis</h1>
            <p className="text-xl text-white">
              Upload your immigration documents for AI-powered analysis and insights.
            </p>
          </div>

          <div className="bg-black p-8 rounded-lg border border-white">
            <div className="text-center p-12 border-2 border-dashed border-white rounded-lg hover:border-gray-300 transition-colors">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Drop your documents here</h3>
              <p className="text-white mb-4">or click to upload</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                multiple
              />
              <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Select Files
              </button>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Recent Analyses</h2>
            <div className="space-y-4">
              <div className="bg-black p-6 rounded-lg border border-white">
                <p className="text-white">No documents analyzed yet. Upload a document to get started.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-black p-8 rounded-lg border border-white">
            <h2 className="text-2xl font-semibold mb-6">Supported Document Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Visa Documents</h3>
                <ul className="space-y-2 text-white">
                  <li>• Visa Applications</li>
                  <li>• Supporting Letters</li>
                  <li>• Travel Documents</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Identity Documents</h3>
                <ul className="space-y-2 text-white">
                  <li>• Passports</li>
                  <li>• ID Cards</li>
                  <li>• Birth Certificates</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Other Documents</h3>
                <ul className="space-y-2 text-white">
                  <li>• Employment Letters</li>
                  <li>• Financial Statements</li>
                  <li>• Educational Records</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 