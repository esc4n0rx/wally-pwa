import { BottomNavbar } from "@/components/bottom-navbar"
import { CategoryGrid } from "@/components/category-grid"

export default function CategoriasPage() {
  return (
    <main className="min-h-screen pb-16">
      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 font-display">Categorias</h1>
        <CategoryGrid />
      </div>
      <BottomNavbar />
    </main>
  )
}
