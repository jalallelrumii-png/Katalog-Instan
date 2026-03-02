const IMAGE_CACHE = 'katalog-images-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    const request = event.request;

    // Cache-first untuk gambar
    if (request.destination === 'image' || request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)/i)) {
        event.respondWith(
            caches.open(IMAGE_CACHE).then(cache => {
                return cache.match(request).then(cached => {
                    if (cached) return cached;
                    return fetch(request).then(networkResponse => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // Network-first untuk lainnya
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});