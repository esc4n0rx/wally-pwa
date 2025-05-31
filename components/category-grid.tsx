"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

const categories = [
  {
    id: "nature",
    name: "Natureza",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Natureza",
  },
  {
    id: "abstract",
    name: "Abstrato",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Abstrato",
  },
  {
    id: "cities",
    name: "Cidades",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Cidades",
  },
  {
    id: "animals",
    name: "Animais",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Animais",
  },
  {
    id: "minimalist",
    name: "Minimalista",
    imageUrl: "/placeholder.svg?height=300&width=600&text=Minimalista",
  },
]

export function CategoryGrid() {
  return (
    <div className="grid gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link href={`/categorias/${category.id}`}>
            <motion.div
              className="relative h-32 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image src={category.imageUrl || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-bold font-display">{category.name}</h3>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
