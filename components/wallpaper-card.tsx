"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Eye, Heart, Download } from "lucide-react"
import { WallhavenWallpaper } from "@/types/wallhaven"

interface WallpaperCardProps {
  wallpaper: WallhavenWallpaper
  onClick?: () => void
}

export function WallpaperCard({ wallpaper, onClick }: WallpaperCardProps) {
  if (!wallpaper) {
    return null
  }

  const formatViews = (views: number): string => {
    if (!views || views === 0) return '0'
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const getImageUrl = (): string => {
    if (wallpaper.path) {
      return wallpaper.path
    }
    
    if (wallpaper.thumbs?.original) {
      return wallpaper.thumbs.original
    }
    
    if (wallpaper.thumbs?.large) {
      return wallpaper.thumbs.large
    }
    
    if (wallpaper.thumbs?.small) {
      return wallpaper.thumbs.small
    }

    return '/placeholder.svg'
  }

  const safeWallpaper = {
    id: wallpaper.id || 'unknown',
    views: wallpaper.views || 0,
    favorites: wallpaper.favorites || 0,
    resolution: wallpaper.resolution || 'N/A',
    category: wallpaper.category || 'uncategorized',
    imageUrl: getImageUrl(),
  }

  return (
    <motion.div
      className="group relative rounded-3xl overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border/30 hover:border-primary/50 transition-all duration-300 cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
      layout
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        <Image 
          src={safeWallpaper.imageUrl} 
          alt={`Wallpaper ${safeWallpaper.id}`} 
          fill 
          className="object-cover transition-all duration-500 group-hover:scale-110" 
          sizes="(max-width: 768px) 50vw, 33vw"
          loading="lazy"
          quality={90} 
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder.svg'
          }}
        />
        

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        

        <motion.div 
          className="absolute top-3 left-3 right-3 flex justify-between items-start"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1">
            <span className="text-white/90 text-xs font-medium capitalize">
              {safeWallpaper.category}
            </span>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1">
            <span className="text-white/90 text-xs font-medium">
              {safeWallpaper.resolution}
            </span>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-3 left-3 right-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-full px-3 py-1">
                <Eye className="w-3 h-3 text-white/80" />
                <span className="text-white/90 text-xs font-medium">
                  {formatViews(safeWallpaper.views)}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-full px-3 py-1">
                <Heart className="w-3 h-3 text-white/80" />
                <span className="text-white/90 text-xs font-medium">
                  {safeWallpaper.favorites}
                </span>
              </div>
            </div>
            
            {/* Quick action button */}
            <motion.div
              className="bg-primary/90 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Download className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}