const CACHE_NAME = 'jp-furnishing-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app-icon-192.png',
  '/app-icon-512.png',
  '/home-bg.jpg'
];

// Install: Cache basic assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache-first for images/assets, Network-first for others
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API calls
  if (url.pathname.startsWith('/api')) return;

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;

      return fetch(request).then((networkResponse) => {
        // Cache new static assets
        if (request.method === 'GET' && 
            (url.origin === self.location.origin) &&
            (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2)$/))) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cacheCopy);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback for HTML
      if (request.headers.get('accept').includes('text/html')) {
        return caches.match('/');
      }
    })
  );
});
