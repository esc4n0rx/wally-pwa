// app/configuracoes/page.tsx
"use client"

import { useState } from "react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { usePWAInstall } from "@/components/pwa-install-provider"
import { Moon, Sun, Bell, Download, Info, Palette } from "lucide-react"

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { showInstallPrompt, isInstalled } = usePWAInstall()
  const [notifications, setNotifications] = useState(false)

  const settingsCards = [
    {
      icon: Palette,
      title: "Aparência",
      description: "Personalize a aparência do aplicativo",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-mode" className="flex items-center space-x-2">
              {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>Modo {theme === "dark" ? "escuro" : "claro"}</span>
            </Label>
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Gerencie suas notificações",
      content: (
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Ativar notificações</span>
          </Label>
          <Switch 
            id="notifications" 
            checked={notifications} 
            onCheckedChange={setNotifications} 
          />
        </div>
      ),
    },
    {
      icon: Download,
      title: "Instalação",
      description: "Instale o app na sua tela inicial",
      content: (
        <div className="space-y-3">
          {!isInstalled ? (
            <Button 
              onClick={showInstallPrompt}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Instalar App
            </Button>
          ) : (
            <div className="text-center py-2">
              <div className="text-green-600 font-medium">✓ App já está instalado</div>
              <p className="text-sm text-muted-foreground mt-1">
                Obrigado por usar o Wally!
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      icon: Info,
      title: "Sobre o App",
      description: "Informações sobre o Wally",
      content: (
        <div className="space-y-3">
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-heading text-lg">Wally</h3>
            <p className="text-sm text-muted-foreground">Wallpapers para seu dispositivo</p>
            <p className="text-xs text-muted-foreground mt-2">Versão 1.0.0</p>
          </div>
          
          <div className="pt-3 border-t border-border space-y-2">
            <p className="text-xs text-muted-foreground">
              Feito com ❤️ para você encontrar os melhores wallpapers
            </p>
          </div>
        </div>
      ),
    },
  ]

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-display mb-8 text-center">
              Configurações
            </h1>
          </motion.div>

          <div className="space-y-6 max-w-md mx-auto">
            {settingsCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <card.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-heading">{card.title}</div>
                        <CardDescription className="text-xs">
                          {card.description}
                        </CardDescription>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {card.content}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavbar />
    </main>
  )
}