//Service Worker file: save the cached files and manage the offline functionality

const CACHE_NAME = 'my-pwa-cache-v1';
const assets = [
    'index.html',
    'css/styles.css',
    'js/app.js',
    'js/logicIndex.js',
    'js/logicKitchen.js',
    'js/logicMoney.js',
    'js/storage.js',
    'manifest.json',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos cacheando...');
        return cache.addAll(assets);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
})