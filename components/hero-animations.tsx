'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface HeroAnimationsProps {
  type?: 'floating' | 'scroll'
  showSnow?: boolean
}

// Gera propriedades aleatórias para cada floco de neve
const generateSnowflakes = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // Posição horizontal aleatória dentro do container
    left: `${Math.random() * 100}%`,
    // Tamanho muito menor (1-3px)
    size: Math.random() * 2 + 1,
    // Duração da queda (8-15 segundos)
    duration: Math.random() * 7 + 8,
    // Atraso inicial para efeito escalonado
    delay: Math.random() * 5,
    // Opacidade variada para profundidade
    opacity: Math.random() * 0.6 + 0.4,
    // Movimento horizontal sutil (oscilação)
    sway: Math.random() * 20 - 10,
  }))
}

export function HeroAnimations({ type = 'floating', showSnow = true }: HeroAnimationsProps) {
  // Memoiza os flocos para evitar recriação em cada render
  const snowflakes = useMemo(() => generateSnowflakes(40), [])

  if (type === 'scroll') {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Efeito de neve - confinado ao container pai */}
      {showSnow && (
        <>
          {snowflakes.map((flake) => (
            <motion.div
              key={flake.id}
              className="absolute"
              style={{
                left: flake.left,
                top: '0%',
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                background: `radial-gradient(circle, rgba(255, 255, 255, ${flake.opacity}) 0%, transparent 70%)`,
                boxShadow: `0 0 ${flake.size}px rgba(255, 255, 255, ${flake.opacity * 0.3})`,
                borderRadius: '50%',
              }}
              initial={{ top: '-10%', x: 0 }}
              animate={{
                top: '110%',
                x: [0, flake.sway, -flake.sway / 2, 0],
              }}
              transition={{
                top: {
                  duration: flake.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: flake.delay,
                  repeatDelay: 0,
                },
                x: {
                  duration: flake.duration * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: flake.delay,
                  repeatType: 'reverse',
                },
              }}
            />
          ))}
          
          {/* Segunda camada de partículas ainda menores */}
          {Array.from({ length: 20 }, (_, i) => {
            const size = Math.random() * 1 + 0.5 // 0.5-1.5px
            const duration = Math.random() * 6 + 10
            const delay = Math.random() * 8
            const left = `${Math.random() * 100}%`
            const sway = Math.random() * 15 - 7.5
            const opacity = Math.random() * 0.3 + 0.3
            
            return (
              <motion.div
                key={`tiny-${i}`}
                className="absolute"
                style={{
                  left,
                  top: '0%',
                  width: `${size}px`,
                  height: `${size}px`,
                  background: `rgba(255, 255, 255, ${opacity})`,
                  borderRadius: '50%',
                }}
                initial={{ top: '-5%', x: 0 }}
                animate={{
                  top: '110%',
                  x: [0, sway, 0],
                }}
                transition={{
                  top: {
                    duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay,
                    repeatDelay: 0,
                  },
                  x: {
                    duration: duration * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay,
                    repeatType: 'reverse',
                  },
                }}
              />
            )
          })}
        </>
      )}
    </div>
  )
}