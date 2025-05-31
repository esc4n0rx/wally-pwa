// app/page.tsx
"use client"

import { useState, useCallback } from "react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { SearchInput } from "@/components/search-input"
import { TypeAnimation } from "@/components/type-animation"
import { WallpaperGrid } from "@/components/wallpaper-grid"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <main className="min-h-dvh bg-gradient-to-br from-background via-background to-muted/20">
      {/* Container principal com safe areas mais agressivas */}
      <div 
        className="relative min-h-dvh"
        style={{
          /* Padding top mais agressivo para status bar + notch */
          paddingTop: `max(env(safe-area-inset-top), 60px)`,
          /* Padding bottom considerando navbar + safe area + margem extra */
          paddingBottom: `calc(max(env(safe-area-inset-bottom), 34px) + 140px)`,
        }}
      >
        <div className="container px-6 py-8">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6">
              <TypeAnimation 
                text="Wally" 
                className="text-5xl sm:text-6xl font-display text-transparent bg-gradient-to-r from-primary via-primary to-green-600 bg-clip-text" 
              />
            </div>
            
            <p className="text-muted-foreground text-center font-body max-w-sm">
              Descubra wallpapers incríveis para personalizar seu dispositivo
            </p>
          </div>
          
          <SearchInput onSearch={handleSearch} />
          <WallpaperGrid searchQuery={searchQuery} />
        </div>
      </div>
      
      <BottomNavbar />
    </main>
  )
}