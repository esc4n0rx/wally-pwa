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
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
