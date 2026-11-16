/* US Portfolio Desk launcher — service worker v1.18.2
   ทำหน้าที่เดียว: ให้หน้าเปิดแอปและไอคอนโหลดได้แม้ออฟไลน์ ตัวแอปจริง (Apps Script) ไม่ผ่านตัวนี้เลย
   เปลี่ยนเลขเวอร์ชันของ CACHE ทุกครั้งที่แก้ไฟล์ในโฟลเดอร์นี้ เพื่อให้เครื่องที่ติดตั้งไว้ดึงไฟล์ใหม่ */
var CACHE = 'usd-launcher-v1.18.2';
var SHELL = ['./', './index.html', './config.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
/* network first (ไฟล์เล็ก ได้ของใหม่เสมอ เช่นหลังแก้ config.js) แล้วค่อยถอยไปใช้ที่เก็บไว้เมื่อออฟไลน์ เฉพาะไฟล์ในโดเมนนี้ */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () { return caches.match(req).then(function (m) { return m || caches.match('./index.html'); }); }));
});
