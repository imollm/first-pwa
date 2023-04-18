// https://github.com/firtman/frontendmasters-pwa
const assets = [
    '/',
    'styles.css',
    'app.js',
    'sw-register.js',
    'app.webmanifest',
    'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
]

self.addEventListener('install', event => {
    const preCache = async () => {
        const cache = await caches.open('assets')
        cache.addAll(assets)
    }
    event.waitUntil(preCache())
})

self.addEventListener('fetch', event => {
    const cacheSearch = async () => {
        const cache = await caches.open('assets')
        const cacheRes = await cache.match(event.request)
        return cacheRes
    }

    const updateResource = async () => {
        const response = await fetch(event.request)
        const cache = await caches.open('assets')
        cache.put(event.request, response.clone())
        return response
    }

    const fetchResource = async () => {
        const cached = await cacheSearch()
        const fetched = await updateResource()

        return cached || fetched
    }

    const url = new URL(event.request.url)
    assets.forEach(asset => {
        if (url.pathname.includes(asset)) {
            event.respondWith(fetchResource())
            return false
        }
    })
})