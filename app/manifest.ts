import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wally - Wallpapers para seu dispositivo",
    short_name: "Wally",
    description: "Encontre os melhores wallpapers para seu dispositivo móvel",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#14532d",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  }
}
