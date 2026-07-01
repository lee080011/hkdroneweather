const CACHE_NAME = 'drone-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html', // 💡 如果你個 HTML 叫其他名，記得改返呢度
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// ⏳ 1. 安裝階段：將網頁骨架寫入手機 Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('🚀 App 靜態資源已成功快取！');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// ⚡ 2. 攔截請求：優先讀取快取，極速開 App
self.addEventListener('fetch', event => {
  // 天氣 API 與搜尋 API 需要即時數據，不進行快取攔截
  if (event.request.url.includes('api.open-meteo.com') || event.request.url.includes('photon.komoot.io')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});