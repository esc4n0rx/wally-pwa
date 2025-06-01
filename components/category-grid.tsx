"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { categories } from "@/lib/categories"

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
              className="relative h-32 rounded-xl overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image 
                src={category.imageUrl} 
                alt={category.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index < 4} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute inset-0 flex items-end p-4">
                <div className="w-full">
                  <h3 className="text-white text-xl font-bold font-display mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    Explore wallpapers de {category.name.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="absolute top-3 right-3">
                <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1">
                  <span className="text-white/90 text-xs font-medium">
                    Categoria
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}