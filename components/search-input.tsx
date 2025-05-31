// components/search-input.tsx
"use client"

import { useState, useCallback, useEffect } from "react"
import { Search, X, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface SearchInputProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchInput({ 
  onSearch, 
  placeholder = "Buscar wallpapers..." 
}: SearchInputProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setQuery("")
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }, [query, onSearch])

  return (
    <motion.form
      className="relative mb-8"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="relative">
        <motion.div
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`}
          animate={{ scale: isFocused ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="w-5 h-5" />
        </motion.div>
        
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-12 pr-12 transition-all duration-300 ${
            isFocused ? 'ring-2 ring-primary ring-offset-2 border-primary' : ''
          }`}
        />
        
        {query && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-xl hover:bg-muted/80"
              onClick={handleClear}
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Sugestões populares */}
      {!query && (
        <motion.div
          className="mt-4 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {['Natureza', 'Abstrato', 'Minimalista', 'Cidade'].map((suggestion) => (
            <motion.button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="px-4 py-2 bg-muted/50 hover:bg-muted text-sm rounded-full transition-all duration-200 hover:scale-105 font-medium flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-3 h-3" />
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.form>
  )
}