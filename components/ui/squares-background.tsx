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
  const [hoveredSquare, setHoveredSquare] = useState<{
    x: number
    y: number
  } | null>(null)

  // Compute a responsive square size based on viewport width
  useEffect(() => {
    const computeResponsiveSize = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1280
      let size = squareSize
      if (w < 640) size = Math.max(16, Math.round(squareSize * 0.6))
      else if (w < 1024) size = Math.max(20, Math.round(squareSize * 0.8))
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
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const cssWidth = canvas.offsetWidth
      const cssHeight = canvas.offsetHeight
      canvas.width = Math.max(1, Math.round(cssWidth * dpr))
      canvas.height = Math.max(1, Math.round(cssHeight * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      numSquaresX.current = Math.ceil(cssWidth / effectiveSquareSize) + 1
      numSquaresY.current = Math.ceil(cssHeight / effectiveSquareSize) + 1
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const startX = Math.floor(gridOffset.current.x / effectiveSquareSize) * effectiveSquareSize
      const startY = Math.floor(gridOffset.current.y / effectiveSquareSize) * effectiveSquareSize

      ctx.lineWidth = 0.5

      for (let x = startX; x < canvas.width + effectiveSquareSize; x += effectiveSquareSize) {
        for (let y = startY; y < canvas.height + effectiveSquareSize; y += effectiveSquareSize) {
          const squareX = x - (gridOffset.current.x % effectiveSquareSize)
          const squareY = y - (gridOffset.current.y % effectiveSquareSize)

          if (
            hoveredSquare &&
            Math.floor((x - startX) / effectiveSquareSize) === hoveredSquare.x &&
            Math.floor((y - startY) / effectiveSquareSize) === hoveredSquare.y
          ) {
            ctx.fillStyle = hoverFillColor
            ctx.fillRect(squareX, squareY, effectiveSquareSize, effectiveSquareSize)
          }

          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX, squareY, effectiveSquareSize, effectiveSquareSize)
        }
      }

      // Use CSS pixel dimensions for gradients to avoid DPR/zoom seams
      const cssWidth = canvas.clientWidth || canvas.width
      const cssHeight = canvas.clientHeight || canvas.height
      // No solid/gradient background fill — canvas stays transparent

      // Exclude areas (e.g., forms, photo cards) by painting over with the base background
      if (excludeSelectors && excludeSelectors.length > 0) {
        const canvasRect = canvas.getBoundingClientRect()
        // Erase grid under excluded elements to make canvas fully transparent there
        excludeSelectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((el) => {
            const rect = (el as HTMLElement).getBoundingClientRect()
            // Expand mask to avoid subpixel gaps at edges (browser zoom / DPR rounding)
            const pad = 8 // CSS pixels
            const x = Math.floor(Math.max(0, rect.left - canvasRect.left - pad))
            const y = Math.floor(Math.max(0, rect.top - canvasRect.top - pad))
            const right = Math.ceil(Math.min(canvas.width, rect.right - canvasRect.left + pad))
            const bottom = Math.ceil(Math.min(canvas.height, rect.bottom - canvasRect.top + pad))
            const w = Math.max(0, right - x)
            const h = Math.max(0, bottom - y)
            if (w > 0 && h > 0) {
              ctx.save()
              ctx.globalCompositeOperation = 'destination-out'
              ctx.fillStyle = 'rgba(0,0,0,1)'
              ctx.fillRect(x, y, w, h)
              ctx.restore()
            }
          })
        })
      }
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)

      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + effectiveSquareSize) % effectiveSquareSize
          break
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + effectiveSquareSize) % effectiveSquareSize
          break
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + effectiveSquareSize) % effectiveSquareSize
          break
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + effectiveSquareSize) % effectiveSquareSize
          break
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + effectiveSquareSize) % effectiveSquareSize
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + effectiveSquareSize) % effectiveSquareSize
          break
      }

      drawGrid()
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
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    // Initial setup
    resizeCanvas()
    requestRef.current = requestAnimationFrame(updateAnimation)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [direction, speed, borderColor, hoverFillColor, hoveredSquare, squareSize, excludeSelectors])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full border-none block ${className}`}
    />
  )
}


