'use client'

interface HeroAnimationsProps {
  type?: 'floating' | 'scroll'
  showSnow?: boolean
}

// Snow effect removed as requested; component kept for compatibility
export function HeroAnimations({ type = 'floating', showSnow = true }: HeroAnimationsProps) {
  return null
}