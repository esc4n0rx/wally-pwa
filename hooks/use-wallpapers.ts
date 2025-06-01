"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { wallhavenAPI } from '@/lib/wallhaven-api';
import { WallhavenWallpaper, WallhavenSearchParams } from '@/types/wallhaven';

interface UseWallpapersReturn {
  wallpapers: WallhavenWallpaper[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useWallpapers(searchParams: WallhavenSearchParams = {}): UseWallpapersReturn {
  const [wallpapers, setWallpapers] = useState<WallhavenWallpaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const currentSearchParams = useRef<WallhavenSearchParams>(searchParams);
  const isInitialLoad = useRef(true);

  const loadWallpapers = useCallback(async (page: number, append: boolean = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await wallhavenAPI.searchWallpapers({
        ...currentSearchParams.current,
        page,
      });

      const newWallpapers = response.data || [];

      if (append) {
        setWallpapers(prev => [...prev, ...newWallpapers]);
      } else {
        setWallpapers(newWallpapers);
      }

      setHasMore(page < (response.meta?.last_page || 1));
      setCurrentPage(page);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar wallpapers';
      setError(errorMessage);
      console.error('Erro ao carregar wallpapers:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);


  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadWallpapers(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, loadWallpapers]);


  const refresh = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    setWallpapers([]);
    loadWallpapers(1, false);
  }, [loadWallpapers]);


  useEffect(() => {
    const hasParamsChanged = JSON.stringify(currentSearchParams.current) !== JSON.stringify(searchParams);
    
    if (hasParamsChanged || isInitialLoad.current) {
      currentSearchParams.current = searchParams;
      isInitialLoad.current = false;
      
      setCurrentPage(1);
      setHasMore(true);
      setWallpapers([]);
      loadWallpapers(1, false);
    }
  }, [searchParams, loadWallpapers]);

  return {
    wallpapers,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}