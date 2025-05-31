// app/salvos/page.tsx
"use client"

import { useEffect, useState } from "react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { WallpaperCard } from "@/components/wallpaper-card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SalvosPage() {
  const [savedWallpapers, setSavedWallpapers] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("saved-wallpapers")
    if (saved) {
      setSavedWallpapers(JSON.parse(saved))
    }
  }, [])

  return (
    <main className="min-h-dvh bg-gradient-to-br from-background via-background to-muted/20">
      {/* Container principal com safe areas mais agressivas */}
      <div 
        className="relative min-h-dvh"
        style={{
          paddingTop: `max(env(safe-area-inset-top), 60px)`,
          paddingBottom: `calc(max(env(safe-area-inset-bottom), 34px) + 140px)`,
        }}
      >
        <div className="container px-6 py-8">
          <h1 className="text-3xl font-bold mb-6 font-display text-center">
            Wallpapers Salvos
          </h1>

          {savedWallpapers.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {savedWallpapers.map((wallpaper) => (
                <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl mb-4">Você ainda não salvou nenhum wallpaper 🥲</p>
              <Button asChild className="bg-green-800 hover:bg-green-700">
                <Link href="/">Explorar agora</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <BottomNavbar />
    </main>
  )
}