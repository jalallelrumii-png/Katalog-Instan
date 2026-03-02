import { supabase } from './supabase-config.js'

// Helper aman untuk mendapatkan elemen
function getElement(id) {
    const el = document.getElementById(id)
    if (!el) console.warn(`⚠️ Elemen dengan ID "${id}" tidak ditemukan.`)
    return el
}

// Konfigurasi password (opsional)
const ADMIN_PASSWORD = "rahasia123"

// Fungsi login
window.checkPassword = function() {
    const pwInput = getElement('passwordInput')
    if (!pwInput) return
    if (pwInput.value === ADMIN_PASSWORD) {
        const loginSection = getElement('loginSection')
        const adminPanel = getElement('adminPanel')
        if (loginSection) loginSection.classList.add('hidden')
        if (adminPanel) adminPanel.classList.remove('hidden')
        loadAdminData()
    } else {
        alert('Password salah!')
    }
}

// Muat data dari Supabase
async function loadAdminData() {
    try {
        // Settings
        const { data: settings, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single()
        if (settingsError) throw settingsError

        const namaTokoInput = getElement('namaToko')
        const nomorWAInput = getElement('nomorWA')
        if (namaTokoInput) namaTokoInput.value = settings.nama_toko || ''
        if (nomorWAInput) nomorWAInput.value = settings.nomor_wa || ''

        // Produk
        const { data: produk, error: produkError } = await supabase
            .from('produk')
            .select('*')
            .order('id', { ascending: true })
        if (produkError) throw produkError

        renderProdukList(produk)
    } catch (error) {
        console.error('Gagal load data:', error)
        alert('Gagal memuat data: ' + error.message)
    }
}

// Render daftar produk
function renderProdukList(produk) {
    const container = getElement('produkList')
    if (!container) return
    if (!produk || produk.length === 0) {
        container.innerHTML = '<p class="text-center text-slate-500 py-8">Belum ada produk.</p>'
        return
    }
    container.innerHTML = produk.map(p => `
        <div class="flex items-center gap-4 bg-slate-50 p-3 rounded-lg">
            <img src="${p.image_url}" alt="${p.name}" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-semibold">${p.name}</h3>
                <p class="text-sm text-slate-600">Rp ${p.price.toLocaleString('id-ID')}</p>
            </div>
            <button onclick="editProduk(${p.id})" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
            <button onclick="hapusProduk(${p.id})" class="bg-red-500 text-white px-3 py-1 rounded text-sm">Hapus</button>
        </div>
    `).join('')
}

// Simpan settings
window.simpanSettings = async function() {
    const namaToko = getElement('namaToko')?.value
    const nomorWA = getElement('nomorWA')?.value
    if (!namaToko || !nomorWA) return alert('Semua field harus diisi!')
    try {
        const { error } = await supabase
            .from('settings')
            .update({ nama_toko: namaToko, nomor_wa: nomorWA, updated_at: new Date() })
            .eq('id', 1)
        if (error) throw error
        alert('✅ Pengaturan disimpan')
    } catch (error) {
        alert('Gagal: ' + error.message)
    }
}

// Modal functions
window.tambahProduk = function() {
    const modal = getElement('modal')
    if (!modal) return
    getElement('modalTitle').textContent = 'Tambah Produk'
    getElement('produkId').value = ''
    getElement('namaProduk').value = ''
    getElement('hargaProduk').value = ''
    getElement('deskripsiProduk').value = ''
    getElement('gambarProduk').value = ''
    modal.classList.remove('hidden')
}

window.editProduk = async function(id) {
    try {
        const { data: produk, error } = await supabase
            .from('produk')
            .select('*')
            .eq('id', id)
            .single()
        if (error) throw error

        getElement('modalTitle').textContent = 'Edit Produk'
        getElement('produkId').value = produk.id
        getElement('namaProduk').value = produk.name
        getElement('hargaProduk').value = produk.price
        getElement('deskripsiProduk').value = produk.description
        getElement('gambarProduk').value = produk.image_url
        getElement('modal').classList.remove('hidden')
    } catch (error) {
        alert('Gagal muat produk: ' + error.message)
    }
}

window.tutupModal = function() {
    const modal = getElement('modal')
    if (modal) modal.classList.add('hidden')
}

window.simpanProduk = async function() {
    const id = getElement('produkId')?.value
    const name = getElement('namaProduk')?.value
    const price = parseInt(getElement('hargaProduk')?.value)
    const description = getElement('deskripsiProduk')?.value
    const image_url = getElement('gambarProduk')?.value

    if (!name || !price || !description || !image_url) {
        return alert('Semua field harus diisi!')
    }

    try {
        if (id) {
            // Update
            const { error } = await supabase
                .from('produk')
                .update({ name, price, description, image_url, updated_at: new Date() })
                .eq('id', id)
            if (error) throw error
            alert('✅ Produk diupdate')
        } else {
            // Insert
            const { error } = await supabase
                .from('produk')
                .insert([{ name, price, description, image_url }])
            if (error) throw error
            alert('✅ Produk ditambahkan')
        }
        tutupModal()
        loadAdminData()
    } catch (error) {
        alert('Gagal simpan: ' + error.message)
    }
}

window.hapusProduk = async function(id) {
    if (!confirm('Yakin hapus?')) return
    try {
        const { error } = await supabase
            .from('produk')
            .delete()
            .eq('id', id)
        if (error) throw error
        alert('✅ Produk dihapus')
        loadAdminData()
    } catch (error) {
        alert('Gagal hapus: ' + error.message)
    }
}

// Inisialisasi
if (getElement('adminPanel')) {
    loadAdminData()
} else {
    console.error('Elemen adminPanel tidak ditemukan.')
}
