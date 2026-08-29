const cacheName = "DefaultCompany-hamdefense-alpha-1.0.0";
const contentToCache = [
    "Build/HamDefense.loader.js",
    "Build/HamDefense.framework.js.unityweb",
    "Build/HamDefense.data.unityweb",
    "Build/HamDefense.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    self.skipWaiting();

    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('activate', function (e) {
    e.waitUntil((async function () {
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)));
      await self.clients.claim();
    })());
});

self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') { return; }

    e.respondWith((async function () {
      try {
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
      } catch (error) {
        return caches.match(e.request);
      }
    })());
});
