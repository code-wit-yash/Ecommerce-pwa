// 📌 Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/Ecommerce-pwa/service-worker.js')
    .then(reg => console.log('✅ Service Worker Registered!', reg.scope))
    .catch(err => console.log('❌ Service Worker Registration Failed!', err));
}



// 📌 Cart Functionality
let cart = [];


function addToCart(name, price) {
    cart.push({ name, price });
    displayCart();
}


function displayCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";
    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        cartList.appendChild(li);
    });
}


// Check if Notifications & Service Worker are supported
if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("🔔 Notification permission granted!");


            // Now register service worker AFTER permission is granted
            navigator.serviceWorker.register("/service-worker.js")
                .then((reg) => console.log("✅ Service Worker Registered!", reg.scope))
                .catch((err) => console.error("❌ Service Worker Registration Failed!", err));
        } else {
            console.log("❌ Notification permission denied!");
        }
    });
} else {
    console.log("❌ Notifications or Service Workers are not supported in this browser.");
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;

    const installBtn = document.createElement("button");
    installBtn.innerText = "📲 Install App";
    installBtn.style.position = "fixed";
    installBtn.style.bottom = "20px";
    installBtn.style.right = "20px";
    installBtn.style.padding = "10px 20px";
    installBtn.style.background = "#007BFF";
    installBtn.style.color = "#fff";
    installBtn.style.border = "none";
    installBtn.style.borderRadius = "5px";
    installBtn.style.cursor = "pointer";
    document.body.appendChild(installBtn);

    installBtn.addEventListener("click", () => {
        installBtn.style.display = "none";
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User installed the PWA");
            } else {
                console.log("User dismissed the PWA install");
            }
            deferredPrompt = null;
        });
    });
});
