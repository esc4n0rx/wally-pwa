import { BottomNavbar } from "@/components/bottom-navbar"
import { SearchInput } from "@/components/search-input"
import { TypeAnimation } from "@/components/type-animation"
import { WallpaperGrid } from "@/components/wallpaper-grid"

export default function HomePage() {
  return (
    <main className="min-h-screen pb-16">
      <div className="container px-4 py-6">
        <div className="flex justify-center mb-6">
          <TypeAnimation text="Wally" className="text-4xl font-bold text-white font-display" />
        </div>
        <SearchInput />
        <WallpaperGrid />
      </div>
      <BottomNavbar />
    </main>
  )
}
