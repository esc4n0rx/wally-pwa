// components/pwa-install-provider.tsx (versão final)
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { PWAInstallModal } from "./pwa-install-modal"
import { DesktopBlockModal } from "./desktop-block-modal"
import { PWALoadingScreen } from "./pwa-loading-screen"

interface PWAInstallContextType {
  isInstallable: boolean
  isInstalled: boolean
  platform: 'ios' | 'android' | 'desktop' | 'unknown'
  showInstallPrompt: () => void
  isBlocked: boolean
  isLoading: boolean
}

const PWAInstallContext = createContext<PWAInstallContextType | null>(null)

export function usePWAInstall() {
  const context = useContext(PWAInstallContext)
  if (!context) {
    throw new Error('usePWAInstall must be used within PWAInstallProvider')
  }
  return context
}

interface PWAInstallProviderProps {
  children: React.ReactNode
}

export function PWAInstallProvider({ children }: PWAInstallProviderProps) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown')
  const [showModal, setShowModal] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  // Detectar plataforma e validar instalação
  useEffect(() => {
    const initializePWA = async () => {
      try {
        // Detectar plataforma
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobile = /mobi|android|iphone|ipad|ipod/i.test(userAgent)
        
        let detectedPlatform: 'ios' | 'android' | 'desktop' | 'unknown'
        
        if (!isMobile) {
          detectedPlatform = 'desktop'
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
          detectedPlatform = 'ios'
        } else if (/android/.test(userAgent)) {
          detectedPlatform = 'android'
        } else {
          detectedPlatform = 'unknown'
        }
        
        setPlatform(detectedPlatform)
        
        // Bloquear desktop imediatamente
        if (detectedPlatform === 'desktop') {
          setIsBlocked(true)
          setIsLoading(false)
          return
        }
        
        // Aguardar um pouco para permitir que o DOM se estabilize
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificar se está instalado como PWA
        const checkIfInstalled = () => {
          // PWA instalado (modo standalone)
          if (window.matchMedia('(display-mode: standalone)').matches) {
            return true
          }
          
          // iOS Safari PWA
          if ((window.navigator as any).standalone === true) {
            return true
          }
          
          // Android PWA - verificar se está em modo app
          if (window.matchMedia('(display-mode: fullscreen)').matches) {
            return true
          }
          
          // Verificar se está sendo executado em um contexto de app
          if (document.referrer.includes('android-app://')) {
            return true
          }
          
          // Verificar user agent para detectar PWA
          if (navigator.userAgent.includes('wv')) {
            return true
          }
          
          return false
        }

        const installed = checkIfInstalled()
        setIsInstalled(installed)
        
        // Se não estiver instalado, mostrar modal obrigatório
        if (!installed) {
          setIsBlocked(true)
          setShowModal(true)
        }
        
      } catch (error) {
        console.error('Erro ao inicializar PWA:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializePWA()
  }, [])

  // Listener para beforeinstallprompt (Android)
  useEffect(() => {
    if (platform !== 'android') return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
   }

   window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

   return () => {
     window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
   }
 }, [platform])

 // Listener para quando o app é instalado
 useEffect(() => {
   const handleAppInstalled = () => {
     setIsInstalled(true)
     setIsBlocked(false)
     setShowModal(false)
     setDeferredPrompt(null)
     setIsInstallable(false)
     
     // Recarregar a página para garantir que está rodando como PWA
     setTimeout(() => {
       window.location.reload()
     }, 1000)
   }

   window.addEventListener('appinstalled', handleAppInstalled)

   return () => {
     window.removeEventListener('appinstalled', handleAppInstalled)
   }
 }, [])

 // Verificar periodicamente se foi instalado (especialmente para iOS)
 useEffect(() => {
   if (platform !== 'ios' || isInstalled || isLoading) return

   const checkInstallation = setInterval(() => {
     const isNowInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true

     if (isNowInstalled) {
       setIsInstalled(true)
       setIsBlocked(false)
       setShowModal(false)
       clearInterval(checkInstallation)
       
       // Recarregar para garantir contexto PWA
       setTimeout(() => {
         window.location.reload()
       }, 1000)
     }
   }, 2000)

   return () => clearInterval(checkInstallation)
 }, [platform, isInstalled, isLoading])

 const showInstallPrompt = () => {
   setShowModal(true)
 }

 const handleInstallPrompt = async () => {
   if (platform === 'android' && deferredPrompt) {
     try {
       deferredPrompt.prompt()
       const { outcome } = await deferredPrompt.userChoice
       
       if (outcome === 'accepted') {
         setIsInstalled(true)
         setIsBlocked(false)
         setShowModal(false)
       }
       
       setDeferredPrompt(null)
       setIsInstallable(false)
     } catch (error) {
       console.error('Erro ao instalar PWA:', error)
     }
   }
 }

 const handleCloseModal = () => {
   // Não permitir fechar se não estiver instalado (modal obrigatório)
   if (!isInstalled && platform !== 'desktop') {
     return
   }
   setShowModal(false)
 }

 // Mostrar loading enquanto valida
 if (isLoading) {
   return <PWALoadingScreen />
 }

 return (
   <PWAInstallContext.Provider value={{
     isInstallable,
     isInstalled,
     platform,
     showInstallPrompt,
     isBlocked,
     isLoading
   }}>
     {/* Renderizar conteúdo apenas se não estiver bloqueado */}
     {!isBlocked && children}
     
     {/* Modal de bloqueio para desktop */}
     {platform === 'desktop' && <DesktopBlockModal />}
     
     {/* Modal de instalação obrigatória para mobile */}
     {showModal && platform !== 'desktop' && (
       <PWAInstallModal
         platform={platform}
         onInstall={handleInstallPrompt}
         onClose={handleCloseModal}
         isRequired={!isInstalled}
       />
     )}
   </PWAInstallContext.Provider>
 )
}