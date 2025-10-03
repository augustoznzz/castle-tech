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
            className="!h-[580px]"
            priceSeparatorGapPx={5}
            title="Starter"
            subtitle="Perfeito para começar"
            description="Comece com o essencial para lançar."
            features={[
              '1 Landing page responsiva',
              'Infraestrutura em cloudflare',
              'Suporte técnico via E-mail/WhatsApp',
              'Segurança SSL',
            ]}
            price="A partir de R$ 100"
            ctaHref="/contact"
          />

          <CardFlip
            className="!h-[580px]"
            priceSeparatorGapPx={5}
            title="Pro"
            subtitle="Cresça com confiança"
            description="Ferramentas avançadas e assistência prioritária."
            features={[
              'Todos os recursos do Starter +',
              '3 páginas de sua escolh (4 ao total)',
              'Integração com meios de pagamento via Pix',
              'Integrações com APIs externas (CRM, ERP, gateways complexos, etc.)',
              'Suporte técnico prioritário',
              'Segurança SSL',
            ]}
            price="A partir de R$ 600"
            ctaHref="/contact"
          />

          <CardFlip
            className="!h-[580px]"
            priceSeparatorGapPx={5}
            title="Premium"
            subtitle="Escale com segurança"
            description="Soluções sob medida e sucesso dedicado."
            features={[
              'Todos os recursos do Pro +',
              '6 páginas de sua escolha (10 ao total)',
              'IA aplicada ao SaaS (chatbots)',
              'Disponibilidade de consultoria estratégica uma vez por mês',
              'Camada de segurança reforçada (autenticação JWT, criptografia de dados sensíveis)',
              'Painel de administrador com métricas detalhadas sobre usuários e acessos',
              '1 ano de domínio gratuito',
              'Segurança SSL',
              'Suporte prioritário 18/24',
            ]}
            price="A partir de R$ 1800"
            ctaHref="/contact"
          />
        </div>
      </div>
    </div>
  )
}


