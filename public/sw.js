const CACHE_NAME = "ariana-pwa-cache-v3";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/robots.txt",
  "/logo512.png",
  "/logo192.png"
];

// Install stage - pre-cache critical components
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate stage - purge elements from older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch events - Network first, with cache fallback
self.addEventListener("fetch", (event) => {
  // Only handle standard GET, do NOT cache API calls
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid, save to cache and return
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network is unavailable
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Default index.html fallback for navigation
          if (event.request.mode === "navigate") {
            return caches.match("/index.html") || caches.match("/");
          }
        });
      })
  );
});
