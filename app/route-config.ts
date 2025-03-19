/**
 * Shared configuration for dynamic routes
 */

// Function to provide empty static params for dynamic routes
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