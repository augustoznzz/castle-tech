'use client'

import { motion } from 'framer-motion'
// Static blue aura behind the logo, now pulsing softly

interface HeroAnimationsProps {
  type?: 'floating' | 'scroll'
}

export function HeroAnimations({ type = 'floating' }: HeroAnimationsProps) {
  if (type === 'scroll') {
    return null
  }
  return (
    <div className="absolute inset-0">
      <motion.div
        aria-hidden
        className="absolute -inset-24 pointer-events-none"
        style={{
          background: 'radial-gradient(420px circle at 50% 50%, rgba(34, 211, 238, 0.16), rgba(34, 211, 238, 0.08) 40%, transparent 65%)',
          mixBlendMode: 'screen',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 50%, black 55%, transparent 100%)',
          maskImage: 'radial-gradient(70% 70% at 50% 50%, black 55%, transparent 100%)',
          transformOrigin: '50% 50%',
        }}
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
