// app/categorias/page.tsx
import { BottomNavbar } from "@/components/bottom-navbar"
import { CategoryGrid } from "@/components/category-grid"

export default function CategoriasPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-br from-background via-background to-muted/20">
      {/* Container principal que respeita safe areas */}
      <div 
        className="relative"
        style={{
          paddingTop: `max(var(--safe-area-inset-top), 20px)`,
          paddingBottom: `calc(100px + var(--safe-area-inset-bottom))`,
        }}
      >
        <div className="container px-6 py-8">
          <h1 className="text-3xl font-bold mb-6 font-display text-center">
            Categorias
          </h1>
          <CategoryGrid />
        </div>
      </div>
      
      <BottomNavbar />
    </main>
  )
}