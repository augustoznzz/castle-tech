'use client'

import { motion } from 'framer-motion'
import { Truck, Shield, Headphones } from 'lucide-react'
import { FeatureCard } from './feature-card'

const features = [
  {
    title: 'Entrega Rápida',
    description: 'A construção do seu SaaS feita em até 120 horas.',
    icon: Truck,
  },
  {
    title: 'Pagamento Seguro',
    description: 'Suas informações de pagamento são protegidas com criptografia.',
    icon: Shield,
  },
  {
    title: 'Suporte 12/7',
    description: 'Nossa equipe de suporte dedicada está disponível 12 horas por dia para ajudar você.',
    icon: Headphones,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg mb-4">
            Por que escolher a CastleTech?
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Estamos comprometidos em oferecer uma experiência de compra excepcional, com produtos premium e um atendimento ao cliente de excelência.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
