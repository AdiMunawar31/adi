const CACHE_NAME = 'pwa-v1';
let urlsToCache = [
    '/',
    '/fallback.json',
    '/index.html',
    '/css/bootstrap.min.css',
    '/js/bootstrap.min.js',
    '/js/Jquery3.4.1.min.js',
    '/js/main.js',
    '/js/marquee.js',
    '/img/1.png',
    '/img/2.png',
    '/img/3.png',
    '/img/logo.png',
    '/img/pwa.svg',
];

self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
})

self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(cacheName != CACHE_NAME){	
						console.log("ServiceWorker: cache " + cacheName + " dihapus");
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
})

self.addEventListener('fetch', function (event) {
    
    let request = event.request;
    let url = new URL(request.url)

    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request)
                .then(function (response) {
                return response || fetch(request)
            })
        );
        
    } else {
        event.respondWith(
            caches.open('product-cache').then(function (cache) {
                    return fetch(request).then(function (liveResponse) {
                        cache.put(request, liveResponse.clone())
                        return liveResponse;
                    }).catch(function () {
                        return caches.match(request).then(function (response) {
                            if (response) {
                                return response
                            } else {
                                return caches.match('/fallback.json');
                            }
                    })
                })
            })
        )
    }

});

