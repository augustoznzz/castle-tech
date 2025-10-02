import { Suspense } from 'react'
import { Hero } from '@/components/hero'
import { ProductGrid } from '@/components/product-grid'
import { FeaturesSection } from '@/components/features-section'

// Loading components for better UX
function ProductGridSkeleton() {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-border/10">
      <div className="container">
        <div className="text-center mb-16">
          <div className="h-8 bg-border/20 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-border/20 rounded w-96 mx-auto mb-8 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-border/10 rounded-lg p-6 animate-pulse">
              <div className="h-48 bg-border/20 rounded mb-4" />
              <div className="h-4 bg-border/20 rounded w-3/4 mb-2" />
              <div className="h-4 bg-border/20 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials removed per request

export default function HomePage() {
  return (
    <div id="main-content">
      <Hero />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
      <FeaturesSection />
    </div>
  )
}