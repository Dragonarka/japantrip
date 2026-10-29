// Service worker: permite instalar el sitio como app y usarlo sin señal.
// Páginas y datos propios: red primero (para ver siempre lo último) y caché si no hay conexión.
// CDN, fuentes, fotos y mapas: caché primero y se actualiza en segundo plano.
const VERSION = 'v11';
const CORE = `core-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;
const CORE_FILES = [
  './', 'index.html', 'trip-data.js', 'grupo-ades.html', 'alarms-data.js', 'alarmas.ics', 'schedule-data.js',
  'ades-japan-oct30-nov19.html', 'manifest.webmanifest',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];
const CDN_FILES = [
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.3',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CORE);
    await c.addAll(CORE_FILES);
    // Un CDN caído no debe impedir la instalación.
    await Promise.all(CDN_FILES.map(u => c.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keep = [CORE, RUNTIME];
    for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res.ok) (await caches.open(CORE)).put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    return req.mode === 'navigate' ? caches.match('index.html') : Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);
  const fresh = fetch(req).then(async res => {
    if (res.ok || res.type === 'opaque') (await caches.open(RUNTIME)).put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || fresh;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) e.respondWith(networkFirst(req));
  else e.respondWith(staleWhileRevalidate(req));
});
