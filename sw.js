const CACHE_NAME = 'delifrio-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instala o service worker e adiciona arquivos ao cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Ativa o service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
    ))
  );
});

// Intercepta requisições e retorna cache quando offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
          .then(response => response || fetch(event.request))
  );
});
