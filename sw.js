/* Service worker — cache hors-ligne pour « Président·e du Peuple » */
const CACHE = "ppp2027-v29";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./js/audio.js",
  "./js/art.js",
  "./js/data.js",
  "./js/game.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./assets/fonts/UnionGothic.ttf",
  "./assets/fonts/StackSansText-Regular.ttf",
  "./assets/fonts/StackSansText-SemiBold.ttf",
  "./assets/fonts/StackSansText-Bold.ttf",
  "./assets/brand/m27-creme.png",
  "./assets/brand/lfi-violet.png",
  "./assets/turtle2/MICROS.png",
  "./assets/turtle2/HOURA.png",
  "./assets/turtle2/QUI_POUSSE.png",
  "./assets/turtle2/QUI_POINTE.png",
  "./assets/turtle/turtle-scooter.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => cached))
  );
});
