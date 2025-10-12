'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  index: number
}

export function FeatureCard({ title, description, icon: Icon, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/10 h-full">
        <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />
        <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70" />

        <div className="relative p-6 text-center h-full flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="heading-sm mb-2">{title}</h3>
          </div>
          <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
