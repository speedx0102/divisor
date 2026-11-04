// AFLEX PDA: abre aunque la señal esté mala. Siempre busca primero la versión nueva.
const CACHE = "aflex-pda-v4";
const BASE = ["./", "./index.html", "./manifest.webmanifest", "./vendor/supabase.min.js", "./vendor/exceljs.min.js", "./iconos/icon-192.png", "./iconos/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("aflex-pda-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // SpeedX / Supabase: nunca de la caché
  e.respondWith(fetch(e.request).then((r) => {
    const copia = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); return r;
  }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html"))));
});
