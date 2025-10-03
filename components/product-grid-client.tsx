'use client'

import { motion } from 'framer-motion'
import CardFlip from '@/components/card-flip'
import { ClientOnly } from './client-only'

function ProductGridContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center"
    >
      <CardFlip
        title="Starter"
        subtitle="Perfeito para começar"
        description="Comece com o essencial para lançar."
        features={['1 Landing page + 3 páginas', 'Portfólio', 'Serviços', 'Informações de contato']}
        price="A partir de R$ 200"
        isHome
      />
      <CardFlip
        title="Pro"
        subtitle="Cresça com confiança"
        description="Ferramentas avançadas e assistência prioritária."
        features={['Projetos ilimitados', 'Suporte prioritário', 'Análises avançadas', 'Colaboração em equipe']}
        price="R$ 600"
        isHome
      />
      <CardFlip
        title="Premium"
        subtitle="Escale com segurança"
        description="Soluções sob medida e sucesso dedicado."
        features={['SLA & SSO', 'Suporte dedicado', 'Auditorias de segurança', 'Onboarding personalizado']}
        price="R$ 1200"
        isHome
      />
    </motion.div>
  )
}

export function ProductGridClient() {
  return (
    <ClientOnly 
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse w-full max-w-[336px] h-[384px] rounded-2xl bg-border/20" />
          ))}
        </div>
      }
    >
      <ProductGridContent />
    </ClientOnly>
  )
}
