const CACHE = 'meaning-reader-v7';
const CORE = [
  './',
  './index.html',
  './book.html',
  './manifest.webmanifest',
  './assets/reader-marker.js',
  './assets/app-icon.svg',
  './TESTING_FIELD.md',
  './testing/',
  './testing/index.html',
  './posts/001-meaning-is-not-everything.html',
  './posts/002-enough-is-a-shape.html',
  './posts/003-the-whole-world-in-a-doorway.html',
  './posts/004-the-whole-field.html',
  './posts/005-the-testing-field.html',
  './posts/006-completion-makes-continuation-possible.html',
  './posts/007-jog-your-imagination.html',
  './posts/008-what-remains.html',
  './posts/009-the-sentence-is-not-the-landing.html',
  './posts/010-completion-can-reopen.html',
  './posts/011-a-correction-is-not-a-rewind.html',
  './posts/012-how-much-can-a-small-thing-carry.html',
  './posts/013-enough-between-us.html',
  './posts/014-leave-a-way-back.html'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});