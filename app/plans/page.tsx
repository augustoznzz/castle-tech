'use client'
import CardFlip from '@/components/card-flip'

export default function PlansPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        <div className="text-center mb-12">
          <h1 className="heading-lg mb-3">Planos</h1>
          <p className="text-body max-w-2xl mx-auto">Escolha o plano que atende às suas necessidades. Vire os cards para explorar os recursos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
          <CardFlip
            className="!h-[484px]"
            priceSeparatorGapPx={5}
            title="Starter"
            subtitle="Perfeito para começar"
            description="Comece com o essencial para lançar."
            features={[
              'Landing page responsiva',
              'Infraestrutura básica',
              'Suporte técnico via E-mail/WhatsApp',
            ]}
            price="R$ 100"
            slug="plans#starter"
          />

          <CardFlip
            className="!h-[484px]"
            priceSeparatorGapPx={5}
            title="Pro"
            subtitle="Cresça com confiança"
            description="Ferramentas avançadas e assistência prioritária."
            features={[
              'Todos os recursos do Starter +',
              'Infraestrutura em cloud',
              'Integração com meios de pagamento via Pix',
              'Integrações com APIs externas (CRM, ERP, gateways complexos, etc.)',
              'Suporte técnico prioritário',
            ]}
            price="R$ 600"
            slug="plans#pro"
          />

          <CardFlip
            className="!h-[484px]"
            priceSeparatorGapPx={5}
            title="Premium"
            subtitle="Escale com segurança"
            description="Soluções sob medida e sucesso dedicado."
            features={[
              'Todos os recursos do Pro +',
              'IA aplicada ao SaaS (chatbots)',
              'Consultoria estratégica para evolução do produto',
              'Camada de segurança reforçada (autenticação JWT, criptografia de dados sensíveis)',
              'Suporte técnico prioritário',
            ]}
            price="R$ 1200"
            slug="plans#premium"
          />
        </div>
      </div>
    </div>
  )
}


