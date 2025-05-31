"use client";

import { useState, useEffect } from "react";
import { WallpaperCard } from "@/components/wallpaper-card";
import { WallpaperModal } from "@/components/wallpaper-modal";
import { WallpaperSkeleton } from "@/components/skeleton-loader";
import { ErrorBoundary } from "@/components/error-boundary";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { useWallpapers } from "@/hooks/use-wallpapers";
import { WallhavenWallpaper, WallhavenSearchParams } from "@/types/wallhaven";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WallpaperGridProps {
  searchQuery?: string;
  categoryParams?: WallhavenSearchParams; 
}

function WallpaperGridContent({ searchQuery, categoryParams }: WallpaperGridProps) {
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallhavenWallpaper | null>(null);
  
  const searchParams: WallhavenSearchParams = {
    ...categoryParams,
    ...(searchQuery && { q: searchQuery }),
    purity: categoryParams?.purity || "100",
    sorting: categoryParams?.sorting || "date_added",
    order: categoryParams?.order || "desc",
  };

  const { wallpapers, loading, error, hasMore, loadMore, refresh, retryCount } = useWallpapers(searchParams);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  if (error) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-12 text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle className="w-16 h-16 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar wallpapers</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Tentativa {retryCount} de 3
            </p>
          )}
          <div className="flex gap-2 justify-center">
            <Button onClick={refresh} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Tentar novamente
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {wallpapers.map((wallpaper, index) => {
            if (!wallpaper || !wallpaper.id) {
              return null;
            }

            return (
              <motion.div
                key={wallpaper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                layout
              >
                <WallpaperCard 
                  wallpaper={wallpaper} 
                  onClick={() => setSelectedWallpaper(wallpaper)} 
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {loading && (
          <WallpaperSkeleton />
        )}
      </div>

      {loading && wallpapers.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">
            Carregando mais wallpapers...
          </span>
        </div>
      )}

      {hasMore && !loading && <div ref={ref} className="h-10 mt-4" />}

      {!hasMore && wallpapers.length > 0 && (
        <motion.div 
          className="text-center py-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>Você viu todos os wallpapers disponíveis! 🎉</p>
        </motion.div>
      )}

      {!loading && wallpapers.length === 0 && !error && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-xl text-muted-foreground">Nenhum wallpaper encontrado</p>
          {categoryParams && (
            <p className="text-sm text-muted-foreground mt-2">
              Tente navegar para outras categorias
            </p>
          )}
        </motion.div>
      )}

      {selectedWallpaper && (
        <WallpaperModal 
          wallpaper={selectedWallpaper} 
          onClose={() => setSelectedWallpaper(null)} 
        />
      )}
    </>
  );
}

export function WallpaperGrid(props: WallpaperGridProps) {
  return (
    <ErrorBoundary>
      <WallpaperGridContent {...props} />
    </ErrorBoundary>
  );
}