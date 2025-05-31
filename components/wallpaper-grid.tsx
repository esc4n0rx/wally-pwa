"use client";

import { useState, useEffect } from "react";
import { WallpaperCard } from "@/components/wallpaper-card";
import { WallpaperModal } from "@/components/wallpaper-modal";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useWallpapers } from "@/hooks/use-wallpapers";
import { WallhavenWallpaper } from "@/types/wallhaven";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WallpaperGridProps {
  searchQuery?: string;
}

export function WallpaperGrid({ searchQuery }: WallpaperGridProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallhavenWallpaper | null>(null);
  
  // Configurar parâmetros de busca de forma estável
  const searchParams = {
    q: searchQuery || undefined,
    purity: "100" as const,
    sorting: "date_added" as const,
    order: "desc" as const,
  };

  const { wallpapers, loading, error, hasMore, loadMore, refresh } = useWallpapers(searchParams);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Effect para trigger do scroll infinito
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar wallpapers</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refresh} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {wallpapers.map((wallpaper, index) => {
          // Verificação de segurança básica
          if (!wallpaper || !wallpaper.id) {
            return null;
          }

          return (
            <motion.div
              key={wallpaper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
            >
              <WallpaperCard 
                wallpaper={wallpaper} 
                onClick={() => setSelectedWallpaper(wallpaper)} 
              />
            </motion.div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Elemento de observação para o scroll infinito */}
      {hasMore && !loading && <div ref={ref} className="h-10 mt-4" />}

      {/* Mensagem quando não há mais wallpapers */}
      {!hasMore && wallpapers.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Você viu todos os wallpapers disponíveis! 🎉</p>
        </div>
      )}

      {/* Mensagem quando não há wallpapers */}
      {!loading && wallpapers.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Nenhum wallpaper encontrado</p>
        </div>
      )}

      {/* Modal para visualização do wallpaper */}
      {selectedWallpaper && (
        <WallpaperModal 
          wallpaper={selectedWallpaper} 
          onClose={() => setSelectedWallpaper(null)} 
        />
      )}
    </>
  );
}