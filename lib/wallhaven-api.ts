import { WallhavenSearchResponse, WallhavenSearchParams, WallhavenWallpaper } from '@/types/wallhaven';

class WallhavenAPI {
  private baseUrl = '/api/wallhaven'; // Usar nossa API proxy

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    
    // Adicionar parâmetros da URL
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

  /**
   * Buscar wallpapers com parâmetros de pesquisa
   */
  async searchWallpapers(params: WallhavenSearchParams = {}): Promise<WallhavenSearchResponse> {
    const searchParams: Record<string, string> = {
      purity: params.purity || '100', // Apenas SFW por padrão
      sorting: params.sorting || 'date_added',
      order: params.order || 'desc',
      page: params.page?.toString() || '1',
    };

    // Adicionar outros parâmetros se fornecidos
    if (params.q) searchParams.q = params.q;
    if (params.categories) searchParams.categories = params.categories;
    if (params.atleast) searchParams.atleast = params.atleast;
    if (params.resolutions) searchParams.resolutions = params.resolutions;
    if (params.ratios) searchParams.ratios = params.ratios;
    if (params.colors) searchParams.colors = params.colors;
    if (params.topRange) searchParams.topRange = params.topRange;

    return this.makeRequest<WallhavenSearchResponse>('/search', searchParams);
  }

  /**
   * Obter wallpaper específico por ID
   */
  async getWallpaper(id: string): Promise<{ data: WallhavenWallpaper }> {
    return this.makeRequest<{ data: WallhavenWallpaper }>(`/wallpaper/${id}`);
  }

  /**
   * Download do wallpaper original
   */
  async downloadWallpaper(wallpaper: WallhavenWallpaper): Promise<void> {
    try {
      // Fazer requisição através de um proxy para evitar CORS
      const proxyUrl = `/api/wallhaven/download?url=${encodeURIComponent(wallpaper.path)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
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
      throw new Error('Falha ao baixar o wallpaper');
    }
  }
}

export const wallhavenAPI = new WallhavenAPI();