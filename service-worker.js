const IMAGE_CACHE = 'katalog-images-v1'

self.addEventListener('install', event => {
    self.skipWaiting()
})

self.addEventListener('fetch', event => {
    const request = event.request
    if (request.destination === 'image' || request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)/i)) {
        event.respondWith(
            caches.open(IMAGE_CACHE).then(cache =>
                cache.match(request).then(cached => cached || fetch(request).then(res => {
                    cache.put(request, res.clone())
                    return res
                }))
            )
        )
        return
    }
    event.respondWith(fetch(request).catch(() => caches.match(request)))
})

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim())
})
