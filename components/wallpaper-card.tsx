"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { WallhavenWallpaper } from "@/types/wallhaven";

interface WallpaperCardProps {
  wallpaper: WallhavenWallpaper;
  onClick?: () => void;
}

export function WallpaperCard({ wallpaper, onClick }: WallpaperCardProps) {
  // Verificações de segurança para evitar erros
  if (!wallpaper) {
    return null;
  }

  const formatViews = (views: number): string => {
    if (!views || views === 0) return '0';
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Valores padrão para propriedades que podem estar undefined
  const safeWallpaper = {
    id: wallpaper.id || 'unknown',
    views: wallpaper.views || 0,
    favorites: wallpaper.favorites || 0,
    resolution: wallpaper.resolution || 'N/A',
    category: wallpaper.category || 'uncategorized',
    // Usar thumbs.large como padrão, depois path, depois placeholder
    imageUrl: wallpaper.thumbs?.large || wallpaper.path || '/placeholder.svg',
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-md bg-card border border-border/50 cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[9/16]">
        <Image 
          src={safeWallpaper.imageUrl} 
          alt={`Wallpaper ${safeWallpaper.id}`} 
          fill 
          className="object-cover transition-transform duration-300 group-hover:scale-105" 
          sizes="(max-width: 768px) 50vw, 33vw"
          loading="lazy"
          onError={(e) => {
            // Fallback para placeholder se a imagem falhar
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {/* Overlay com informações */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{formatViews(safeWallpaper.views)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{safeWallpaper.favorites}</span>
              </div>
            </div>
            
            <div className="mt-1">
              <p className="text-white text-xs truncate">
                {safeWallpaper.resolution}
              </p>
              <p className="text-white/80 text-xs truncate capitalize">
                {safeWallpaper.category}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}