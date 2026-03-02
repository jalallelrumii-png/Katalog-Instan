// app.js

let TOKO = { nama: "", nomorWA: "" };
let products = [];

// Elemen DOM
const productGrid = document.getElementById('productGrid');
const cartBadge = document.getElementById('cartBadge');
const overlay = document.getElementById('overlay');
const detailSheet = document.getElementById('detailSheet');
const cartSheet = document.getElementById('cartSheet');
const closeDetail = document.getElementById('closeDetail');
const closeCart = document.getElementById('closeCart');
const cartButton = document.getElementById('cartButton');
const detailContent = document.getElementById('detailContent');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

let cart = []; // { id, name, price, qty, image }

// Muat data dari data.json
async function loadData() {
    try {
        const res = await fetch('data.json');
        const data = await res.json();
        TOKO = data.toko;
        products = data.produk;
        renderProducts();
        updateCartUI();
        updateJsonLd(products);
    } catch (err) {
        console.error('Gagal memuat data:', err);
    }
}

// Perbarui JSON-LD untuk SEO
function updateJsonLd(products) {
    const itemList = products.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
            "@type": "Product",
            "name": p.name,
            "description": p.description,
            "image": p.image,
            "offers": {
                "@type": "Offer",
                "price": p.price,
                "priceCurrency": "IDR"
            }
        }
    }));
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": itemList
    };
    const oldScript = document.querySelector('script[type="application/ld+json"]');
    if (oldScript) oldScript.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
}

// Render grid produk
function renderProducts() {
    productGrid.innerHTML = products.map(p => `
        <div class="product-card bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer" data-id="${p.id}">
            <div class="aspect-square bg-slate-100">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover fade-img" loading="lazy" onload="this.classList.add('loaded')">
            </div>
            <div class="p-3">
                <h3 class="font-medium text-sm truncate">${p.name}</h3>
                <p class="text-emerald-600 font-semibold mt-1">Rp ${p.price.toLocaleString('id-ID')}</p>
            </div>
        </div>
    `).join('');
}

// Bottom sheet controls
function openSheet(sheet) {
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    sheet.classList.remove('translate-y-full');
}

function closeAllSheets() {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    detailSheet.classList.add('translate-y-full');
    cartSheet.classList.add('translate-y-full');
}

// Detail produk
function showDetail(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    detailContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-xl fade-img" onload="this.classList.add('loaded')">
        <div class="mt-4">
            <h3 class="text-xl font-semibold">${product.name}</h3>
            <p class="text-emerald-600 text-lg font-bold mt-1">Rp ${product.price.toLocaleString('id-ID')}</p>
            <p class="text-slate-600 mt-2 text-sm">${product.description}</p>
            <button class="w-full mt-5 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition shadow-sm add-to-cart-detail" data-id="${product.id}">
                + Tambah ke Keranjang
            </button>
        </div>
    `;

    document.querySelector('.add-to-cart-detail').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id);
        closeAllSheets();
    });

    openSheet(detailSheet);
}

// Keranjang
function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id == productId);
    if (index !== -1) {
        if (cart[index].qty > 1) {
            cart[index].qty -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="text-center text-slate-500 py-6">Keranjang masih kosong</p>';
        cartTotalSpan.textContent = 'Rp 0';
        return;
    }

    let total = 0;
    const itemsHtml = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium text-sm">${item.name}</h4>
                    <p class="text-emerald-600 text-sm font-semibold">Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 minus-btn" data-id="${item.id}">−</button>
                    <span class="w-5 text-center">${item.qty}</span>
                    <button class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 plus-btn" data-id="${item.id}">+</button>
                </div>
            </div>
        `;
    }).join('');

    cartItemsDiv.innerHTML = itemsHtml;
    cartTotalSpan.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromCart(btn.dataset.id);
        });
    });
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(btn.dataset.id);
        });
    });
}

// Checkout WA
function checkoutWA() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong');
        return;
    }

    const itemLines = cart.map(item => `- ${item.name} x${item.qty}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalFormatted = `Rp ${total.toLocaleString('id-ID')}`;
    
    const message = `Halo *${TOKO.nama}*, saya mau pesan:\n${itemLines}\n\nTotal: ${totalFormatted}\nAlamat Pengiriman: ...\n\nTerima kasih.`;
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${TOKO.nomorWA}?text=${encoded}`;
    
    window.open(waUrl, '_blank');
}

// Event listeners
document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
        showDetail(card.dataset.id);
    }
});

closeDetail.addEventListener('click', closeAllSheets);
closeCart.addEventListener('click', closeAllSheets);
overlay.addEventListener('click', closeAllSheets);

cartButton.addEventListener('click', () => {
    updateCartUI();
    openSheet(cartSheet);
});

checkoutBtn.addEventListener('click', checkoutWA);

// Inisialisasi
loadData();

// Daftarkan Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    });
}