# PCM Mockup

Project ini menggunakan arsitektur modular dengan Javascript `fetch()` untuk memuat halaman. 

## Cara Menjalankan (Wajib Local Server)

Karena kebijakan keamanan browser (CORS), jadi gabisa buka file `index.html` secara langsung. Harus menggunakan **Local Server**.

### Opsi 1: Menggunakan VS Code (Disarankan)
1. Install extension **Live Server** di VS Code.
2. Buka folder project ini di VS Code.
3. Klik kanan pada file `index.html`.
4. Pilih menu **"Open with Live Server"**.

### Opsi 2: Menggunakan Terminal (Node.js)
Jika Anda memiliki Node.js terinstall:
1. Buka terminal di folder project ini.
2. Jalankan perintah:
   ```bash
   npx http-server
   ```
3. Buka alamat yang muncul (biasanya `http://127.0.0.1:8080`) di browser.
