"use client"

import { useState } from "react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(false)

  return (
    <main className="min-h-screen pb-16">
      <div className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 font-display">Configurações</h1>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Personalize a aparência do aplicativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-mode">Modo escuro</Label>
                  <Switch
                    id="theme-mode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Gerencie suas notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Ativar notificações</Label>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sobre o App</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Wally - Wallpapers para seu dispositivo</p>
                <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <BottomNavbar />
    </main>
  )
}
