
    const cacheName = 'LLT',
    items = [
        './',
        '/index.html',
        '/css/main.css',
        '/js/main.js',
        '/js/components/about.js',
        '/js/components/db.js',
        '/js/components/questions.js'
    ];

    self.oninstall = e => {
        e.waitUntil(
            caches.open(cacheName)
            .then(cache => cache.addAll(items))
        );
        self.skipWaiting();
    }

    self.onactivate = e => {
        caches.keys().then(cacheNames => Promise.all(cacheNames.map( name => {
            if (!cacheName.includes(name)){
                return caches.delete(name);
            }
        })))
    }

    self.onfetch = e => {
        e.respondWith(caches.match(e.request)
        .then(res => {
            if(res){
                return (res);
            }

            return fetch(e.request).then(res => {
                if (!res || res !== 200 || res.type !== 'basic') {
                    return (res);
                }
                let cacheRes = res.clone();
                caches.open(cacheName).then(cache => {
                    cache.put(e.request, cacheRes);
                });
                return (res);
            }).catch(err => console.error(err));

        }));
    }

