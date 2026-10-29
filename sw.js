// Permite instalar la app y abrirla aunque la señal esté mala.
// La página siempre busca primero la versión nueva (así las actualizaciones llegan solas).
const CACHE = "divisor-v10-entregados";
const BASE = ["./", "./index.html", "./paquetes.html", "./estados.html", "./manifest.webmanifest", "./iconos/icono-192.png", "./iconos/icono-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // SpeedX/Supabase: nunca de la caché
  e.respondWith(fetch(e.request).then((r) => {
    const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); return r;
  }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html"))));
});
