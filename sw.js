/* ══ GrenadyeHub Service Worker — Offline Support ══ */

const CACHE_NAME = 'grenadyehub-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html'
];

/* Install — cache fichye prensipal yo */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

/* Activate — netwaye ansyen cache */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

/* Fetch — Network First, fallback to Cache */
self.addEventListener('fetch', (event) => {
    /* Sèlman GET requests */
    if (event.request.method !== 'GET') return;

    /* Pa cache external APIs (worldcup26.ir, thesportsdb, web3forms, etc) */
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return; /* Kite navigatè jere yo nòmalman */
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                /* Sove kopi fre nan cache */
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                /* Offline — sèvi ak cache */
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    /* Fallback final pou paj prensipal */
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                });
            })
    );
});
