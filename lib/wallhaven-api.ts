import { WallhavenSearchResponse, WallhavenSearchParams, WallhavenWallpaper } from '@/types/wallhaven';

class WallhavenAPI {
  private baseUrl = '/api/wallhaven';

  private async makeRequest<T>(
    endpoint: string, 
    params?: Record<string, string>, 
    signal?: AbortSignal
  ): Promise<T> {
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
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new Error('Muitas requisições. Aguarde um momento antes de tentar novamente.');
        }
        
        throw new Error(errorData.error || `API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      
      console.error('Wallhaven API Error:', error);
      throw error;
    }
  }

  async searchWallpapers(
    params: WallhavenSearchParams = {}, 
    signal?: AbortSignal
  ): Promise<WallhavenSearchResponse> {
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

    return this.makeRequest<WallhavenSearchResponse>('/search', searchParams, signal);
  }

  async getWallpaper(id: string, signal?: AbortSignal): Promise<{ data: WallhavenWallpaper }> {
    return this.makeRequest<{ data: WallhavenWallpaper }>(`/wallpaper/${id}`, undefined, signal);
  }

  async downloadWallpaper(wallpaper: WallhavenWallpaper): Promise<void> {
    try {
      const proxyUrl = `/api/wallhaven/download?url=${encodeURIComponent(wallpaper.path)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Muitos downloads. Aguarde alguns minutos antes de tentar novamente.');
        }
        throw new Error('Falha ao baixar o wallpaper');
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
    } catch (error) {
      console.error('Erro ao baixar wallpaper:', error);
      throw error;
    }
  }
}

export const wallhavenAPI = new WallhavenAPI();