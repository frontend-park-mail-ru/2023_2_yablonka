const CacheKey = 'cache-tabula';

const initCache = () => {
    return caches.open(CacheKey).then(
        (cache) => {
            return cache.addAll(['/index.html', '/img/', '/svg/']);
        },
        (error) => {
            console.log(error);
        },
    );
};

const tryNetwork = (req, timeout) => {
    return new Promise((resolve, reject) => {
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
};

const getFromCache = (req) => {
    return caches.open(CacheKey).then((cache) => {
        return cache.match(req).then((result) => {
            return result || Promise.reject('no-match');
        });
    });
};

self.addEventListener('install', (e) => {
    e.waitUntil(initCache());
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CacheKey) {
                        return caches.delete(key);
                    }
                }),
            );
        }),
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(tryNetwork(e.request, 400).catch(() => getFromCache(e.request)));
});
