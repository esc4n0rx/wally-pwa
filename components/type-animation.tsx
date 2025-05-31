// components/type-animation.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface TypeAnimationProps {
  text: string
  className?: string
  speed?: number
}

export function TypeAnimation({ text, className, speed = 150 }: TypeAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      // Hide cursor after animation completes
      const timeout = setTimeout(() => {
        setShowCursor(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [index, text, speed])

  return (
    <div className="relative">
      <motion.h1 
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {displayText}
        {showCursor && (
          <motion.span
            className="inline-block ml-1 w-1 bg-current"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          >
            |
          </motion.span>
        )}
      </motion.h1>
    </div>
  )
}