export interface WallhavenWallpaper {
  id: string
  url: string
  short_url: string
  views: number
  favorites: number
  source: string
  purity: 'sfw' | 'sketchy' | 'nsfw'
  category: 'general' | 'anime' | 'people'
  dimension_x: number
  dimension_y: number
  resolution: string
  ratio: string
  file_size: number
  file_type: string
  created_at: string
  colors: string[]
  path: string
  thumbs: {
    large: string
    original: string
    small: string
  }
}

export interface WallhavenSearchResponse {
  data: WallhavenWallpaper[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    query?: string | {
      id: number
      tag: string
    } | null
    seed?: string | null
  }
}

export interface WallhavenSearchParams {
  q?: string 
  categories?: string 
  purity?: string 
  sorting?: 'date_added' | 'relevance' | 'random' | 'views' | 'favorites' | 'toplist'
  order?: 'desc' | 'asc'
  topRange?: '1d' | '3d' | '1w' | '1M' | '3M' | '6M' | '1y'
  atleast?: string 
  resolutions?: string 
  ratios?: string 
  colors?: string 
  page?: number
  seed?: string 
}

export interface CategoryItem {
  id: string
  name: string
  nameEn: string
  imageUrl: string
  searchParams: WallhavenSearchParams
}