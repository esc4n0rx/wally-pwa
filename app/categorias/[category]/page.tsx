import { BottomNavbar } from "@/components/bottom-navbar"
import { WallpaperGrid } from "@/components/wallpaper-grid"
import { getCategoryById } from "@/lib/categories"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{ category: string }>; 
}

export default async function CategoryPage({ params }: CategoryPageProps) {

  const { category } = await params;
  const categoryData = getCategoryById(category);
  
  if (!categoryData) {
    notFound();
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
              {categoryData.name}
            </h1>
            <p className="text-muted-foreground">
              Wallpapers selecionados de {categoryData.name.toLowerCase()}
            </p>
          </div>
          
          <WallpaperGrid 
            categoryParams={categoryData.searchParams}
          />
        </div>
      </div>
      <BottomNavbar />
    </main>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params; 
  const categoryData = getCategoryById(category);
  
  if (!categoryData) {
    return {
      title: 'Categoria não encontrada - Wally',
    }
  }

  return {
    title: `${categoryData.name} - Wallpapers | Wally`,
    description: `Explore os melhores wallpapers de ${categoryData.name.toLowerCase()} para seu dispositivo`,
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