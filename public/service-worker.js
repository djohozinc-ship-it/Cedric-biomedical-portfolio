const CACHE_NAME = 'cedric-biomedical-portfolio-v2';
const BASE_PATH = '/Cedric-biomedical-portfolio/';
const APP_SHELL = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}favicon.png`,
  `${BASE_PATH}logo192.png`,
  `${BASE_PATH}logo512.png`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Vidéos / audio : on laisse le navigateur gérer directement (requêtes partielles « Range »).
  // Les passer par le cache casse la lecture et alourdit inutilement le stockage.
  const url = new URL(event.request.url);
  if (event.request.headers.has('range') || /\.(mp4|webm|mp3|ogg)$/i.test(url.pathname)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(`${BASE_PATH}index.html`)))
  );
});
