/**
 * Configuration for NextAuth static export compatibility
 */

export function generateStaticParams() {
  return [
    { nextauth: ['providers'] },
    { nextauth: ['_log'] },
    { nextauth: ['error'] },
    { nextauth: ['signin'] },
    { nextauth: ['signout'] },
    { nextauth: ['session'] },
    { nextauth: ['csrf'] },
    { nextauth: ['callback'] }
  ];
} 