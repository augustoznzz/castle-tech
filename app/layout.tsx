import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { AccessibilityProvider } from '@/components/accessibility-provider'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { SessionManager } from '@/components/session-manager'
import { Squares } from '@/components/ui/squares-background'
import { ClientOnly } from '@/components/client-only'

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
  description: 'Descubra qualidade e design excepcionais com nossa coleção selecionada de produtos. Feitos para durar, projetados para inspirar. Suporte 12/7.',
  keywords: 'e-commerce, premium products, online shopping, technology, lifestyle',
  authors: [{ name: 'CastleTech' }],
  creator: 'CastleTech',
  publisher: 'CastleTech',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://castletech.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Castle Tech - Premium SaaS',
    description: 'Descubra qualidade e design excepcionais com nossa coleção selecionada de produtos. Feitos para durar, projetados para inspirar. Suporte 12/7.',
    url: 'https://castletech.netlify.app/?v=20251003-2',
    siteName: 'Castle Tech',
    images: [
      {
        url: '/images/castle_tech.png?v=20251003-2',
        width: 1200,
        height: 630,
        alt: 'Castle Tech',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Castle Tech Commerce - Premium SaaS',
    description: 'Descubra qualidade e design excepcionais com nossa coleção selecionada de produtos. Feitos para durar, projetados para inspirar. Suporte 12/7.',
    images: ['/images/castle_tech.png?v=20251003-2'],
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
        {/* Explicit OG/Twitter tags for Discord caches */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Castle Tech - Premium SaaS" />
        <meta property="og:site_name" content="Castle Tech" />
        <meta property="og:description" content="Descubra qualidade e design excepcionais com nossa coleção selecionada de produtos. Feitos para durar, projetados para inspirar. Suporte 12/7." />
        <meta property="og:url" content="https://castletech.netlify.app/?v=20251003-2" />
        <meta property="og:image" content="https://castletech.netlify.app/images/castle_tech.png?v=20251003-2" />
        <meta property="og:updated_time" content="2025-10-03T00:00:00Z" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Castle Tech - Premium SaaS" />
        <meta name="twitter:description" content="Descubra qualidade e design excepcionais com nossa coleção selecionada de produtos. Feitos para durar, projetados para inspirar. Suporte 12/7." />
        <meta name="twitter:image" content="https://castletech.netlify.app/images/castle_tech.png?v=20251003-2" />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased`}>
        <AccessibilityProvider>
          <PerformanceMonitor />
          <SessionManager />
          <div className="flex min-h-screen flex-col relative">
            {/* Global animated background */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-30">
              <ClientOnly>
              <Squares 
                  direction="diagonal" 
                  speed={0.25} 
                  squareSize={40} 
                  borderColor="#22D3EE" 
                  hoverFillColor="#22D3EE" 
                excludeSelectors={[".bg-surface", ".squares-exclude"]}
                />
              </ClientOnly>
            </div>
            <SiteHeader />
            <div className="flex-1 relative">
              <main className="relative z-10">
                {children}
              </main>
            </div>
            <footer className="border-t border-border/40 py-6 text-center text-sm text-muted-foreground">
              © 2025 Castle Tech. Todos os direitos reservados.
            </footer>
          </div>
        </AccessibilityProvider>
      </body>
    </html>
  )
}
