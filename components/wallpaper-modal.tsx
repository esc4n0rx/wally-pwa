"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Download, Eye, Calendar, Monitor, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WallhavenWallpaper } from "@/types/wallhaven";
import { wallhavenAPI } from "@/lib/wallhaven-api";

interface WallpaperModalProps {
  wallpaper: WallhavenWallpaper;
  onClose: () => void;
}

export function WallpaperModal({ wallpaper, onClose }: WallpaperModalProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSave = () => {
    try {
      const saved = localStorage.getItem("saved-wallpapers");
      const savedWallpapers = saved ? JSON.parse(saved) : [];

      const isAlreadySaved = savedWallpapers.some((w: WallhavenWallpaper) => w.id === wallpaper.id);

      if (!isAlreadySaved) {
        savedWallpapers.push(wallpaper);
        localStorage.setItem("saved-wallpapers", JSON.stringify(savedWallpapers));
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Erro ao salvar wallpaper:", error);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(wallpaper.path);
      
      if (!response.ok) {
        throw new Error('Falha ao baixar o wallpaper');
      }
      
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileExtension = wallpaper.file_type?.split('/')[1] || 'jpg';
      link.download = `wallhaven-${wallpaper.id}.${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Erro ao baixar wallpaper:", error);
      
      try {
        window.open(wallpaper.path, '_blank');
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const previewImage = wallpaper.path || wallpaper.thumbs?.original || '/placeholder.svg';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-card border border-border rounded-xl overflow-hidden max-w-sm w-full max-h-[85vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-background/50 backdrop-blur-sm rounded-full w-8 h-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="relative aspect-[9/16] max-h-[40vh]">
              <Image
                src={previewImage}
                alt={`Wallpaper ${wallpaper.id}`}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {wallpaper.category}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs">{wallpaper.views.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Monitor className="w-3 h-3 text-muted-foreground" />
                  <span>{wallpaper.resolution}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{formatDate(wallpaper.created_at)}</span>
                </div>
              </div>
            </div>

            {wallpaper.colors && wallpaper.colors.length > 0 && (
              <div>
                <h4 className="text-xs font-medium mb-2 flex items-center">
                  <Palette className="w-3 h-3 mr-1" />
                  Cores
                </h4>
                <div className="flex flex-wrap gap-1">
                  {wallpaper.colors.slice(0, 6).map((color, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-1"
                    >
                      <div 
                        className="w-3 h-3 rounded border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <div>Tipo: {wallpaper.file_type}</div>
              <div>Tamanho: {formatFileSize(wallpaper.file_size)}</div>
              <div>Favoritos: {wallpaper.favorites}</div>
              <div>Dimensões: {wallpaper.dimension_x}x{wallpaper.dimension_y}</div>
            </div>
          </div>

          <div className="p-4 pt-2 border-t border-border bg-card">
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-green-800 hover:bg-green-700 h-10" 
                onClick={handleSave} 
                disabled={isSaved}
              >
                <Heart className="mr-2 h-4 w-4" />
                {isSaved ? "Salvo" : "Salvar"}
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 h-10" 
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Baixando..." : "Download"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}