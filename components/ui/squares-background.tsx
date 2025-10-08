"use client"

import { useRef, useEffect, useState } from "react"

interface SquaresProps {
  direction?: "right" | "left" | "up" | "down" | "diagonal"
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  className?: string
  excludeSelectors?: string[]
}

export function Squares({
  direction = "right",
  speed = 0.2,
  borderColor = "#333",
  squareSize = 40,
  hoverFillColor = "#222",
  className,
  excludeSelectors = [".bg-surface"],
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const numSquaresX = useRef<number>()
  const numSquaresY = useRef<number>()
  const gridOffset = useRef({ x: 0, y: 0 })
  const [effectiveSquareSize, setEffectiveSquareSize] = useState<number>(squareSize)
  const patternRef = useRef<CanvasPattern | null>(null)
  const excludedElementsRef = useRef<HTMLElement[]>([])
  const excludeRectsRef = useRef<Array<{ x: number; y: number; w: number; h: number }>>([])
  const inViewRef = useRef<boolean>(true)
  const lastFrameTimeRef = useRef<number>(0)
  const frameAccumulatorRef = useRef<number>(0)
  const targetFpsRef = useRef<number>(60)
  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number
    y: number
  } | null>(null)

  // Compute a responsive square size based on viewport width
  useEffect(() => {
    const computeResponsiveSize = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1280
      let size = squareSize
      // On smaller screens, increase square size to reduce draw workload
      if (w < 640) size = Math.min(72, Math.max(24, Math.round(squareSize * 1.4)))
      else if (w < 1024) size = Math.min(64, Math.max(22, Math.round(squareSize * 1.15)))
      else size = squareSize
      setEffectiveSquareSize(size)
    }
    computeResponsiveSize()
    window.addEventListener('resize', computeResponsiveSize)
    return () => window.removeEventListener('resize', computeResponsiveSize)
  }, [squareSize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resolve base background color (kept for potential effects)
    const root = document.documentElement
    const bgVar = getComputedStyle(root).getPropertyValue('--background').trim()
    const baseBackground = bgVar ? `rgb(${bgVar})` : '#060606'

    // Make canvas background transparent (remove #171717 fill)
    canvas.style.background = 'transparent'
    canvas.style.opacity = "0.2"

    const resizeCanvas = () => {
      const isSmall = (typeof window !== 'undefined') && window.innerWidth <= 768
      const deviceDpr = Math.max(1, window.devicePixelRatio || 1)
      const maxDpr = isSmall ? 1.25 : 2 // clamp DPR on mobile to lower GPU cost
      const dpr = Math.min(deviceDpr, maxDpr)
      const cssWidth = canvas.offsetWidth
      const cssHeight = canvas.offsetHeight
      canvas.width = Math.max(1, Math.round(cssWidth * dpr))
      canvas.height = Math.max(1, Math.round(cssHeight * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      numSquaresX.current = Math.ceil(cssWidth / effectiveSquareSize) + 1
      numSquaresY.current = Math.ceil(cssHeight / effectiveSquareSize) + 1
    }

    // Pre-render a pattern tile to reduce per-frame work
    const buildPattern = () => {
      const size = Math.max(4, Math.floor(effectiveSquareSize))
      const tile = document.createElement('canvas')
      tile.width = size
      tile.height = size
      const tctx = tile.getContext('2d')
      if (!tctx) return
      tctx.clearRect(0, 0, size, size)
      tctx.strokeStyle = borderColor
      tctx.lineWidth = 0.5
      // draw top and left borders to form a grid when repeated
      tctx.beginPath()
      tctx.moveTo(0.5, 0)
      tctx.lineTo(0.5, size)
      tctx.moveTo(0, 0.5)
      tctx.lineTo(size, 0.5)
      tctx.stroke()
      patternRef.current = ctx.createPattern(tile, 'repeat')
    }

    // Cache excluded elements and compute their rects relative to canvas
    const collectExcluded = () => {
      excludedElementsRef.current = []
      if (excludeSelectors && excludeSelectors.length > 0) {
        excludeSelectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((el) => {
            excludedElementsRef.current.push(el as HTMLElement)
          })
        })
      }
    }

    const updateExcludeRects = () => {
      const pad = 8
      const canvasRect = canvas.getBoundingClientRect()
      const rects: Array<{ x: number; y: number; w: number; h: number }> = []
      excludedElementsRef.current.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const x = Math.floor(Math.max(0, rect.left - canvasRect.left - pad))
        const y = Math.floor(Math.max(0, rect.top - canvasRect.top - pad))
        const right = Math.ceil(Math.min(canvas.width, rect.right - canvasRect.left + pad))
        const bottom = Math.ceil(Math.min(canvas.height, rect.bottom - canvasRect.top + pad))
        const w = Math.max(0, right - x)
        const h = Math.max(0, bottom - y)
        if (w > 0 && h > 0) rects.push({ x, y, w, h })
      })
      excludeRectsRef.current = rects
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    buildPattern()
    collectExcluded()
    updateExcludeRects()

    // Choose a slightly lower FPS target on small screens for smoother perceived motion with less cost
    targetFpsRef.current = (typeof window !== 'undefined' && window.innerWidth <= 768) ? 45 : 60

    let scheduled = false
    const scheduleRectsUpdate = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        scheduled = false
        updateExcludeRects()
      })
    }
    window.addEventListener('scroll', scheduleRectsUpdate, { passive: true })

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cssWidth1 = canvas.clientWidth || canvas.width
      const cssHeight1 = canvas.clientHeight || canvas.height
      const offX = - (gridOffset.current.x % effectiveSquareSize)
      const offY = - (gridOffset.current.y % effectiveSquareSize)
      if (patternRef.current) {
        const pattern = patternRef.current as CanvasPattern & { setTransform?: (m: DOMMatrix) => void }
        if (typeof pattern.setTransform === 'function') {
          pattern.setTransform(new DOMMatrix().translate(offX, offY))
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, cssWidth1, cssHeight1)
        } else {
          ctx.save()
          ctx.translate(offX, offY)
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, cssWidth1 - offX, cssHeight1 - offY)
          ctx.restore()
        }
      }

      // Optional hover highlight (skip on touch to save work)
      const isTouch = 'ontouchstart' in window
      if (!isTouch && hoveredSquare) {
        const startX = Math.floor(gridOffset.current.x / effectiveSquareSize) * effectiveSquareSize
        const startY = Math.floor(gridOffset.current.y / effectiveSquareSize) * effectiveSquareSize
        const squareX = (hoveredSquare.x * effectiveSquareSize) - (gridOffset.current.x - startX)
        const squareY = (hoveredSquare.y * effectiveSquareSize) - (gridOffset.current.y - startY)
        ctx.fillStyle = hoverFillColor
        ctx.fillRect(squareX, squareY, effectiveSquareSize, effectiveSquareSize)
      }

      // Use CSS pixel dimensions for gradients to avoid DPR/zoom seams
      const cssWidth2 = canvas.clientWidth || canvas.width
      const cssHeight2 = canvas.clientHeight || canvas.height
      // No solid/gradient background fill — canvas stays transparent

      // Exclude areas using cached rectangles (erase grid under cards)
      if (excludeRectsRef.current.length > 0) {
        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = 'rgba(0,0,0,1)'
        for (const r of excludeRectsRef.current) {
          ctx.fillRect(r.x, r.y, r.w, r.h)
        }
        ctx.restore()
      }
    }

    const updateAnimation = (time: number) => {
      const minSpeed = 0.1
      const effectiveSpeed = Math.max(speed, minSpeed)
      const baselineFrameMs = 1000 / 60 // scale movement to be per-60fps frame

      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = time
      }
      const deltaMs = time - lastFrameTimeRef.current
      lastFrameTimeRef.current = time
      frameAccumulatorRef.current += deltaMs

      const moveUnits = effectiveSpeed * (deltaMs / baselineFrameMs)

      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - moveUnits + effectiveSquareSize) % effectiveSquareSize
          break
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + moveUnits + effectiveSquareSize) % effectiveSquareSize
          break
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + moveUnits + effectiveSquareSize) % effectiveSquareSize
          break
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - moveUnits + effectiveSquareSize) % effectiveSquareSize
          break
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - moveUnits + effectiveSquareSize) % effectiveSquareSize
          gridOffset.current.y =
            (gridOffset.current.y - moveUnits + effectiveSquareSize) % effectiveSquareSize
          break
      }

      const frameInterval = 1000 / targetFpsRef.current
      if (frameAccumulatorRef.current >= frameInterval) {
        // Keep remainder to stay in sync over time
        frameAccumulatorRef.current = frameAccumulatorRef.current % frameInterval
        drawGrid()
      }
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const startX = Math.floor(gridOffset.current.x / effectiveSquareSize) * effectiveSquareSize
      const startY = Math.floor(gridOffset.current.y / effectiveSquareSize) * effectiveSquareSize

      const hoveredSquareX = Math.floor(
        (mouseX + gridOffset.current.x - startX) / effectiveSquareSize,
      )
      const hoveredSquareY = Math.floor(
        (mouseY + gridOffset.current.y - startY) / effectiveSquareSize,
      )

      setHoveredSquare({ x: hoveredSquareX, y: hoveredSquareY })
    }

    const handleMouseLeave = () => {
      setHoveredSquare(null)
    }

    // Event listeners
    window.addEventListener("resize", resizeCanvas)
    const isTouch = 'ontouchstart' in window
    if (!isTouch) {
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("mouseleave", handleMouseLeave)
    }

    // Initial setup
    resizeCanvas()

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      inViewRef.current = entry.isIntersecting
      if (entry.isIntersecting) {
        if (!requestRef.current) requestRef.current = requestAnimationFrame(updateAnimation)
      } else if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = undefined
      }
    }, { root: null, threshold: 0 })
    observer.observe(canvas)

    // Pause when tab not visible
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
          requestRef.current = undefined
        }
      } else if (inViewRef.current && !requestRef.current) {
        lastFrameTimeRef.current = 0
        frameAccumulatorRef.current = 0
        requestRef.current = requestAnimationFrame(updateAnimation)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // Start animation if in view initially
    requestRef.current = requestAnimationFrame(updateAnimation)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener('scroll', scheduleRectsUpdate)
      document.removeEventListener('visibilitychange', handleVisibility)
      if (!isTouch) {
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseleave", handleMouseLeave)
      }
      observer.disconnect()
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [direction, speed, borderColor, hoverFillColor, effectiveSquareSize, excludeSelectors])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full border-none block ${className}`}
    />
  )
}


