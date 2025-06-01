import { BottomNavbar } from "@/components/bottom-navbar"
import { WallpaperGrid } from "@/components/wallpaper-grid"
import { getCategoryById } from "@/lib/categories"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryById(params.category)
  
  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-background via-background to-muted/20">
      <div 
        className="relative min-h-dvh"
        style={{
          paddingTop: `max(env(safe-area-inset-top), 60px)`,
          paddingBottom: `calc(max(env(safe-area-inset-bottom), 34px) + 140px)`,
        }}
      >
        <div className="container px-4 py-6">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2 font-display">
              {category.name}
            </h1>
            <p className="text-muted-foreground">
              Wallpapers selecionados de {category.name.toLowerCase()}
            </p>
          </div>
          
          <WallpaperGrid 
            categoryParams={category.searchParams}
          />
        </div>
      </div>
      <BottomNavbar />
    </main>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = getCategoryById(params.category)
  
  if (!category) {
    return {
      title: 'Categoria não encontrada - Wally',
    }
  }

  return {
    title: `${category.name} - Wallpapers | Wally`,
    description: `Explore os melhores wallpapers de ${category.name.toLowerCase()} para seu dispositivo`,
  }
}

export async function generateStaticParams() {
  return [
    { category: 'anime' },
    { category: 'nature' },
    { category: 'abstract' },
    { category: 'minimal' },
    { category: 'cyberpunk' },
    { category: 'space' },
    { category: 'cars' },
    { category: 'dark' },
  ]
}