import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGridClient } from './product-grid-client'

export function ProductGrid() {
  return (
    <section className="section-padding bg-gradient-to-b from-background to-border/10 relative">
      {/* Fade in effect at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      
      <div className="container relative z-20">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">
            Planos em Destaque
          </h2>
          <p className="text-body max-w-2xl mx-auto mb-8">
            Descubra nossa seleção cuidadosamente elaborada de planos feitos para ajudar você a escalar.
          </p>
        </div>

        <ProductGridClient />

        {/* Call to action */}
        <div className="text-center mt-16">
          <Link
            href="/plans"
            className="btn-primary cta-animated inline-flex items-center"
            prefetch={true}
          >
            Explorar Planos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
