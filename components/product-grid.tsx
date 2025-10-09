import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductGridClient } from './product-grid-client'

export function ProductGrid() {
  return (
    <section className="section-padding relative">
      {/* Background rectangle */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-4/5 bg-[#171717] rounded-lg shadow-[0px_4px_4px_#171717,0px_-4px_4px_#171717] z-0
                   sm:h-3/5
                   md:h-4/5
                   lg:h-4/5
                   xl:h-3/5"
      />
      
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
