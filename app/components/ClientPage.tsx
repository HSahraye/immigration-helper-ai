'use client';

import { ReactNode, Suspense } from 'react';

/**
 * ClientPage is a wrapper component that ensures its children are only 
 * rendered on the client-side, preventing React hook errors during 
 * server-side rendering or static generation.
 *
 * Use this to wrap any page component that uses React hooks.
 */
export default function ClientPage({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      {children}
    </Suspense>
  );
} 