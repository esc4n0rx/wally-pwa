"use client"

import { useEffect, useState } from "react"

interface TypeAnimationProps {
  text: string
  className?: string
  speed?: number
}

export function TypeAnimation({ text, className, speed = 100 }: TypeAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [index, text, speed])

  return <h1 className={className}>{displayText}</h1>
}
