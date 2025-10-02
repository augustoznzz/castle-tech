'use client'

import { useEffect, useState } from 'react'

interface TypingEffectProps {
  speed?: number
  className?: string
  loopDelay?: number
}

export function TypingEffect({ speed = 50, className = '', loopDelay = 3000 }: TypingEffectProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  const codeLines = [
    "buy_in_castle_tech = False",
    "",
    "if not buy_in_castle_tech:",
    '    print("You won\'t have the best product and you will pay more.")',
    "else:",
    '    print("You made the best choice buying from Castle Tech!")',
    "",
    'print("\\nCastle Tech, the best store for selling tech products on the market!")'
  ]

  const currentText = codeLines[currentLine]

  useEffect(() => {
    if (currentLine < codeLines.length) {
      if (currentIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + currentText[currentIndex])
          setCurrentIndex(prev => prev + 1)
        }, speed)

        return () => clearTimeout(timeout)
      } else {
        // Move to next line
        const lineTimeout = setTimeout(() => {
          setCurrentLine(prev => prev + 1)
          setDisplayedText('')
          setCurrentIndex(0)
        }, 200) // Small delay between lines

        return () => clearTimeout(lineTimeout)
      }
    } else {
      setIsComplete(true)
      
      // Start loop after delay
      const loopTimeout = setTimeout(() => {
        setIsLooping(true)
        setDisplayedText('')
        setCurrentIndex(0)
        setCurrentLine(0)
        setIsComplete(false)
      }, loopDelay)

      return () => clearTimeout(loopTimeout)
    }
  }, [currentIndex, currentText, speed, loopDelay, currentLine, codeLines])

  // Reset loop state when starting new cycle
  useEffect(() => {
    if (isLooping && currentLine === 0 && currentIndex === 0) {
      setIsLooping(false)
    }
  }, [isLooping, currentLine, currentIndex])

  const getLineColor = (lineIndex: number, charIndex: number) => {
    const line = codeLines[lineIndex]
    if (!line) return 'text-foreground'
    
    // Check specific positions for better color accuracy
    const char = line[charIndex]
    const wordStart = charIndex === 0 || line[charIndex - 1] === ' ' || line[charIndex - 1] === '\t'
    
    // Keywords (if, else)
    if (line.startsWith('if') && charIndex < 2) {
      return 'text-yellow-400'
    }
    if (line.startsWith('else') && charIndex < 4) {
      return 'text-yellow-400'
    }
    
    // Variables (buy_in_castle_tech)
    if (line.includes('buy_in_castle_tech') && !line.includes('"')) {
      return 'text-accent'
    }
    
    // Functions (print)
    if (line.includes('print') && !line.includes('"')) {
      return 'text-blue-400'
    }
    
    // Strings (everything inside quotes)
    if (line.includes('"')) {
      const firstQuote = line.indexOf('"')
      const lastQuote = line.lastIndexOf('"')
      if (charIndex >= firstQuote && charIndex <= lastQuote) {
        return 'text-green-400'
      }
    }
    
    // Boolean values
    if (line.includes('False') || line.includes('True')) {
      const falseIndex = line.indexOf('False')
      const trueIndex = line.indexOf('True')
      if ((falseIndex !== -1 && charIndex >= falseIndex && charIndex < falseIndex + 5) ||
          (trueIndex !== -1 && charIndex >= trueIndex && charIndex < trueIndex + 4)) {
        return 'text-purple-400'
      }
    }
    
    // Operators and special characters
    if (char === '=' || char === '!' || char === ':' || char === '(' || char === ')') {
      return 'text-orange-400'
    }
    
    return 'text-foreground'
  }

  return (
    <div className={`font-mono text-xs ${className} bg-black/20 p-3 rounded border border-accent/20 min-h-[140px]`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-accent/10">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <span className="text-accent/70 text-xs">python</span>
      </div>
      
      {/* Line numbers */}
      <div className="flex">
        <div className="mr-4 text-accent/50 text-xs select-none">
          {codeLines.slice(0, currentLine).map((_, lineIndex) => (
            <div key={lineIndex} className="leading-5">
              {String(lineIndex + 1).padStart(2, ' ')}
            </div>
          ))}
          {currentLine < codeLines.length && (
            <div className="leading-5">
              {String(currentLine + 1).padStart(2, ' ')}
            </div>
          )}
        </div>
        
        {/* Code content */}
        <div className="flex-1">
          {codeLines.slice(0, currentLine).map((line, lineIndex) => (
            <div key={lineIndex} className="mb-0 leading-5">
              {line.split('').map((char, charIndex) => (
                <span 
                  key={charIndex} 
                  className={getLineColor(lineIndex, charIndex)}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
          
          {currentLine < codeLines.length && (
            <div className="mb-0 leading-5">
              {currentText.split('').slice(0, currentIndex).map((char, charIndex) => (
                <span 
                  key={charIndex} 
                  className={getLineColor(currentLine, charIndex)}
                >
                  {char}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
