import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { HeroAnimations } from './hero-animations'
import dynamic from 'next/dynamic'
const LightRays = dynamic(() => import('./LightRays'), { ssr: false })
import { AnimatedCounter } from './animated-counter'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-28">
      {/* Background gradient removed to let LightRays show uniformly from top */}
      {/* Rays now span the whole page via layout background */}
      
      
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="heading-xl text-balance">
                O melhor serviço para
                <span className="text-accent"> construir o seu SaaS</span>
              </h1>
              <p className="text-body max-w-lg">
              Descubra qualidade e design excepcionais com nossa coleção selecionada de produtos premium. Feitos para durar, projetados para inspirar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/plans"
                className="btn-primary inline-flex items-center justify-center group"
                prefetch={true}
              >
                Ver Planos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="btn-secondary inline-flex items-center justify-center"
                prefetch={true}
              >
                Saiba Mais
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
               <div className="text-center">
                 <div className="text-sm text-muted mb-1">Clientes satisfeitos</div>
                 <AnimatedCounter 
                  value="320" 
                  suffix="+"
                   className="text-2xl font-bold text-accent" 
                   duration={2.5}
                 />
               </div>
               <div className="text-center">
                 <div className="text-sm text-muted mb-1">Entrega em até</div>
                 <AnimatedCounter 
                   value={7}
                   suffix=" dias"
                   className="text-2xl font-bold text-accent" 
                   duration={1.5}
                 />
               </div>
            </div>

            
          </div>

          {/* Product Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative aspect-square max-w-sm lg:max-w-lg mx-auto p-4">
              {/* Interactive visual effect - positioned behind image */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <HeroAnimations />
              </div>
              
              {/* Main Image */}
              <div className="relative z-10 w-full h-full">
                <Image
                  src="/images/castle_tech.png"
                  alt="CastleTech logo and branding"
                  fill
                  className="object-contain select-none"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - now client-side */}
      <HeroAnimations type="scroll" />
    </section>
  )
}
