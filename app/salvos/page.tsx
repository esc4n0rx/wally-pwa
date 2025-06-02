// app/salvos/page.tsx (versão atualizada)
"use client"

import { useEffect, useState } from "react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { WallpaperCard } from "@/components/wallpaper-card"
import { SavedWallpaperModal } from "@/components/saved-wallpaper-modal"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { WallhavenWallpaper } from "@/types/wallhaven"
import Link from "next/link"

export default function SalvosPage() {
  const [savedWallpapers, setSavedWallpapers] = useState<WallhavenWallpaper[]>([])
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallhavenWallpaper | null>(null)

  const loadSavedWallpapers = () => {
    try {
      const saved = localStorage.getItem("saved-wallpapers")
      if (saved) {
        setSavedWallpapers(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Erro ao carregar wallpapers salvos:", error)
      setSavedWallpapers([])
    }
  }

  useEffect(() => {
    loadSavedWallpapers()
    
    // Listener para detectar mudanças no localStorage (caso o usuário tenha múltiplas abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "saved-wallpapers") {
        loadSavedWallpapers()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleWallpaperClick = (wallpaper: WallhavenWallpaper) => {
    setSelectedWallpaper(wallpaper)
  }

  const handleRemoveWallpaper = (wallpaperId: string) => {
    try {
      const updatedWallpapers = savedWallpapers.filter(w => w.id !== wallpaperId)
      setSavedWallpapers(updatedWallpapers)
      localStorage.setItem("saved-wallpapers", JSON.stringify(updatedWallpapers))
      
      // Se o wallpaper removido estava selecionado, fechar o modal
      if (selectedWallpaper?.id === wallpaperId) {
        setSelectedWallpaper(null)
      }
    } catch (error) {
      console.error("Erro ao remover wallpaper:", error)
    }
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-background via-background to-muted/20">
      <div 
        className="relative min-h-dvh"
        style={{
          paddingTop: `max(env(safe-area-inset-top), 60px)`,
          paddingBottom: `calc(max(env(safe-area-inset-bottom), 34px) + 140px)`,
        }}
      >
        <div className="container px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 font-display text-center">
              Wallpapers Salvos
            </h1>
            {savedWallpapers.length > 0 && (
              <p className="text-muted-foreground text-center mb-6">
                {savedWallpapers.length} wallpaper{savedWallpapers.length !== 1 ? 's' : ''} salvo{savedWallpapers.length !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {savedWallpapers.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AnimatePresence>
                {savedWallpapers.map((wallpaper, index) => (
                  <motion.div
                    key={wallpaper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      exit: { duration: 0.2 }
                    }}
                    layout
                  >
                    <WallpaperCard 
                      wallpaper={wallpaper} 
                      onClick={() => handleWallpaperClick(wallpaper)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🖼️</div>
              <h2 className="text-xl mb-4 font-heading">
                Nenhum wallpaper salvo ainda
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Explore nossa coleção e salve seus wallpapers favoritos para acessá-los rapidamente
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/">
                  Explorar wallpapers
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <BottomNavbar />

      {/* Modal de visualização com opções */}
      {selectedWallpaper && (
        <SavedWallpaperModal
          wallpaper={selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          onRemove={handleRemoveWallpaper}
        />
      )}
    </main>
  )
}