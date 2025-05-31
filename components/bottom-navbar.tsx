// components/bottom-navbar.tsx
"use client"

import { Home, Grid, Bookmark, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export function BottomNavbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Início",
      href: "/",
      icon: Home,
    },
    {
      name: "Categorias",
      href: "/categorias",
      icon: Grid,
    },
    {
      name: "Salvos",
      href: "/salvos",
      icon: Bookmark,
    },
    {
      name: "Configurações",
      href: "/configuracoes",
      icon: Settings,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-20 px-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative p-2">
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    initial={false}
                    transition={{ 
                      type: "spring", 
                      duration: 0.6, 
                      bounce: 0.2 
                    }}
                  />
                )}
                <item.icon className={`w-6 h-6 relative z-10 transition-transform duration-200 ${
                  isActive ? "scale-110" : "scale-100"
                }`} />
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                isActive ? "font-semibold" : "font-normal"
              }`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}