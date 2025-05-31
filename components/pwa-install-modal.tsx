// components/pwa-install-modal.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Smartphone, Share, Plus, Download, Chrome, MoreVertical, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PWAInstallModalProps {
  platform: 'ios' | 'android' | 'desktop' | 'unknown'
  onInstall: () => void
  onClose: () => void
  isRequired?: boolean
}

export function PWAInstallModal({ platform, onInstall, onClose, isRequired = false }: PWAInstallModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  
  const IOSTutorial = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          {isRequired ? (
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          ) : (
            <Share className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <h3 className="text-xl font-heading mb-2">
          {isRequired ? 'Instalação Obrigatória' : 'Instalar Wally'}
        </h3>
        
        <p className="text-muted-foreground text-sm">
          {isRequired 
            ? 'Para usar o Wally, você deve instalá-lo como um app'
            : 'Adicione o Wally à sua tela inicial para acesso rápido'
          }
        </p>
        
        {isRequired && (
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <p className="text-orange-700 dark:text-orange-300 text-xs">
              ⚠️ O app não funcionará pelo navegador. A instalação é necessária.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {currentStep === 1 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <p className="font-medium">Toque no botão "Compartilhar"</p>
              </div>
              
              <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Share className="w-5 h-5" />
                  <span className="text-sm">Na barra inferior do Safari</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              {!isRequired && (
                <Button variant="outline" onClick={onClose}>
                  Agora não
                </Button>
              )}
              <Button 
                onClick={() => setCurrentStep(2)} 
                className={`bg-primary ${!isRequired ? '' : 'w-full'}`}
              >
                Próximo
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">2</span>
                </div>
                <p className="font-medium">Toque em "Adicionar à Tela de Início"</p>
              </div>
              
              <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Adicionar à Tela de Início</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 text-xs text-center">
                ✅ Após a instalação, o app abrirá automaticamente
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Voltar
              </Button>
              <Button onClick={onInstall} className="bg-primary">
                Entendi
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )

  const AndroidTutorial = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          {isRequired ? (
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          ) : (
            <Download className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <h3 className="text-xl font-heading mb-2">
          {isRequired ? 'Instalação Obrigatória' : 'Instalar Wally'}
        </h3>
        
        <p className="text-muted-foreground text-sm">
          {isRequired 
            ? 'Para usar o Wally, você deve instalá-lo como um app'
            : 'Instale o app para uma experiência completa'
          }
        </p>
        
        {isRequired && (
          <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <p className="text-orange-700 dark:text-orange-300 text-xs">
              ⚠️ O app não funcionará pelo navegador. A instalação é necessária.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {currentStep === 1 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">1</span>
                </div>
                <p className="font-medium">Toque no menu do Chrome</p>
              </div>
              
              <div className="flex items-center justify-center bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <MoreVertical className="w-5 h-5" />
                  <span className="text-sm">3 pontos no canto superior direito</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              {!isRequired && (
                <Button variant="outline" onClick={onClose}>
                  Agora não
                </Button>
              )}
              <Button 
                onClick={() => setCurrentStep(2)} 
                className={`bg-primary ${!isRequired ? '' : 'w-full'}`}
              >
                Próximo
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">2</span>
                </div>
                <p className="font-medium">Toque em "Instalar app"</p>
              </div>
              
              <div className="flex items-center justify-center bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Instalar app ou Adicionar à tela inicial</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-300 text-xs text-center">
                📱 Você também pode ver um popup automático para instalar
              </p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Voltar
              </Button>
              <Button onClick={onInstall} className="bg-primary">
                Instalar Agora
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card border-t border-border sm:border sm:rounded-3xl p-6 w-full max-w-md sm:max-w-lg safe-area-bottom relative"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="w-6" />
            <div className="w-12 h-1 bg-muted rounded-full sm:hidden" />
            {!isRequired && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="w-6 h-6 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {platform === 'ios' ? <IOSTutorial /> : <AndroidTutorial />}
          
          {isRequired && (
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Esta validação garante a melhor experiência e performance do app
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}