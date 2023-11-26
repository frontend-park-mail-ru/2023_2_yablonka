const CacheKey = 'cache-tabula';

const initCache = () =>
    caches.open(CacheKey).then(
        (cache) => cache.addAll(['/index.html']),
        (error) => {
            console.log(error);
        },
    );

const tryNetwork = (req) =>
    new Promise((resolve, reject) => {
        fetch(req).then(
            (res) => {
                const responseClone = res.clone();
                caches.open(CacheKey).then((cache) => {
                    cache.put(req, responseClone);
                });
                resolve(res);
            },
            (error) => {
                if (navigator.onLine) {
                    reject(error);
                } else {
                    reject(new Error('No internet connection'));
                }
            },
        );
    });

const getFromCache = (req) =>
    caches
        .open(CacheKey)
        .then((cache) => cache.match(req).then((result) => result || Promise.reject('no-match')));

self.addEventListener('install', (e) => {
    e.waitUntil(initCache());
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (key !== CacheKey) {
                        return caches.delete(key);
                    }
                }),
            )),
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(tryNetwork(e.request).catch(() => getFromCache(e.request)));
});
