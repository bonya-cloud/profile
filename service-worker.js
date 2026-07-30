// Минимальный service worker — нужен браузеру, чтобы считать сайт
// "устанавливаемым" (PWA). Кэширует главную страницу для базовой
// работы офлайн, остальное всегда берёт из сети.

const CACHE_NAME = 'discoragen-shell-v1';
const SHELL_FILES = ['./', './index.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
