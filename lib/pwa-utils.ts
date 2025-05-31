// lib/pwa-utils.ts
export const isPWAInstalled = (): boolean => {
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
  
  // Verificar user agent para detectar PWA (WebView)
  if (navigator.userAgent.includes('wv')) {
    return true
  }
  
  return false
}

export const isDesktop = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobi|android|iphone|ipad|ipod/i.test(userAgent)
  return !isMobile
}

export const getPlatform = (): 'ios' | 'android' | 'desktop' | 'unknown' => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobi|android|iphone|ipad|ipod/i.test(userAgent)
  
  if (!isMobile) {
    return 'desktop'
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  } else if (/android/.test(userAgent)) {
    return 'android'
  }
  return 'unknown'
}