const CACHE_NAME = 'wally-v1.0.0';
const STATIC_CACHE = 'wally-static-v1.0.0';
const API_CACHE = 'wally-api-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  images: 'cache-first',
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      self.skipWaiting(),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
});

async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request) || caches.match('/offline.html');
  }
}

async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match('/offline.html');
  }
}