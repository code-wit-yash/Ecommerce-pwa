//testing
const CACHE_NAME = "ecommerce-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/offline.html",
    "/Images/product1.jpg",
    "/Images/product2.jpg"
];


// 📌 1️⃣ Install Event - Cache Static Assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }).catch((err) => console.error("Cache addAll failed:", err))
    );
});


// 📌 2️⃣ Activate Event - Remove Old Caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});


// 📌 3️⃣ Fetch Event - Serve Cached Files if Offline
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match("/offline.html"); // Fallback for offline
        })
    );
});


// 📌 4️⃣ Sync Event - Sync Orders When Online
self.addEventListener("sync", (event) => {
    if (event.tag === "sync-orders") {
        event.waitUntil(
            sendPendingOrders().then(() => {
                console.log("Orders successfully synced!");
            })
        );
    }
});


// Mock function to simulate sending offline orders
function sendPendingOrders() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("✅ Pending orders sent to the server!");
            resolve();
        }, 3000);
    });
}


// 📌 5️⃣ Push Notification Event - Show Notifications
self.addEventListener("push", (event) => {
    const options = {
        body: "🔥 Big Sale! 50% Off on All Items!",
        icon: "/images/product1.jpg",
        badge: "/images/product2.jpg",
        vibrate: [200, 100, 200],
        actions: [
            { action: "shop", title: "🛒 Shop Now" },
            { action: "close", title: "❌ Dismiss" }
        ]
    };


    event.waitUntil(
        self.registration.showNotification("E-commerce PWA", options)
    );
});
