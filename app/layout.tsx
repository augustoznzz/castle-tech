import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { AccessibilityProvider } from '@/components/accessibility-provider'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { SessionManager } from '@/components/session-manager'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Castle Tech',
  description: 'Discover premium products with exceptional quality and design. Fast delivery, easy returns, and 24/7 support.',
  keywords: 'e-commerce, premium products, online shopping, technology, lifestyle',
  authors: [{ name: 'CastleTech' }],
  creator: 'CastleTech',
  publisher: 'CastleTech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://castletech-commerce.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CastleTech Commerce - Premium Services',
    description: 'Discover premium products with exceptional quality and design.',
    url: 'https://castletech-commerce.vercel.app',
    siteName: 'CastleTech Commerce',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CastleTech Commerce',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CastleTech Commerce - Premium Services',
    description: 'Discover premium products with exceptional quality and design.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/images/castle_tech.png" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased`}>
        <AccessibilityProvider>
          <PerformanceMonitor />
          <SessionManager />
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
              © 2025 Castle Tech. Todos os direitos reservados.
            </footer>
          </div>
        </AccessibilityProvider>
      </body>
    </html>
  )
}
