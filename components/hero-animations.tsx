'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface HeroAnimationsProps {
  type?: 'floating' | 'scroll'
}

export function HeroAnimations({ type = 'floating' }: HeroAnimationsProps) {
  if (type === 'scroll') {
    return null
  }

  // Keep dash/gap proportional to the measured path length so it looks the same on
  // mobile and desktop. We also keep animation speed constant per unit length.
  const pathElementRef = useRef<SVGPathElement | null>(null)
  const [measuredPathLength, setMeasuredPathLength] = useState<number>(190)

  // 34/190 ≈ 0.1789 — preserve original visual ratio across sizes
  const dashLengthRatio = 34 / 190
  const pixelsPerSecond = 190 / 3.5 // match original speed

  const computedDash = Math.max(8, measuredPathLength * dashLengthRatio)
  const computedGap = Math.max(0, measuredPathLength - computedDash)
  const computedDuration = measuredPathLength / pixelsPerSecond

  useEffect(() => {
    const recalculateFromDOM = () => {
      const node = pathElementRef.current
      if (!node) return
      try {
        const length = node.getTotalLength()
        // Avoid NaN/0 in rare cases during layout thrash
        if (Number.isFinite(length) && length > 0) {
          setMeasuredPathLength(length)
        }
      } catch {
        // noop – keep previous
      }
    }

    // Initial measure
    recalculateFromDOM()

    // Recalculate on resize/orientation changes so mobile stays equivalent
    window.addEventListener('resize', recalculateFromDOM)
    window.addEventListener('orientationchange', recalculateFromDOM)
    return () => {
      window.removeEventListener('resize', recalculateFromDOM)
      window.removeEventListener('orientationchange', recalculateFromDOM)
    }
  }, [])

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
              ref={pathElementRef}
              strokeDasharray={`${computedDash} ${computedGap}`}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -measuredPathLength }}
              transition={{ repeat: Infinity, repeatType: 'loop', repeatDelay: 0, ease: 'linear', duration: computedDuration }}
            />
          </g>
        </svg>
      </div>
    </>
  )
}
