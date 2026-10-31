// Offline support for the installed game.
// The page itself: try the network first so uploads reach players, fall back to the saved copy after 3 seconds or when offline.
// Icons and fonts: use the saved copy.
const CACHE = "pour-decisions-v1";
const FONTS_CSS = "https://fonts.googleapis.com/css2?family=Shrikhand&family=Playfair+Display:ital,wght@1,700;1,800&family=Figtree:wght@400;600;800&family=JetBrains+Mono:wght@500&display=swap";
const FILES = ["./", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-48.png"];

// Save the fonts up front. If this fails the game still works, just with fallback fonts.
async function saveFonts(cache) {
  try {
    const css = await fetch(FONTS_CSS, { mode: "cors" });
    await cache.put(FONTS_CSS, css.clone());
    const urls = (await css.text()).match(/https:\/\/fonts\.gstatic\.com\/[^)'"\s]+/g) || [];
    await Promise.all([...new Set(urls)].map(async u => cache.put(u, await fetch(u, { mode: "cors" }))));
  } catch {}
}

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(async cache => {
    await cache.addAll(FILES);
    await saveFonts(cache);
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function pageFirst(request) {
  const cache = await caches.open(CACHE);
  const network = fetch(request).then(res => {
    if (res.ok) cache.put("./", res.clone());
    return res;
  });
  const saved = await cache.match("./");
  if (!saved) return network;
  const timeout = new Promise(r => setTimeout(r, 3000, saved));
  return Promise.race([network.catch(() => saved), timeout]);
}

async function savedFirst(request) {
  const cache = await caches.open(CACHE);
  const saved = await cache.match(request, { ignoreVary: true });
  if (saved) return saved;
  const res = await fetch(request);
  if (res.ok || res.type === "opaque") cache.put(request, res.clone());
  return res;
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (e.request.mode === "navigate") return e.respondWith(pageFirst(e.request));
  if (url.origin === location.origin || url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) e.respondWith(savedFirst(e.request));
});
