import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Castle Tech',
  description: 'Fale com a CastleTech. Estamos aqui para ajudar com dúvidas ou suporte que você precisar.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        {/* Seção Hero */}
        <div className="text-center mb-20">
          <h1 className="heading-lg mb-6">Solicite um Orçamento</h1>
          <p className="text-body max-w-2xl mx-auto">
            Adoraríamos ouvir você. Entre em contato com nossa equipe para qualquer dúvida,
            suporte ou apenas para dizer um oi!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Formulário de Contato */}
          <div className="space-y-8">
            <h2 className="heading-md">Envie uma mensagem</h2>
            <ContactForm />
          </div>

          {/* Informações de Contato */}
          <div className="space-y-8">
            <h2 className="heading-md">Entre em contato</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">E-mail</h3>
                  <p className="text-muted">castletechzzz@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                  <p className="text-muted">+55 (99) 99999-9999</p>
                  <p className="text-sm text-muted">Seg a Sex: 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Endereço</h3>
                  <p className="text-muted">
                    Brasil<br />
                    Florianópolis, SC	
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
