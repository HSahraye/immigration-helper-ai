'use client';

export function Footer() {
  return (
    <footer className="bg-black py-6 border-t border-white">
      <div className="max-w-7xl mx-auto px-4 text-center text-white">
        <p className="mb-2">© {new Date().getFullYear()} Immigration Helper AI. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
} 