"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export function SearchInput() {
  return (
    <motion.div
      className="relative mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="search"
        placeholder="Buscar wallpapers..."
        className="pl-10 rounded-full border-muted-foreground/20"
      />
    </motion.div>
  )
}
