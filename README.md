# 💀 AUDITGELAP: Protokol Akuntabilitas Radikal

> **"Kebenaran sebelum kenyamanan. Eksekusi atau akui kegagalan Anda secara finansial."**

---

## 🚩 APA INI?
**Auditgelap** bukan asisten produktivitas yang akan memuji kemajuan kecil Anda. Ini adalah mesin **otopsi finansial** yang dirancang untuk membongkar setiap alasan yang Anda buat. Kami mengubah prokrastinasi menjadi angka kerugian riil (IDR) untuk memaksa Anda berhenti membohongi diri sendiri.

## 🛠️ FITUR UTAMA
- **Brutal Logic Audit:** AI-driven diagnosis yang membedah rencana Anda dan mencari celah kemalasan terselubung.
- **Opportunity Cost Engine:** Kalkulasi otomatis kerugian aset akibat penundaan waktu secara real-time.
- **Arsip Dosa (The Hall of Shame):** Rekam jejak permanen setiap deadline yang Anda langgar. Anda tidak bisa menghapusnya.
- **The Punisher Protocol:** Notifikasi agresif dan Weekly Roast Intelligence untuk menghancurkan mood malas.
- **Execution Verifier:** Audit integritas berbasis data untuk setiap klaim penyelesaian tugas.

## 🚀 TEKNOLOGI (THE STACK)
- **Frontend:** Next.js 15 + Tailwind CSS + ShadCN UI
- **Intelligence:** Genkit + Gemini 2.5 Flash (The Dark Analyst)
- **Backend:** Firebase Firestore & Auth
- **Payment:** Midtrans Snap SDK (Protokol Penebusan Dosa)

## ⚙️ KONFIGURASI MANDIRI (MIDTRANS)
Untuk mengaktifkan fitur pembayaran "Penebusan Dosa", Anda wajib mengatur API Keys Midtrans:

1. Salin file `.env.example` menjadi `.env`.
2. Masukkan `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY` dari dashboard Midtrans Sandbox Anda.
3. Restart server pengembangan.

```bash
cp .env.example .env
# Edit .env dengan key Anda
```

## ⚠️ PERINGATAN
Sistem ini menggunakan **Client-Side SDK** untuk semua operasi database. Keamanan diatur secara ketat melalui **Firestore Security Rules**. Jangan memodifikasi aturan tersebut tanpa memahami dampaknya terhadap integritas protokol.

## 🛠️ INSTALASI LOKAL
1. Clone repository:
   ```bash
   git clone https://github.com/Adz1207/auditgelap.git
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
