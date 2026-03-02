# KatalogInstan - PWA untuk UMKM

Panduan sederhana untuk mengganti nomor WhatsApp dan katalog produk.

## Cara Mengganti Nomor WhatsApp Toko

1. Buka file `app.js`.
2. Cari bagian `KONFIGURASI TOKO` (sekitar baris 5-8).
3. Ubah nilai `nomorWA` dengan nomor WhatsApp Anda dalam format internasional tanpa tanda `+` atau spasi.
   Contoh: `6281234567890` (untuk nomor Indonesia 0812-3456-7890).
4. Ubah juga `nama` toko sesuai keinginan.

## Cara Mengganti Daftar Produk

1. Di file `app.js`, cari array `products` (sekitar baris 11-18).
2. Setiap produk memiliki properti:
   - `id` : nomor unik (jangan sama)
   - `name` : nama produk
   - `price` : harga dalam angka (tanpa titik)
   - `description` : deskripsi singkat
   - `image` : URL gambar produk (pastikan gambar bisa diakses publik, dan ukurannya proporsional)
3. Tambah, hapus, atau ubah sesuai kebutuhan.
4. Jika ingin produk baru muncul di JSON-LD (untuk SEO), Anda juga perlu memperbarui script JSON-LD di `index.html` (sekitar baris 35-100) secara manual. Atau Anda bisa menghapus JSON-LD statis tersebut dan membuatnya dinamis, namun untuk kemudahan kami sarankan sesuaikan dengan produk yang ada.

## Kustomisasi Tampilan

- Warna utama (tombol, badge) menggunakan `bg-emerald-600`. Ubah di class Tailwind jika ingin warna lain.
- Font sudah menggunakan 'Inter' dari Google Fonts.

## Deploy ke Hosting

Upload semua file ke hosting statis (Netlify, Vercel, atau GitHub Pages). Pastikan file `manifest.json` dan `service-worker.js` berada di root agar PWA berfungsi.

## Mode Offline

Gambar produk akan disimpan secara otomatis setelah pertama kali dibuka, sehingga katalog tetap bisa dilihat tanpa koneksi internet (untuk produk yang sudah pernah dimuat gambarnya).

Selamat berjualan! 🚀