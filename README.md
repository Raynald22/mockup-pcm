# PCM - Project Cost Monitoring (Mockup)

Dashboard mockup untuk monitoring biaya proyek dengan login system dan role-based access.

## Cara Menjalankan (Wajib Local Server)

Karena kebijakan keamanan browser (CORS), file `index.html` tidak bisa dibuka langsung. Harus menggunakan **Local Server**.

### Opsi 1: VS Code + Live Server (Disarankan)
1. Install extension **Live Server** di VS Code.
2. Buka folder project ini di VS Code.
3. Klik kanan pada file `login.html` atau `index.html`.
4. Pilih menu **"Open with Live Server"**.

### Opsi 2: Terminal (Node.js)
```bash
npx http-server
```
Buka `http://127.0.0.1:8080/login.html` di browser.

## Login Credentials

| Email | Password | Role |
|-------|----------|------|
| management@ogya.com | 123456 | Management |
| sales@ogya.com | 123456 | Sales |
| finance@ogya.com | 123456 | Finance |

Default form sudah terisi `management@ogya.com` / `123456`.
