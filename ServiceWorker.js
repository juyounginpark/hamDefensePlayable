const cacheName = "DefaultCompany-hamdefense-0.1.0-logo-size-1";
const contentToCache = [
    "Build/HamDefense.loader.js",
    "Build/HamDefense.framework.js",
    "Build/HamDefense.data",
    "Build/HamDefense.wasm",
    "TemplateData/style.css",
    "game.html"

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
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
