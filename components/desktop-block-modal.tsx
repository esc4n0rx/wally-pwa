"use client"

import { motion } from "framer-motion"
import { Smartphone, Monitor, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function DesktopBlockModal() {
  const [showQR, setShowQR] = useState(false)

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4">
      <motion.div
        className="bg-card border border-border rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <motion.div
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative mb-4">
            <Monitor className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
            <motion.div
              className="absolute -bottom-1 -right-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-white text-lg">❌</span>
              </div>
            </motion.div>
          </div>
          
          <h1 className="text-3xl font-display mb-3 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Wally
          </h1>
          
          <h2 className="text-xl font-heading mb-2">
            App Exclusivo para Mobile
          </h2>
          
          <p className="text-muted-foreground mb-6">
            O Wally foi desenvolvido especialmente para dispositivos móveis, 
            proporcionando a melhor experiência para encontrar e definir wallpapers.
          </p>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-muted/50 rounded-2xl p-4">
            <Smartphone className="w-8 h-8 mx-auto text-primary mb-2" />
            <h3 className="font-heading mb-2">Como acessar</h3>
            <p className="text-sm text-muted-foreground">
              Acesse este endereço no seu smartphone ou tablet para a experiência completa
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowQR(!showQR)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQR ? 'Ocultar QR' : 'Mostrar QR Code'}
            </Button>
            
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
              }}
            >
              📋 Copiar Link
            </Button>
          </div>

          {showQR && (
            <motion.div
              className="mt-4 p-4 bg-white rounded-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-sm text-gray-600 text-center px-2">
                  QR Code para<br />
                  {window.location.href}
                </span>
              </div>
            </motion.div>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Dica:</strong> Adicione à tela inicial do seu celular para acesso rápido
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}