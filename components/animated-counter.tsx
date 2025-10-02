'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: string | number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  suffix = '', 
  prefix = '',
  className = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  // Extract numeric value from string (e.g., "10K+" -> 10000)
  const getNumericValue = (val: string | number): number => {
    if (typeof val === 'number') return val
    
    const str = val.toString().toLowerCase()
    const num = parseFloat(str.replace(/[^0-9.]/g, ''))
    
    if (str.includes('k')) return num * 1000
    if (str.includes('m')) return num * 1000000
    if (str.includes('%')) return num
    
    return num
  }

  // Format the display value
  const formatValue = (currentValue: number): string => {
    const originalStr = value.toString()
    
    if (originalStr.includes('K') || originalStr.includes('k')) {
      return `${prefix}${Math.floor(currentValue / 1000)}K${suffix}`
    }
    if (originalStr.includes('M') || originalStr.includes('m')) {
      return `${prefix}${Math.floor(currentValue / 1000000)}M${suffix}`
    }
    if (originalStr.includes('%')) {
      return `${prefix}${Math.floor(currentValue)}%${suffix}`
    }
    if (originalStr.includes('/')) {
      return originalStr // Don't animate "24/7"
    }
    
    return `${prefix}${Math.floor(currentValue)}${suffix}`
  }

  useEffect(() => {
    if (!isInView || hasAnimated) return

    const numericValue = getNumericValue(value)
    const originalStr = value.toString()
    
    // Don't animate non-numeric values like "24/7"
    if (originalStr.includes('/') || numericValue === 0) {
      setCount(numericValue)
      setHasAnimated(true)
      return
    }

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 800), 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = numericValue * easeOutQuart
      
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(numericValue)
        setHasAnimated(true)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, value, duration, hasAnimated])

  const displayValue = value.toString().includes('/') ? value : formatValue(count)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {displayValue}
    </motion.div>
  )
}
