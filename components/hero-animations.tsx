'use client'

import { motion } from 'framer-motion'

interface HeroAnimationsProps {
  type?: 'floating' | 'scroll'
}

export function HeroAnimations({ type = 'floating' }: HeroAnimationsProps) {
  if (type === 'scroll') {
    return null
  }

  return (
    <>
      {/* Traçado animado que segue o formato do escudo com maior precisão */}
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 100 120" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="ct-beam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
              <stop offset="50%" stopColor="#22D3EE" stopOpacity="1" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
            <filter id="ct-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g>
            {/* Traço reto no topo, ignorando as torres */}
            <motion.path
              d="M12,20 H88 L80,55 V88 L50,108 L18,88 V50 L12,44 Z"
              fill="none"
              stroke="url(#ct-beam)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#ct-glow)"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="34 156"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -190 }}
              transition={{ repeat: Infinity, repeatType: 'loop', repeatDelay: 0, ease: 'linear', duration: 3.5 }}
            />
          </g>
        </svg>
      </div>
    </>
  )
}
