// app/layout.tsx
import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Manrope } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { PWAInstallProvider } from "@/components/pwa-install-provider"
import { PWAServiceWorker } from "@/components/pwa-service-worker"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Wally - Wallpapers para seu dispositivo",
  description: "Encontre os melhores wallpapers para seu dispositivo móvel",
  manifest: "/manifest.json",
  generator: 'v0.dev',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wally",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: "#14532d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Wally" />
        <meta name="apple-mobile-web-app-title" content="Wally" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#14532d" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192x192.png" />
        
        {/* Splash Screens */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Prevent zoom on inputs */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      
      <body className={`${manrope.variable} font-sans bg-background text-foreground antialiased safe-area-inset`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="wally-theme">
          <PWAInstallProvider>
            <div className="min-h-screen">
              {children}
            </div>
            <PWAServiceWorker />
          </PWAInstallProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}