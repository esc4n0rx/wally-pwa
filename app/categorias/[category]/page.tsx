import { BottomNavbar } from "@/components/bottom-navbar"
import { WallpaperGrid } from "@/components/wallpaper-grid"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Lista de categorias válidas
  const validCategories: Record<string, string> = {
    nature: "Natureza",
    abstract: "Abstrato",
    cities: "Cidades",
    animals: "Animais",
    minimalist: "Minimalista",
  }

  // Verificar se a categoria existe
  if (!validCategories[params.category]) {
    notFound()
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 font-display">{validCategories[params.category]}</h1>
        <WallpaperGrid />
      </div>
      <BottomNavbar />
    </main>
  )
}
