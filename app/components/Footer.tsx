'use client';

export function Footer() {
  return (
    <footer className="bg-[#303134] py-6">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
        <p className="mb-2">© {new Date().getFullYear()} Immigration Helper AI. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
          <a href="#" className="hover:text-gray-300">Contact Us</a>
        </div>
      </div>
    </footer>
  );
} 