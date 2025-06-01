import { CategoryItem } from '@/types/wallhaven'

export const categories: CategoryItem[] = [
  {
    id: 'anime',
    name: 'Anime',
    nameEn: 'anime',
    imageUrl: '/categories/anime.png',
    searchParams: {
      categories: '010',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
    }
  },
  {
    id: 'nature',
    name: 'Natureza',
    nameEn: 'nature',
    imageUrl: '/categories/nature.png',
    searchParams: {
      q: 'nature landscape',
      categories: '100',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
    }
  },
  {
    id: 'abstract',
    name: 'Abstrato',
    nameEn: 'abstract',
    imageUrl: '/categories/abstract.png',
    searchParams: {
      q: 'abstract',
      categories: '100',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
    }
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    nameEn: 'minimal',
    imageUrl: '/categories/minimal.png',
    searchParams: {
      q: 'minimal minimalist',
      categories: '100',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    nameEn: 'cyberpunk',
    imageUrl: '/categories/cyberpunk.png',
    searchParams: {
      q: 'cyberpunk futuristic neon',
      categories: '100',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
    }
  },
  {
    id: 'space',
    name: 'Espaço',
    nameEn: 'space',
    imageUrl: '/categories/space.png',
    searchParams: {
      q: 'space galaxy stars universe',
      categories: '100',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
    }
  },
  {
    id: 'cars',
    name: 'Carros',
    nameEn: 'cars',
    imageUrl: '/categories/cars.png',
    searchParams: {
      q: 'car automobile vehicle',
      categories: '100',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
    }
  },
  {
    id: 'dark',
    name: 'Escuro',
    nameEn: 'dark',
    imageUrl: '/categories/dark.png',
    searchParams: {
      q: 'dark black amoled',
      categories: '100',
      purity: '100',
      sorting: 'favorites',
      order: 'desc',
      colors: '000000',
    }
  }
]

export function getCategoryById(id: string): CategoryItem | undefined {
  return categories.find(category => category.id === id)
}

export function getCategoryByNameEn(nameEn: string): CategoryItem | undefined {
  return categories.find(category => category.nameEn === nameEn)
}