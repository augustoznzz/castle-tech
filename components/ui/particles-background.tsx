'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

interface ParticlesBackgroundProps {
  className?: string
  particleColor?: string
  density?: 'low' | 'medium' | 'high'
  speed?: number
}

export function ParticlesBackground({
  className = '',
  particleColor = '#22D3EE', // Accent color from theme
  density = 'medium',
  speed = 0.5,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect mobile devices and reduced motion preferences
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }
    
    const checkReducedMotion = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setPrefersReducedMotion(reducedMotion)
    }
    
    checkMobile()
    checkReducedMotion()
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkReducedMotion)
    window.addEventListener('resize', checkMobile)
    
    return () => {
      mediaQuery.removeEventListener('change', checkReducedMotion)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Calculate particle count based on density and device
  const getParticleCount = () => {
    const baseCount = {
      low: 30,
      medium: 50,
      high: 80,
    }[density]

    // Reduce particles on mobile
    return isMobile ? Math.floor(baseCount * 0.4) : baseCount
  }

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Set canvas size with device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      
      setDimensions({ width, height })

      // Scale context for device pixel ratio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // Create particles when dimensions change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const particleCount = getParticleCount()
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: isMobile ? Math.random() * 2 + 1 : Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    particlesRef.current = particles
  }, [dimensions, speed, density, isMobile])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let lastTime = performance.now()
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime

      // Throttle to target FPS
      if (deltaTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      lastTime = currentTime - (deltaTime % frameInterval)

      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      const particles = particlesRef.current

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position (much slower if reduced motion is preferred)
        const motionMultiplier = prefersReducedMotion ? 0.1 : 1
        particle.x += particle.vx * motionMultiplier
        particle.y += particle.vy * motionMultiplier

        // Wrap around edges
        if (particle.x < 0) particle.x = dimensions.width
        if (particle.x > dimensions.width) particle.x = 0
        if (particle.y < 0) particle.y = dimensions.height
        if (particle.y > dimensions.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${particleColor}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      // Draw connections between nearby particles (only on desktop for performance)
      if (!isMobile) {
        const maxDistance = 150
        
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < maxDistance) {
              const opacity = (1 - distance / maxDistance) * 0.15
              ctx.beginPath()
              ctx.strokeStyle = `${particleColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
              ctx.lineWidth = 0.5
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions, particleColor, isMobile, prefersReducedMotion])

  // Pause animation when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      } else {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            const animate = (currentTime: number) => {
              ctx.clearRect(0, 0, dimensions.width, dimensions.height)
              // Animation logic here (simplified for visibility check)
              animationFrameRef.current = requestAnimationFrame(animate)
            }
            animationFrameRef.current = requestAnimationFrame(animate)
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [dimensions])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  )
}

