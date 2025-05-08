import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientProviders from './ClientProviders'
import { Footer } from './components/Footer'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zazu Quick Prep',
  description: 'Your fast, AI-powered immigration assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-black text-white`}>
        <ClientProviders>
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
