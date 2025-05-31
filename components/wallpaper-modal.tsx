"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WallpaperModalProps {
  wallpaper: {
    id: number
    title: string
    author: string
    resolution: string
    imageUrl: string
  }
  onClose: () => void
}

export function WallpaperModal({ wallpaper, onClose }: WallpaperModalProps) {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    // Salvar no localStorage
    const saved = localStorage.getItem("saved-wallpapers")
    const savedWallpapers = saved ? JSON.parse(saved) : []

    // Verificar se já está salvo
    const isAlreadySaved = savedWallpapers.some((w: any) => w.id === wallpaper.id)

    if (!isAlreadySaved) {
      savedWallpapers.push(wallpaper)
      localStorage.setItem("saved-wallpapers", JSON.stringify(savedWallpapers))
    }

    setIsSaved(true)
  }

  const handleDownload = () => {
    // Simulação de download
    const link = document.createElement("a")
    link.href = wallpaper.imageUrl
    link.download = `wallpaper-${wallpaper.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card border border-border rounded-xl overflow-hidden max-w-md w-full max-h-[90vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-background/50 backdrop-blur-sm rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="relative aspect-[9/16] max-h-[70vh]">
              <Image
                src={wallpaper.imageUrl || "/placeholder.svg"}
                alt={wallpaper.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-bold text-lg font-display">{wallpaper.title}</h3>
              <p className="text-sm text-muted-foreground">
                Por {wallpaper.author} • {wallpaper.resolution}
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-green-800 hover:bg-green-700" onClick={handleSave} disabled={isSaved}>
                <Heart className="mr-2 h-4 w-4" />
                {isSaved ? "Salvo" : "Salvar"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
