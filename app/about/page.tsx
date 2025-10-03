import type { Metadata } from 'next'
import Image from 'next/image'
import { Users, Award, Heart, Target } from 'lucide-react'
import { AnimatedCounter } from '@/components/animated-counter'

export const metadata: Metadata = {
  title: 'Castle Tech',
  description: 'Saiba mais sobre a missão da CastleTech de oferecer produtos premium com qualidade e design excepcionais.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="heading-lg mb-6">Sobre a CastleTech</h1>
          <p className="text-body max-w-3xl mx-auto">
            Somos apaixonados por oferecer produtos premium que melhoram o seu dia a dia.
            Nosso compromisso com qualidade, design e satisfação do cliente orienta tudo o que fazemos.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h2 className="heading-md">Nossa missão</h2>
            <p className="text-body">
              Na CastleTech, acreditamos que produtos excepcionais devem ser acessíveis a todos.
              Selecionamos nossa coleção com cuidado, trabalhando com fabricantes confiáveis para oferecer
              itens que combinam qualidade superior com design inteligente.
            </p>
            <p className="text-body">
              Somos uma equipe apaixonada, dedicada a oferecer os melhores produtos possíveis aos nossos clientes.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src="/images/foto.png"
                alt="Membro da equipe CastleTech"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                quality={90}
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="heading-md text-center mb-16">Nossos Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="heading-sm">Qualidade em Primeiro Lugar</h3>
              <p className="text-muted">
                Nunca abrimos mão da qualidade. Cada produto da nossa coleção atende aos nossos
                rigorosos padrões de durabilidade, funcionalidade e design.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="heading-sm">Foco no Cliente</h3>
              <p className="text-muted">
                Sua satisfação é nossa prioridade. Estamos aqui para ajudar você a encontrar os produtos ideais
                e oferecer suporte sempre que precisar.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="heading-sm">Comunidade</h3>
              <p className="text-muted">
                Estamos construindo uma comunidade de pessoas que valorizam qualidade e design.
                Junte-se a nós para celebrar aquilo que torna a vida melhor.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-accent/5 to-accent/10 rounded-2xl p-12 text-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
            <div className="text-center">
              <div className="text-muted mb-1">Clientes satisfeitos</div>
              <AnimatedCounter 
                value="320" 
                suffix="+"
                className="text-3xl font-bold text-accent" 
                duration={2.5}
              />
            </div>
            <div className="text-center">
              <div className="text-muted mb-1">Taxa de satisfação</div>
              <AnimatedCounter 
                value="99%" 
                className="text-3xl font-bold text-accent" 
                duration={2.2}
              />
            </div>
            <div className="text-center">
              <div className="text-muted mb-1">Entrega em até</div>
              <AnimatedCounter 
                value={120} 
                suffix=" horas"
                className="text-3xl font-bold text-accent" 
                duration={1.5}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
