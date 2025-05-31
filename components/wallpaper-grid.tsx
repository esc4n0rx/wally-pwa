"use client"

import { useState, useEffect } from "react"
import { WallpaperCard } from "@/components/wallpaper-card"
import { WallpaperModal } from "@/components/wallpaper-modal"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

// Dados simulados para os wallpapers
const generateWallpapers = (start: number, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    title: `Wallpaper ${start + i}`,
    author: `Autor ${((start + i) % 5) + 1}`,
    resolution: "1080x1920",
    imageUrl: `/placeholder.svg?height=1920&width=1080&text=Wallpaper+${start + i}`,
  }))
}

export function WallpaperGrid() {
  const [wallpapers, setWallpapers] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [selectedWallpaper, setSelectedWallpaper] = useState<any | null>(null)
  const { ref, inView } = useInView()

  // Carregar wallpapers iniciais
  useEffect(() => {
    setWallpapers(generateWallpapers(1, 10))
  }, [])

  // Carregar mais wallpapers quando o usuário rolar até o final
  useEffect(() => {
    if (inView) {
      const newWallpapers = generateWallpapers(page * 10 + 1, 10)
      setWallpapers((prev) => [...prev, ...newWallpapers])
      setPage((prev) => prev + 1)
    }
  }, [inView, page])

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {wallpapers.map((wallpaper, index) => (
          <motion.div
            key={wallpaper.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
          >
            <WallpaperCard wallpaper={wallpaper} onClick={() => setSelectedWallpaper(wallpaper)} />
          </motion.div>
        ))}
      </div>

      {/* Elemento de observação para o scroll infinito */}
      <div ref={ref} className="h-10 mt-4" />

      {/* Modal para visualização do wallpaper */}
      {selectedWallpaper && <WallpaperModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />}
    </>
  )
}
