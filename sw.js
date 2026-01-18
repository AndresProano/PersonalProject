//Service Worker file: save the cached files and manage the offline functionality

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            document.getElementById('status').textContent = 'Service Worker Registered';
        }).catch(error => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}

const CACHE_NAME = 'my-pwa-cache-v1';
const assets = [
    'index.html',
    'css/styles.css',
    'js/app.js',
    'js/logicIndex.js',
    'js/logicKitchen.js',
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