import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGridClient } from './product-grid-client'

export function ProductGrid() {
  return (
    <section className="section-padding relative">
      
      <div className="container relative z-10">
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
