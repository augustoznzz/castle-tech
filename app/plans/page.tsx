export default function PlansPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        <div className="text-center mb-12">
          <h1 className="heading-lg mb-3">Planos</h1>
          <p className="text-body max-w-2xl mx-auto">Escolha o plano que atende às suas necessidades.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-start">
          <div className="w-full">
            <h2 className="heading-md mb-3">Starter:</h2>
            <div className="space-y-2 text-body">
              <p>→ Landing page responsiva</p>
              <p>→ Infraestrutura básica</p>
              <p>→ Suporte técnico via E-mail/WhatsApp</p>
            </div>
          </div>

          <div className="w-full">
            <h2 className="heading-md mb-3">Pro:</h2>
            <div className="space-y-2 text-body">
              <p>→ Todos os recursos do Starter +</p>
              <p>→ Infraestrutura em cloud</p>
              <p>→ 2 páginas</p>
              <p>→ Integração com meios de pagamento via Pix</p>
              <p>Integrações com APIs externas (CRM, ERP, gateways complexos, etc.)</p>
              <p>→ Suporte técnico prioritário</p>
            </div>
          </div>

          <div className="w-full">
            <h2 className="heading-md mb-3">Premium:</h2>
            <div className="space-y-2 text-body">
              <p>→ Todos os recursos do Pro +</p>
              <p>→ IA aplicada ao SaaS (chatbots)</p>
              <p>→ Consultoria estratégica para evolução do produto</p>
              <p>→ Suporte técnico prioritário</p>
              <p>→ Camada de segurança reforçada (autenticação JWT, criptografia de dados sensíveis)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


