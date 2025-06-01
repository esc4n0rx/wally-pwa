
import { WallhavenSearchResponse, WallhavenSearchParams, WallhavenWallpaper } from '@/types/wallhaven';

class WallhavenAPI {
  private baseUrl = '/api/wallhaven'; 

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Wallhaven API Error:', error);
      throw error;
    }
  }

  async searchWallpapers(params: WallhavenSearchParams = {}): Promise<WallhavenSearchResponse> {
    const searchParams: Record<string, string> = {
      purity: params.purity || '100', 
      sorting: params.sorting || 'date_added',
      order: params.order || 'desc',
      page: params.page?.toString() || '1',
    };


    if (params.q) searchParams.q = params.q;
    if (params.categories) searchParams.categories = params.categories;
    if (params.atleast) searchParams.atleast = params.atleast;
    if (params.resolutions) searchParams.resolutions = params.resolutions;
    if (params.ratios) searchParams.ratios = params.ratios;
    if (params.colors) searchParams.colors = params.colors;
    if (params.topRange) searchParams.topRange = params.topRange;

    return this.makeRequest<WallhavenSearchResponse>('/search', searchParams);
  }

  async getWallpaper(id: string): Promise<{ data: WallhavenWallpaper }> {
    return this.makeRequest<{ data: WallhavenWallpaper }>(`/wallpaper/${id}`);
  }

  async downloadWallpaper(wallpaper: WallhavenWallpaper): Promise<void> {
    try {

      const response = await fetch(wallpaper.path, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*',
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao baixar o wallpaper diretamente');
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
      console.error('Erro no download direto, tentando via proxy:', error);
      
      try {

        const proxyUrl = `/api/wallhaven/download?url=${encodeURIComponent(wallpaper.path)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error('Falha no download via proxy');
        }
        
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wallhaven-${wallpaper.id}.${wallpaper.file_type.split('/')[1]}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
      } catch (proxyError) {
        console.error('Erro no proxy, abrindo em nova aba:', proxyError);
        
        window.open(wallpaper.path, '_blank', 'noopener,noreferrer');
      }
    }
  }
}

export const wallhavenAPI = new WallhavenAPI();