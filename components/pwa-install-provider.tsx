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


  useEffect(() => {
    const initializePWA = async () => {
      try {

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
        
        if (detectedPlatform === 'desktop') {
          setIsBlocked(true)
          setIsLoading(false)
          return
        }
        

        await new Promise(resolve => setTimeout(resolve, 1000))
        

        const checkIfInstalled = () => {

          if (window.matchMedia('(display-mode: standalone)').matches) {
            return true
          }
          

          if ((window.navigator as any).standalone === true) {
            return true
          }
          

          if (window.matchMedia('(display-mode: fullscreen)').matches) {
            return true
          }
          

          if (document.referrer.includes('android-app://')) {
            return true
          }
          

          if (navigator.userAgent.includes('wv')) {
            return true
          }
          
          return false
        }

        const installed = checkIfInstalled()
        setIsInstalled(installed)
        
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

 useEffect(() => {
   const handleAppInstalled = () => {
     setIsInstalled(true)
     setIsBlocked(false)
     setShowModal(false)
     setDeferredPrompt(null)
     setIsInstallable(false)
     
     setTimeout(() => {
       window.location.reload()
     }, 1000)
   }

   window.addEventListener('appinstalled', handleAppInstalled)

   return () => {
     window.removeEventListener('appinstalled', handleAppInstalled)
   }
 }, [])

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

   if (!isInstalled && platform !== 'desktop') {
     return
   }
   setShowModal(false)
 }

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
     {!isBlocked && children}
     
     {platform === 'desktop' && <DesktopBlockModal />}
     
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