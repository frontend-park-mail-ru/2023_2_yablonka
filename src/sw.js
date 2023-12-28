const CacheKey = 'cache-tabula';

const initCache = () => caches.open(CacheKey).then((cache) => cache.addAll(['/index.html']));

const tryNetwork = (req) =>
    new Promise((resolve, reject) => {
        fetch(req)
            .then(
                (res) => {
                    const responseClone = res.clone();
                    caches
                        .open(CacheKey)
                        .then((cache) => {
                            cache.put(req, responseClone).catch();
                        })
                        .catch();
                    resolve(res);
                },
                (error) => {
                    if (navigator.onLine) {
                        reject(error);
                    } else {
                        reject(new Error('No internet connection'));
                    }
                },
            )
            .catch();
    });

const getFromCache = (req) =>
    caches.open(CacheKey).then((cache) => cache.match(req).then((result) => result));

self.addEventListener('install', (e) => {
    e.waitUntil(initCache());
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches
            .keys()
            .then((keyList) =>
                Promise.all(
                    keyList.forEach((key) => (key !== CacheKey ? caches.delete(key) : undefined)),
                ),
            ),
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(tryNetwork(e.request).catch(() => getFromCache(e.request)));
});
