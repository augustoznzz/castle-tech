'use client'

import { useEffect } from 'react'

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add skip link functionality
    const handleSkipLink = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const skipLink = document.querySelector('.skip-link') as HTMLElement
        if (skipLink) {
          skipLink.focus()
        }
      }
    }

    // Add keyboard navigation for carousel
    const handleCarouselKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-carousel]')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const prevButton = target.closest('[data-carousel]')?.querySelector('[aria-label*="Previous"]') as HTMLElement
          prevButton?.click()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          const nextButton = target.closest('[data-carousel]')?.querySelector('[aria-label*="Next"]') as HTMLElement
          nextButton?.click()
        }
      }
    }

    document.addEventListener('keydown', handleSkipLink)
    document.addEventListener('keydown', handleCarouselKeys)

    return () => {
      document.removeEventListener('keydown', handleSkipLink)
      document.removeEventListener('keydown', handleCarouselKeys)
    }
  }, [])

  return <>{children}</>
}
