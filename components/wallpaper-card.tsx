"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface WallpaperCardProps {
  wallpaper: {
    id: number
    title: string
    imageUrl: string
  }
  onClick?: () => void
}

export function WallpaperCard({ wallpaper, onClick }: WallpaperCardProps) {
  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-md bg-card border border-border/50 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[9/16]">
        <Image src={wallpaper.imageUrl || "/placeholder.svg"} alt={wallpaper.title} fill className="object-cover" />
      </div>
    </motion.div>
  )
}
