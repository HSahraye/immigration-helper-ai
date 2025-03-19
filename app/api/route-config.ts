/**
 * Standard configuration for all API routes to support static export
 * 
 * This provides the required generateStaticParams function for all dynamic API routes
 * when using static export. Import this in any dynamic API route file.
 */

// Function to provide empty static params for API routes
// This satisfies the Next.js static export requirement without pre-rendering
export function generateStaticParams() {
  return [];
}

// Helper method to handle API errors consistently
export function handleApiError(error: unknown, message: string) {
  console.error(`API Error - ${message}:`, error);
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
} 