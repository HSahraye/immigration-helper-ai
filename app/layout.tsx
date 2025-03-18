import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { getAuthSession } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Immigration Helper AI',
  description: 'Your AI-powered immigration assistant',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the session server-side for initial render
  const session = await getAuthSession()
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
